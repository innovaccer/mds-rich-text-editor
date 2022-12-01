import { getSelectedBlock } from 'draftjs-utils';
import { Modifier, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import { List } from 'immutable';

export const handlePastedText = (text, html, editorState, onChange) => {
  const selectedBlock = getSelectedBlock(editorState);
  if (selectedBlock && selectedBlock.type === 'code') {
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      text,
      editorState.getCurrentInlineStyle()
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    return true;
  } else if (html) {
    const htmlBlocks = convertFromHTML(html);
    let contentState = editorState.getCurrentContent();
    contentState = Modifier.replaceWithFragment(
      contentState,
      editorState.getSelection(),
      new List(htmlBlocks.contentBlocks)
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    return true;
  }
  return false;
};
