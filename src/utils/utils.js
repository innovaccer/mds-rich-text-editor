import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import redraft from 'redraft';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import { renderToStaticMarkup } from 'react-dom/server';

export const htmlToState = (html) => {
  // Remove extra newline in html generated from Preview component
  const imgContent = html.replaceAll('<p><br/></p><p id="RichTextEditor-Image"', '<p id="RichTextEditor-Image"');
  const htmlContent = imgContent.replaceAll('<br/>', '');
  const contentBlock = htmlToDraft(htmlContent);
  if (contentBlock) {
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    return { contentState, editorState };
  }
};

const getPreviewComponent = (raw, { entities = {} }) => {
  const updatedEntities = { ...entities };
  const renderer = {
    entities: updatedEntities,
  };
  return redraft(raw, renderer);
};

export const stateToHTML = (editorState, renderer = {}) => {
  const json = convertToRaw(editorState.getCurrentContent());
  const previewComponent = getPreviewComponent(json, renderer);
  var mentionIndex = 0;
  const mentionCheck = (i) => {
    return previewComponent[0][0][i] !== undefined && "type" in previewComponent[0][0][i]
  }

  return draftToHtml(json, {}, false, ({ type, data }) => {

    if (type === 'IMAGE') {
      const alignment = data.alignment ? data.alignment : 'left';
      return `
        <p style="justify-content:${alignment}; display:flex">
          <img src="${data.src}" alt="${data.alt}" style="height: ${data.height};width: ${data.width}"/>
        </p>
      `;
    }
    if (type === 'MENTION') {
      const contentLength = previewComponent[0][0].length
      if (mentionIndex === 0) {
        for (var i = 1; i < contentLength; i++) {
          if (mentionCheck(i)) {
            mentionIndex = i;
            break;
          }
        }
        return `${renderToStaticMarkup(previewComponent[0][0][mentionIndex])}`;
      }
      else {
        for (var i = mentionIndex + 1; i < contentLength; i++) {
          if (mentionCheck(i)) {
            mentionIndex = i;
            break;
          }
        }
        return `${renderToStaticMarkup(previewComponent[0][0][mentionIndex])}`;
      }

    }
  })
} 
