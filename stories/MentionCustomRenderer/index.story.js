/* @flow */

import React from 'react';
import { Editor } from '../../src';
import { Text } from '@innovaccer/design-system';
import { disabledArgtypes, commonArgs } from '../__common__/argTypes';

export const All = (args) => {
  const customRenderer = (props) => <Text appearance="link">{props}</Text>;

  return (
    <Editor
      {...args}
      mention={{
        trigger: '@',
        renderer: customRenderer,
        suggestions: [
          { label: 'First Name', value: 'First Name' },
          { label: 'Last Name', value: 'Last Name' },
          { label: 'PCP', value: 'PCP' },
          { label: 'Address', value: 'Address' },
          { label: 'DOB', value: 'DOB' },
        ],
      }}
    />
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
  title: 'Library/Mention - CustomRenderer',
  component: Editor,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};
