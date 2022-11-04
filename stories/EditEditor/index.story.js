/* @flow */

import React from 'react';
import { Button, Paragraph, Heading, Link } from '@innovaccer/design-system';
import { Editor, EditorPreview } from '../../src';
import { disabledArgtypes, commonArgs } from '../__common__/argTypes';

export const All = (args) => {
  const [html, setHTML] = React.useState(
    '<p><span style="color: rgb(47,47,47);font-size: 14px;font-family: Nunito Sans;">Click on Edit to make changes</span></p>'
  );

  const [raw, setRaw] = React.useState({
    entityMap: {},
    blocks: [
      {
        key: '9c9d9',
        text: 'Click on Edit to make changes. ',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
  });

  const [isClicked, setIsClicked] = React.useState(false);
  const [isPreview, setOnPreview] = React.useState(false);
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
  const onClick = () => {
    setEditorState(generateContent);
    setIsClicked(true);
    setOnPreview(false);
  };
  const onSave = () => {
    setRaw(Editor.utils.convertToRaw(editorState.getCurrentContent()));
    generateHtml();
    setIsClicked(false);
    setOnPreview(false);
  };
  const onCancel = () => {
    setEditorState(generateContent);
    setIsClicked(false);
    setOnPreview(false);
  };
  const onPreview = () => {
    generateHtml();
    setOnPreview(true);
  };
  return (
    <div>
      <div>
        <div>
          {!isClicked ? (
            <div>
              <div className="w-75 border h-50">
                <EditorPreview
                  {...args}
                  raw={raw}
                  entities={{
                    MENTION: (children, entity, { key }) => <Link>{children}</Link>,
                  }}
                />
              </div>
              <Button appearance="primary" size="large" onClick={onClick} className="my-4">
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
              <div className="d-flex">
                <Button appearance="primary" size="large" onClick={onSave} className="my-4 ">
                  Save
                </Button>
                <Button appearance="primary" size="large" onClick={onCancel} className="my-4 ml-4">
                  Cancel
                </Button>
                <Button appearance="primary" size="large" onClick={onPreview} className="my-4 ml-4">
                  Preview Html
                </Button>
              </div>
              {isPreview && <Paragraph>{html}</Paragraph>}
            </div>
          )}
        </div>
      </div>
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
  title: 'Library/Edit - Editor',
  component: Editor,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};
