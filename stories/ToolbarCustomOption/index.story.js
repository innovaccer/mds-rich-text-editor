import React from 'react';
import { Editor } from '../../src';
import { disabledArgtypes, commonArgs } from '../__common__/argTypes';

export const All = (args) => (
  <Editor
    toolbar={{
      options: ["textDecoration", "list"],
      textDecoration: {
        options: ["bold", "italic", "underline"],
      },
    }}
  />
);

All.argTypes = {
  ...disabledArgtypes,
};

All.args = {
  ...commonArgs,
  textAlignment: 'left',
  ariaLabel: 'RichTextEditor',
  spellCheck: false,
  readOnly: false,
  showToolbar: true,
};

export default {
  title: 'Library/Toolbar - CustomOption',
  component: Editor,
};
