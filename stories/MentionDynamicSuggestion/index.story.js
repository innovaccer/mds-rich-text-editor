/* @flow */

import React from 'react';
import { Editor } from '../../src';
import { disabledArgtypes, commonArgs } from '../__common__/argTypes';
import { searchElement } from '../../src/utils/common';

export const All = (args) => {
  let suggestionList = [
    { label: 'Gender', value: 'Gender' },
    { label: 'ID', value: 'ID' },
    { label: 'Address', value: 'Address' },
    { label: 'DOB', value: 'DOB' },
    { label: 'Age', value: 'Age' },
    { label: 'First Name', value: 'First Name' },
  ];

  const fetchSuggestions = (searchTerm) => {
    const searchedOptions = searchTerm ? searchElement(suggestionList, searchTerm, false) : suggestionList;
    const result = new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(searchedOptions);
      }, 3000);
    });
    return result;
  };

  return (
    <Editor
      {...args}
      mention={{
        label: ' ',
        trigger: '@',
        fetchSuggestions: fetchSuggestions,
      }}
    />
  );
};

All.argTypes = {
  ...disabledArgtypes,
};

All.args = {
  ...commonArgs,
};

export default {
  title: 'Library/Mention - DynamicSuggestion',
  component: Editor,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};
