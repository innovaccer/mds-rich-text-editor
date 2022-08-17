import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { ContentState, EditorState, convertToRaw } from 'draft-js';

export const htmlToState = (html) => {
  // Remove extra newline in html generated from Preview component
  const htmlContent = html.replaceAll('<br/>', '');
  const contentBlock = htmlToDraft(htmlContent);
  if (contentBlock) {
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    return { contentState, editorState };
  }
};

export const stateToHTML = (editorState) => {
  const json = convertToRaw(editorState.getCurrentContent());

  return draftToHtml(json, {}, false, ({ type, data }) => {
    if (type === 'IMAGE') {
      const alignment = data.alignment ? data.alignment : 'left';
      return `
        <p style="justify-content:${alignment}; display:flex">
          <img src="${data.src}" alt="${data.alt}" style="height: ${data.height};width: ${data.width}"/>
        </p>
      `;
    }
  });
};
