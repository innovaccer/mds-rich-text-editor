/* @flow */

import React from 'react';
import { Editor } from '../../src';
import { Heading, Chip } from '@innovaccer/design-system';
import { disabledArgtypes, commonArgs } from '../__common__/argTypes';

export const All = (args) => {
  const [users, setUsersList] = React.useState([]);

  const onEditorStateChange = (editorState) => {
    const contentState = Editor.utils.convertToRaw(editorState.getCurrentContent());
    const entityMap = contentState.entityMap;
    const mentionList = Object.values(entityMap).map((entity) => entity.data.value);
    setUsersList(mentionList);
  };

  return (
    <div>
      <Editor
        {...args}
        onEditorStateChange={onEditorStateChange}
        mention={{
          trigger: '@',
          suggestions: [
            { label: 'First Name', value: 'fn' },
            { label: 'Last Name', value: 'ln' },
            { label: 'PCP', value: 'PCP' },
            { label: 'Address', value: 'add' },
            { label: 'DOB', value: 'dob' },
          ],
        }}
      />
      <br />
      <Heading size="s">List of all Mentions:</Heading>
      {users.map((item) => (
        <Chip className="my-4" label={item} type="action" />
      ))}
    </div>
  );
};

All.argTypes = {
  ...disabledArgtypes,
  mention: { control: { disable: true } },
};

All.args = {
  ...commonArgs,
};

export default {
  title: 'Library/Mention - MentionList',
  component: Editor,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};
