/* @flow */

import React from 'react';
import { Editor } from '../../src';
import { Icon } from '@innovaccer/design-system';
import { disabledArgtypes, commonArgs } from '../__common__/argTypes';

export const All = (args) => {
  const customOptionRenderer = (suggestion, active, index) => (
    <div className="d-flex justify-content-between Editor-dropdown-option" onClick={() => {
      console.log(suggestion);
    }}>
      {suggestion.label}
      {active === index && <Icon name="check" />}
    </div>
  );

  return (
    <Editor
      {...args}
      mention={{
        label: ' ',
        trigger: '@',
        dropdownOptions: { customOptionRenderer },
        suggestions: [
          { label: 'First Name', value: 'fn' },
          { label: 'Last Name', value: 'ln' },
          { label: 'PCP', value: 'PCP' },
          { label: 'Address', value: 'add' },
          { label: 'DOB', value: 'dob' },
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
  title: 'Library/Mention - CustomOption',
  component: Editor,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};
