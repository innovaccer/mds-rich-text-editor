import React, { useContext } from 'react';
import { addParameters, configure } from '@storybook/react';
import { Title, Subtitle, Description, Primary, ArgsTable, PRIMARY_STORY, DocsContext } from '@storybook/addon-docs/blocks';
import { primary } from './themes';
import AccessibilityPropTable from '../stories/__common__/AccessibilityPropTable';
import { getAccessibilityProps } from '../stories/__common__/accessibilityProps';
import '@innovaccer/design-system/css';
import './RichTextEditor.css';
import './AccessibilityPropTable.css';

const AccessibilitySection = () => {
  const context = useContext(DocsContext);
  const story = context.id && context.storyById(context.id);
  const component = story && story.component;
  const componentName = component && (component.displayName || component.name);
  return <AccessibilityPropTable props={getAccessibilityProps(componentName)} />;
};

addParameters({
  options: {
    /**
     * show story component as full screen
     * @type {Boolean}
     */
    isFullscreen: false,
    /**
     * display panel that shows a list of stories
     * @type {Boolean}
     */
    showNav: true,
    /**
     * display panel that shows addon configurations
     * @type {Boolean}
     */
    showPanel: true,
    /**
     * where to show the addon panel
     * @type {('bottom'|'right')}
     */
    panelPosition: 'bottom',
    /**
     * regex for finding the hierarchy separator
     * @example:
     *   null - turn off hierarchy
     *   /\// - split by `/`
     *   /\./ - split by `.`
     *   /\/|\./ - split by `/` or `.`
     * @type {Regex}
     */
    hierarchySeparator: /\/|\./,
    /**
     * regex for finding the hierarchy root separator
     * @example:
     *   null - turn off multiple hierarchy roots
     *   /\|/ - split by `|`
     * @type {Regex}
     */
    hierarchyRootSeparator: /\|/,
    /**
     * sidebar tree animations
     * @type {Boolean}
     */
    sidebarAnimations: true,
    /**
     * enable/disable shortcuts
     * @type {Boolean}
     */
    enableShortcuts: true,
    /**
     * show/hide tool bar
     * @type {Boolean}
     */
    isToolshown: true,
    /**
     * theme storybook, see link below
     */
    theme: primary,
    /**
     * function to sort stories in the tree view
     * common use is alphabetical `(a, b) => a[1].id.localeCompare(b[1].id)`
     * if left undefined, then the order in which the stories are imported will
     * be the order they display
     * @type {Function}
     */
    storySort: (a, b) => {
      if (a[1].kind === b[1].kind) {
        if (a[1].story === 'All') return 0;
        if (b[1].story === 'All') return 1;
        return 0;
      } else {
        return a[1].id.localeCompare(b[1].id, undefined, { numeric: true });
      }
    },
  },
  // viewport: {
  //   viewports: INITIAL_VIEWPORTS
  // },
  docs: {
    page: () => (
      <>
        <Title />
        <Subtitle />
        <Description />
        <Primary />
        <AccessibilitySection />
        <ArgsTable story={PRIMARY_STORY} />
      </>
    ),
  },
});

configure(require.context('../stories', true, /\.story\.(js|jsx|tsx)$/), module);
