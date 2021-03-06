/* @flow */
import React from 'react';
import { Button } from '@innovaccer/design-system';
import { Editor, EditorPreview } from '../../src';

export const All = (args) => {
  // import { Editor, EditorPreview } from '@innovaccer/rich-text-editor';

  const [editorState, setEditorState] = React.useState(Editor.utils.EditorState.createEmpty());
  const [raw, setRaw] = React.useState();

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const onClick = () => {
    const raw = Editor.utils.convertToRaw(editorState.getCurrentContent());
    setRaw(raw);
  };

  return (
    <div>
      <Editor
        editorClassName="RichTextEditor"
        placeholder="Begin Typing.."
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        mention={{
          suggestions: [
            { label: 'First Name', value: 'First Name' },
            { label: 'Last Name', value: 'Last Name' },
            { label: 'PCP', value: 'PCP' },
            { label: 'Address', value: 'Address' },
            { label: 'DOB', value: 'DOB' },
          ],
        }}
      />
      <Button appearance="primary" size="large" onClick={onClick} className="my-4">
        Get Preview
      </Button>
      <div className="pl-7">
        <EditorPreview {...args} raw={raw} />
      </div>
    </div>
  );
};

All.argTypes = {
  raw: { control: { disable: true } },
  colors: { control: { disable: true } },
};

export default {
  title: 'Library/Preview',
  component: EditorPreview,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};
