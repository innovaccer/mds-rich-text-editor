/* @flow */

import React from 'react';
import { Button, Paragraph, Heading, Link } from '@innovaccer/design-system';
import { Editor, EditorPreview } from '../../src';
import { disabledArgtypes, commonArgs } from '../__common__/argTypes';

export const All = (args) => {
  const [editorState, setEditorState] = React.useState(Editor.utils.EditorState.createEmpty());

  const [html, setHTML] = React.useState(
    '<p><a href="https://innovaccer.github.io/design-system/?path=/story/*" target="_self">Innovaccer Design System</a>&nbsp;</p>'
  );
  const [raw, setRaw] = React.useState();
  const [isClicked, setIsClicked] = React.useState(false);
  const [editorStatePreview, seteditorStatePreview] = React.useState(Editor.utils.htmlToState(html).editorState);

  const onEditorStateChange = (eState) => {
    setEditorState(eState);
  };
  const onEditorStateChangePreview = (eStatePreview) => {
    seteditorStatePreview(eStatePreview);
  };

  const onClick = () => {
    // const raw = Editor.utils.convertToRaw(editorState.getCurrentContent());
    const generatedHTML = Editor.utils.stateToHTML(editorState);
    setHTML(generatedHTML);
    // setRaw(raw);
    // seteditorStatePreview(Editor.utils.htmlToState(generatedHTML).editorState);
  };
  const onSave = () => {
    // const raw = Editor.utils.convertToRaw(editorState.getCurrentContent());
    // setRaw(raw);
    seteditorStatePreview(Editor.utils.htmlToState(html).editorState);
  };

  const onPreview = () => {
    const raw = Editor.utils.convertToRaw(editorState.getCurrentContent());
    setRaw(raw);
    console.log(raw,"raw");
    setIsClicked(true);
  }
  const customRenderer = (props) => <span class="Chip--input Chip d-inline-flex mt-3">{props}</span>;

  return (
    <div>
      <div className="d-flex">
        <div>
          <Editor
            {...args}
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            mention={{
              suggestions: [
                { label: 'First Name', value: 'Innovaccer' },
                { label: 'Last Name', value: 'Analytics' },
                { label: 'PCP', value: '112' },
                { label: 'Address', value: 'Test Address' },
                { label: 'DOB', value: '11-02-1998' },
              ],
            }}
          />
          <Button appearance="primary" size="large" onClick={onClick} className="my-4">
            Export HTML
          </Button>
        </div>
        <div className="pl-4">
          <Editor
            {...args}
            editorState={editorStatePreview}
            onEditorStateChange={onEditorStateChangePreview}
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
          <Button appearance="primary" size="large" onClick={onSave} className="my-4">
            Import HTML
          </Button>
        </div>
      </div>
      <div className="pl-2">
        <Paragraph className=" ml-4"><code>{html}</code></Paragraph>
        <Button appearance="primary" size="large" onClick={onPreview} className="my-4">
            Preview Content
        </Button>

        {!!isClicked && (<div className=' ml-4 border'>
          <code>
        <EditorPreview
          {...args}
          raw={raw}
          entities={{
            MENTION: (children, entity, { key }) => <Link>{children}</Link>,
          }}
        />
        </code>
        </div>)}
      </div>
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
  title: 'Library/Preview - HTML',
  component: Editor,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
};
