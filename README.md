# Rich Text Editor

## Installing

The package can be installed from npm `@innovaccer/rich-text-editor`

```
$ npm install @innovaccer/rich-text-editor
```

## Getting started

Editor can be used as simple React Component:

```js
import { Editor } from '@innovaccer/rich-text-editor';
import '@innovaccer/rich-text-editor/dist/rich-text-editor.css';
<Editor
  ariaLabel="RichTextEditor"
  editorClassName="RichTextEditor"
  placeholder="Begin typing.."
  textAlignment="left"
  // Pass toolbarContext when rendering more than one Editor on the same page,
  // so identically-labelled toolbar buttons (Bold, Bullet list, ...) get a
  // distinguishing accessible name for screen reader users, e.g. "Bold Chart Review".
  toolbarContext="Chart Review"
/>;
```
