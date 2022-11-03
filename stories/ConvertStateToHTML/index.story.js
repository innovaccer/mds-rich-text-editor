/* @flow */

import React from 'react';
import { Button, Paragraph } from '@innovaccer/design-system';
import { Editor } from '../../src';
import { disabledArgtypes, commonArgs } from '../__common__/argTypes';

export const All = (args) => {
  const [editorState, setEditorState] = React.useState(Editor.utils.EditorState.createEmpty());
  const [html, setHTML] = React.useState('');

  const onEditorStateChange = (eState) => {
    setEditorState(eState);
  };

  const onClick = () => {
    const entities = {
      MENTION: (children, entity, { key }) => <div key={key}>{entity.value}</div>,
    };
    const html = Editor.utils.stateToHTML(editorState, {entities});
    setHTML(html);
  };

  return (
    <div>
      <Editor {...args} editorState={editorState} onEditorStateChange={onEditorStateChange} mention={{
          suggestions: [
            { label: 'First Name', value: 'Innovaccer' },
            { label: 'Last Name', value: 'Analytics' },
            { label: 'PCP', value: '112' },
            { label: 'Address', value: 'Test Address' },
            { label: 'DOB', value: '11-02-1998' },
          ],
        }}/>
      <Button appearance="primary" size="large" onClick={onClick} className="mt-4 mb-5">
        Convert to HTML
      </Button>
      <Paragraph>{html}</Paragraph>
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
  title: 'Library/Convert - ContentToHTML',
  component: Editor,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};
