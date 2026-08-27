/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Option from '../../../components/Option';
import { Icon, Tooltip } from '@innovaccer/design-system';

export default class LayoutComponent extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    doExpand: PropTypes.func,
    doCollapse: PropTypes.func,
    onExpandEvent: PropTypes.func,
    config: PropTypes.object,
    onChange: PropTypes.func,
    currentState: PropTypes.object,
    // indentDisabled: PropTypes.bool,
    // outdentDisabled: PropTypes.bool,
    className: PropTypes.string,
    toolbarContext: PropTypes.string,
  };

  options = ['unordered', 'ordered'];

  toggleBlockType = (blockType) => {
    const { onChange } = this.props;
    onChange(blockType);
  };

  render() {
    const {
      config,
      currentState: { listType },
      className,
      toolbarContext,
    } = this.props;

    const { options, unordered, ordered } = config;

    const ListClass = classNames(
      {
        ['d-flex']: true,
      },
      className
    );

    const unorderedLabel = toolbarContext ? `${unordered.title} ${toolbarContext}` : unordered.title;
    const orderedLabel = toolbarContext ? `${ordered.title} ${toolbarContext}` : ordered.title;

    return (
      <div className={ListClass}>
        <Tooltip tooltip={unordered.title}>
          <Option
            aria-label={unorderedLabel}
            value="unordered"
            onClick={this.toggleBlockType}
            active={listType === 'unordered'}
            className="mr-2"
          >
            <Icon appearance={listType === 'unordered' ? 'info' : 'default'} name={unordered.icon} size={20} />
          </Option>
        </Tooltip>
        <Tooltip tooltip={ordered.title}>
          <Option aria-label={orderedLabel} value="ordered" onClick={this.toggleBlockType} active={listType === 'ordered'}>
            <Icon appearance={listType === 'ordered' ? 'info' : 'default'} name={ordered.icon} size={20} />
          </Option>
        </Tooltip>
      </div>
    );
  }
}
