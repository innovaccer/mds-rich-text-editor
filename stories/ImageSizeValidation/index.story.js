/* @flow */

import React from 'react';
import { Editor } from '../../src';
import { disabledArgtypes, commonArgs } from '../__common__/argTypes';

export const All = (args) => {
  const uploadCallback = (file) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();

      //Read the contents of Image File.
      reader.readAsDataURL(file);
      reader.onloadend = function (e) {
        //Initiate the JavaScript Image object.
        var image = new Image();

        //Set the Base64 string return from FileReader as source.
        image.src = reader.result;

        //Validate the File Height and Width.
        image.onload = function () {
          var height = this.height;
          var width = this.width;
          if (height > 1000 || width > 1000) {
            alert('Height and Width must not exceed 1000px.');
            return false;
          }
          resolve({ data: { link: reader.result } });
        };
      };

      reader.onerror = (e) => reject(e);
    });
  };

  return (
    <Editor
      {...args}
      toolbar={{
        insert: {
          image: {
            uploadCallback,
            defaultSize: { height: '200px' },
          },
        },
      }}
    />
  );
};

All.argTypes = {
  ...disabledArgtypes,
  toolbar: { control: { disable: true } },
};

All.args = {
  ...commonArgs,
};

export default {
  title: 'Library/Image - SizeValidation',
  component: Editor,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};
