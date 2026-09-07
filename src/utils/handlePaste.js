import { getSelectedBlock } from 'draftjs-utils';
import { Modifier, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { List } from 'immutable';

const filterConsecutiveEmptyBlocks = (blocks) =>
  blocks.filter((block, index, arr) => {
    if (block.getType() === 'unstyled' && block.getText().trim() === '') {
      const prev = arr[index - 1];
      return prev !== undefined && prev.getText().trim() !== '';
    }
    return true;
  });

const cleanHtml = (html) => {
  let cleaned = html
    .replace(/<(p|div)[^>]*>(\s|&nbsp;|<br\s*\/?>)*<\/(p|div)>/gi, '')
    .replace(/(<\/(?:h[1-6]|p|div|li|ul|ol|blockquote)>)\s*(<br\s*\/?>\s*)*/gi, '$1')
    .replace(/(<br\s*\/?>\s*)+(<(?:h[1-6]|p|div|li|ul|ol|blockquote))/gi, '$2');

  try {
    if (typeof DOMParser === 'undefined') return cleaned;
    const doc = new DOMParser().parseFromString(cleaned, 'text/html');
    doc.querySelectorAll('li').forEach((li) => {
      Array.from(li.childNodes).forEach((child) => {
        if (child.nodeType === 1 && /^(P|H[1-6])$/.test(child.tagName)) {
          const fragment = doc.createDocumentFragment();
          while (child.firstChild) fragment.appendChild(child.firstChild);
          li.replaceChild(fragment, child);
        }
      });
    });
    cleaned = doc.body.innerHTML;
  } catch (e) {
    // fall back to regex-only result
  }

  return cleaned;
};

const insertBlocks = (blocks, editorState, onChange, entityMap = null) => {
  let contentState = editorState.getCurrentContent();
  if (entityMap) {
    entityMap.forEach((value, key) => {
      contentState = contentState.mergeEntityData(key, value);
    });
  }
  contentState = Modifier.replaceWithFragment(
    contentState,
    editorState.getSelection(),
    new List(blocks)
  );
  onChange(EditorState.push(editorState, contentState, 'insert-characters'));
};

export const handlePastedText = (text, html, editorState, onChange, getClipboard) => {
  const selectedBlock = getSelectedBlock(editorState);

  // Plain-text paste inside a code block
  if (selectedBlock && selectedBlock.type === 'code') {
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      text,
      editorState.getCurrentInlineStyle()
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    return true;
  }

  if (!html) return false;

  // Same-editor paste: Draft.js puts DraftStyle class names in the copied HTML.
  // Use the internal clipboard directly to avoid re-parsing and losing fidelity.
  if (html.includes('DraftStyle') && getClipboard) {
    const clipboard = getClipboard();
    if (clipboard) {
      insertBlocks(filterConsecutiveEmptyBlocks(clipboard.toArray()), editorState, onChange);
      return true;
    }
  }

  // External HTML paste (web pages, Google Docs, other editors, etc.)
  const { contentBlocks, entityMap } = htmlToDraft(cleanHtml(html));
  insertBlocks(filterConsecutiveEmptyBlocks(contentBlocks), editorState, onChange, entityMap);
  return true;
};
