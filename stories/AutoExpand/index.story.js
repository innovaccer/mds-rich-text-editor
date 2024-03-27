import React from 'react';
import { Editor } from '../../src';
import { disabledArgtypes } from '../__common__/argTypes';

export const All = (args) => <Editor {...args} />;

All.argTypes = {
  ...disabledArgtypes,
};

All.args = {
  textAlignment: 'left',
  ariaLabel: 'RichTextEditor',
  spellCheck: false,
  readOnly: false,
};

export default {
  title: 'Library/Auto Expand',
  component: Editor,
};
