import { EditorState, Modifier, SelectionState } from 'draft-js';

export const findBlockKey = (mentionRef) => {
  const parentBlock = mentionRef.closest('[data-block]');
  if (!parentBlock) return null;
  return parentBlock.getAttribute('data-offset-key').split('-')[0];
};

export const getMentionIndex = (mentionRef) => {
  const parentBlock = mentionRef.closest('[data-block]');
  const siblingSpans = parentBlock.querySelectorAll('span[data-offset-key]');
  const suggestionOffsetKey = mentionRef.querySelector('[data-offset-key]').getAttribute('data-offset-key');

  let mentionIndex = 0;
  for (let i = 0; i < siblingSpans.length; i++) {
    const span = siblingSpans[i];
    if (span.getAttribute('data-offset-key') === suggestionOffsetKey) {
      break;
    } else {
      mentionIndex += span.textContent.length;
    }
  }
  return mentionIndex;
};

export const createSelection = (blockKey, mentionIndex, focusOffset) => {
  return SelectionState.createEmpty(blockKey).merge({
    anchorOffset: mentionIndex,
    focusOffset,
  });
};

export const createMentionEntity = (contentState, text, value, url) => {
  return contentState.createEntity('MENTION', 'IMMUTABLE', { text, value, url }).getLastCreatedEntityKey();
};

export const ensureSpaceAfterMention = (editorState, blockKey, endOffset, selection) => {
  const blockText = editorState.getCurrentContent().getBlockForKey(blockKey).getText();

  if (blockText[endOffset] !== ' ') {
    let contentState = Modifier.insertText(
      editorState.getCurrentContent(),
      selection,
      ' ',
      editorState.getCurrentInlineStyle()
    );
    editorState = EditorState.push(editorState, contentState, 'insert-characters');

    const updatedSelection = selection.merge({ anchorOffset: endOffset + 1, focusOffset: endOffset + 1 });
    editorState = EditorState.forceSelection(editorState, updatedSelection);
  } else {
    editorState = EditorState.forceSelection(editorState, selection);
  }

  return editorState;
};
