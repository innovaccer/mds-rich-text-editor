/* @flow */

import React from 'react';
import { Button, Paragraph, Heading, Link } from '@innovaccer/design-system';
import { Editor, EditorPreview } from '../../src';
import { disabledArgtypes, commonArgs } from '../__common__/argTypes';

export const All = (args) => {
  const [html, setHTML] = React.useState(
    '<p style="justify-content:left; display:flex"> <img src="https://design.innovaccer.com/images/withoutType.png" alt="Innovaccer logo" style="height: ;width: "/> </p> <p><span style="color: var(--text);"><strong><em>Innovaccer</em></strong></span></p><p></p><p><span style="color: rgb(47,47,47);font-size: 14px;font-family: Nunito Sans;">In preview, </span><span style="color: var(--primary);font-size: 14px;font-family: Nunito Sans;">Mention</span><span style="color: rgb(47,47,47);font-size: 14px;font-family: Nunito Sans;"> will convert into </span><span style="color: var(--primary);font-size: 14px;font-family: Nunito Sans;">Link</span><span style="color: rgb(47,47,47);font-size: 14px;font-family: Nunito Sans;"> as it is passed as entities.</span></p><p></p><p><span style="color: rgb(47,47,47);font-size: 14px;font-family: Nunito Sans;">Click on <strong>Preview</strong> to see the changes. Click on <strong>Edit</strong> in preview to make changes. </span></p>'
  );

  const [raw, setRaw] = React.useState();

  const [openEditor, setOpenEditor] = React.useState(true);
  const [isPreviewHtml, setOnPreviewHtml] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(true);
  const [editorState, setEditorState] = React.useState(Editor.utils.htmlToState(html).editorState);

  const onEditorStateChange = (eState) => {
    setEditorState(eState);
  };

  const generateHtml = () => {
    setHTML(Editor.utils.stateToHTML(editorState));
  };

  const generateContent = () => {
    return Editor.utils.htmlToState(html).editorState;
  };

  const onEdit = () => {
    setEditorState(generateContent);
    setOpenEditor(true);
    setOnPreviewHtml(false);
  };

  const onSave = () => {
    setRaw(Editor.utils.convertToRaw(editorState.getCurrentContent()));
    generateHtml();
    setOpenEditor(false);
    setOnPreviewHtml(false);
    setIsSaved(false);
  };

  const onCancel = () => {
    setEditorState(generateContent);
    setOpenEditor(false);
    setOnPreviewHtml(false);
  };

  const onPreviewHtml = () => {
    generateHtml();
    setOnPreviewHtml(true);
  };

  return (
    <div>
      {!openEditor ? (
        <div>
          <div className="Editor-wrapper">
            <EditorPreview
              {...args}
              raw={raw}
              entities={{
                MENTION: (children, entity, { key }) => <Link>{children}</Link>,
              }}
            />
          </div>
          <Button appearance="primary" size="large" onClick={onEdit} className="my-4">
            Edit
          </Button>
        </div>
      ) : (
        <div>
          <Editor
            {...args}
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            mention={{
              suggestions: [
                { label: 'First Name', value: 'Innovaccer' },
                { label: 'Last Name', value: 'Analytics' },
                { label: 'PCP', value: '112' },
                { label: 'Address', value: 'Test Address' },
                { label: 'DOB', value: '11-02-1998' },
              ],
            }}
          />
          <div className="d-flex my-5">
            <Button appearance="primary" size="large" onClick={onSave} className="my-4 ">
              Preview
            </Button>
            <Button appearance="primary" size="large" onClick={onCancel} className="my-4 ml-4" disabled={isSaved}>
              Cancel
            </Button>
            <Button appearance="primary" size="large" onClick={onPreviewHtml} className="my-4 ml-4">
              Preview Html
            </Button>
          </div>
          {isPreviewHtml && (
            <code>
              <Paragraph className="border p-4">{html}</Paragraph>
            </code>
          )}
        </div>
      )}
    </div>
  );
};

All.argTypes = {
  ...disabledArgtypes,
};

All.args = {
  ...commonArgs,
};

export default {
  title: 'Library/Editor',
  component: Editor,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};
