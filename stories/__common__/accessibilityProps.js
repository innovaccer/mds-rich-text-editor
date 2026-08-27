const componentA11yRegistry = {
  Editor: [
    {
      name: 'ariaLabel',
      type: 'string',
      description: 'Accessible name (aria-label) for the editable content region (the contenteditable area, not the toolbar).',
    },
    {
      name: 'ariaLabelledBy',
      type: 'string',
      description: 'References the ID of element(s) that label the content region (aria-labelledby).',
    },
    {
      name: 'ariaDescribedBy',
      type: 'string',
      description: 'References the ID of element(s) describing the content region (aria-describedby).',
      defaultValue: "'{{editor_id_placeholder}}'",
    },
    {
      name: 'role',
      type: 'string',
      description: 'Overrides the content region\'s implicit role. Ignored (not rendered) when readOnly is true.',
      defaultValue: "'textbox'",
    },
    {
      name: 'ariaExpanded',
      type: 'boolean',
      description:
        'Sets aria-expanded on the content region. Only rendered when role is "combobox"; ignored when readOnly is true.',
    },
    {
      name: 'ariaActiveDescendantID',
      type: 'string',
      description: 'References the active descendant element (aria-activedescendant). Ignored when readOnly is true.',
    },
    {
      name: 'ariaAutoComplete',
      type: 'string',
      description: 'Sets aria-autocomplete on the content region. Ignored when readOnly is true.',
    },
    {
      name: 'ariaControls',
      type: 'string',
      description: 'References the element(s) controlled by the content region (aria-controls). Ignored when readOnly is true.',
    },
    {
      name: 'ariaMultiline',
      type: 'boolean',
      description: 'Sets aria-multiline on the content region.',
    },
    {
      name: 'ariaOwneeID',
      type: 'string',
      description: 'References owned element(s) (aria-owns). Ignored when readOnly is true.',
    },
    {
      name: 'tabIndex',
      type: 'number',
      description: 'Controls focus order of the content region.',
    },
    {
      name: 'toolbarContext',
      type: 'string',
      description:
        'Distinguishing context appended to every toolbar button\'s accessible name (e.g. "Chart Review"). Use when a page renders more than one Editor instance, so identically-labelled buttons (Bold, Bullet list, ...) don\'t collide. Omit when only one Editor instance is on the page.',
    },
  ],
};

export function getAccessibilityProps(componentName) {
  return componentA11yRegistry[componentName] || [];
}
