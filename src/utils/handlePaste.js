import { getSelectedBlock } from 'draftjs-utils';
import { Modifier, EditorState } from 'draft-js';
import { Editor } from '../../src';

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
    const pastedState = Editor.utils.htmlToState(html).contentState;
    let contentState = editorState.getCurrentContent();
    contentState = Modifier.replaceWithFragment(
      contentState,
      editorState.getSelection(),
      pastedState.getBlockMap()
    );
    onChange(EditorState.push(editorState, contentState, 'insert-fragment'));
    return true;
  }
  return false;
};
