/* @flow */

import React from 'react';
import { Editor } from '../../src';
import { Listbox, Placeholder, PlaceholderParagraph } from '@innovaccer/design-system';
import { disabledArgtypes, commonArgs } from '../__common__/argTypes';

export const All = (args) => {
  /**
   *  .custom-mention-dropdown {
        height: var(--spacing-9);
        width: var(--spacing-8);
      }

      .custom-suggestion-listbox {
        overflow: auto;
        height: var(--spacing-9);
      }

      .custom-suggestion-listbox-item {
        outline: 3px auto var(--secondary-shadow);
      }
   */

  let suggestionList = [
    { label: 'Gender', value: 'Gender' },
    { label: 'ID', value: 'ID' },
    { label: 'Address', value: 'Address' },
    { label: 'DOB', value: 'DOB' },
    { label: 'Age', value: 'Age' },
    { label: 'First Name', value: 'First Name' },
  ];

  const customPopoverRenderer = (filteredSuggestions, addMention, showLoader, showSuggestions, activeOptionIndex) => {

    if (showLoader) {
      return (
        <span className="px-5 py-3-5">
          <Placeholder withImage={false}>
            {Array.from({ length: 4 }).map(() => {
              return <PlaceholderParagraph length="large" size="xl" />;
            })}
          </Placeholder>
        </span>
      );
    }

    return (
      <Listbox className="custom-suggestion-listbox" showDivider={false} type="option" size="compressed">
        {filteredSuggestions.map((suggestion, key) => {
          return (
            <Listbox.Item
              key={key}
              className={activeOptionIndex === key ? 'custom-suggestion-listbox-item' : ''}
              onClick={(event) => {
                addMention(event, suggestion.label, suggestion.value);
              }}
            >
              {suggestion.label}
            </Listbox.Item>
          );
        })}
      </Listbox>
    );
  };

  function searchElement(searchList, searchText, isCaseSensitive) {
    const result =
      searchList &&
      searchList.filter((suggestion) => {
        if (!searchText || searchText.length === 0) {
          return true;
        }
        if (isCaseSensitive) {
          return suggestion.value.indexOf(searchText) >= 0;
        }
        return suggestion.value.toLowerCase().indexOf(searchText && searchText.toLowerCase()) >= 0;
      });
    return result;
  }


  const fetchSuggestions = (searchTerm) => {
    const searchedOptions = searchTerm ? searchElement(suggestionList, searchTerm, false) : suggestionList;
    const result = new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(searchedOptions);
      }, 1500);
    });
    return result;
  };

  return (
    <Editor
      {...args}
      mention={{
        trigger: '@',
        fetchSuggestions: fetchSuggestions,
        dropdownOptions: {
          dropdownClassName: 'custom-mention-dropdown',
          popoverRenderer: customPopoverRenderer,
          appendToBody: false,
          dropdownOptionClassName: 'Listbox-item--option',
        },
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
  title: 'Library/Mention - CustomPopover',
  component: Editor,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};
