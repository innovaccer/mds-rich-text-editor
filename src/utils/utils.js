import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { ContentState, EditorState, convertToRaw } from 'draft-js';

export const htmlToState = (html) => {
  // Remove extra newline in html generated from Preview component
  const imgContent = html.replaceAll('<p><br/></p><p id="RichTextEditor-Image"','<p id="RichTextEditor-Image"')
  const htmlContent = imgContent.replaceAll('<br/>', '').replaceAll('<p>&nbsp;</p>','');
  const contentBlock = htmlToDraft(htmlContent);
  if (contentBlock) {
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    return { contentState, editorState };
  }
};

export const stateToHTML = (editorState, notFloatingImage = false) => {
  const json = convertToRaw(editorState.getCurrentContent());

  return draftToHtml(json, {}, false, ({ type, data }) => {
    if (type === 'IMAGE') {
      const alignment = data.alignment ? data.alignment : 'left';
      if(data.alt==="center" || alignment === "center")
        return `
        <p>
          <img src="${data.src}" alt="${data.alignment}" style="display:block; margin-right:auto; margin-left:auto; height: ${data.height};width: ${data.width}"/>
        </p>
        `;
      else if(notFloatingImage && data.alt ==="left" || alignment === "left")
        return `
          <p>
            <img src="${data.src}" alt="${data.alignment}" style="display:block; margin-right:auto; height: ${data.height};width: ${data.width}"/>
          </p>
        `;
      else if(notFloatingImage)
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
