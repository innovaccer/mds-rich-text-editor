import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { ContentState, EditorState, convertToRaw } from 'draft-js';

const replaceAllContent = (data, originalStr, replacedStr) => {
  const regex = new RegExp(originalStr, 'g');
  return data.replace(regex, replacedStr);
}

export const htmlToState = (html) => {
  // Remove extra newline in html generated from Preview component
  const imgContent = replaceAllContent(html, '<p><br/></p><p id="RichTextEditor-Image"', '<p id="RichTextEditor-Image"');
  const htmlContent = replaceAllContent(imgContent, '<br/>', '');
  const trimContent = replaceAllContent(htmlContent, '<p>&nbsp;</p>', '');
  const contentBlock = htmlToDraft(trimContent);
  if (contentBlock) {
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    return { contentState, editorState };
  }
};

export const stateToHTML = (editorState, nonFloatingImage = false) => {
  const json = convertToRaw(editorState.getCurrentContent());

  // Set hashConfig to undefined to output hashtags as simple text in the markdown
  return draftToHtml(json, undefined, false, ({ type, data }) => {
    if (type === 'IMAGE') {
      const alignment = data.alignment ? data.alignment : 'left';
      if (data.alt === 'center' || alignment === 'center')
        return `
        <p>
          <img src="${data.src}" alt="${data.alignment}" style="display:block; margin-right:auto; margin-left:auto; height: ${data.height};width: ${data.width}"/>
        </p>
        `;
      else if (nonFloatingImage && (data.alt === 'left' || alignment === 'left'))
        return `
          <p>
            <img src="${data.src}" alt="${data.alignment}" style="display:block; margin-right:auto; height: ${data.height};width: ${data.width}"/>
          </p>
        `;
      else if (nonFloatingImage)
        return `
          <p>
            <img src="${data.src}" alt="${data.alignment}" style="display:block; margin-left:auto; height: ${data.height};width: ${data.width}"/>
          </p>
        `;
      else
        return `
            <p>
              <img src="${data.src}" alt="${data.alignment}" style="float:${alignment}; height: ${data.height};width: ${data.width}"/>
            </p>
          `;
    }
  });
};
