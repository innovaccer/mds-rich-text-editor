import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, Button, Tooltip } from '@innovaccer/design-system';

import { stopPropagation } from '../../../utils/common';

let dropdownListCount = 0;

export default class Dropdown extends Component {
  static propTypes = {
    children: PropTypes.any,
    onChange: PropTypes.func,
    className: PropTypes.string,
    expanded: PropTypes.bool,
    menu: PropTypes.bool,
    doExpand: PropTypes.func,
    doCollapse: PropTypes.func,
    onExpandEvent: PropTypes.func,
    optionWrapperClassName: PropTypes.string,
    triggerClassName: PropTypes.string,
    ariaLabel: PropTypes.string,
    title: PropTypes.string,
    tooltip: PropTypes.string,
  };

  buttonRef = null;
  listRef = null;

  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
    this.listRef = React.createRef();
    this.listId = `Editor-dropdown-list-${dropdownListCount++}`;
    this.state = {
      highlighted: -1,
    };
  }

  getOptionId = (index) => `${this.listId}-option-${index}`;

  getActiveIndex = () => {
    const options = React.Children.toArray(this.props.children.slice(1));
    return options.findIndex((option) => option && option.props && option.props.active);
  };

  componentDidUpdate(prevProps) {
    const { expanded } = this.props;
    if (prevProps.expanded && !expanded) {
      this.setState({
        highlighted: -1,
      });
      document.removeEventListener('keydown', this.focusTriggerOnClose);
      document.removeEventListener('click', this.handleOutsideClick);
    }
    if (!prevProps.expanded && expanded) {
      document.addEventListener('keydown', this.focusTriggerOnClose);
      document.addEventListener('click', this.handleOutsideClick);
      this.setState({
        highlighted: Math.max(this.getActiveIndex(), 0),
      });
      this.listRef.current.focus();
    }
  }

  handleOutsideClick = (event) => {
    if (this.listRef.current && !this.listRef.current.contains(event.target)) {
      this.toggleExpansion();
    }
  };

  onChange = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
    this.toggleExpansion();
  };

  setHighlighted = (highlighted) => {
    this.setState({
      highlighted,
    });
  };

  focusTrigger = () => {
    this.buttonRef.current?.focus();
  };

  focusTriggerOnClose = (event) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      this.toggleExpansion();
      this.focusTrigger();
    }
  };

  toggleExpansion = () => {
    const { doExpand, doCollapse, expanded } = this.props;
    if (expanded) {
      doCollapse();
    } else {
      doExpand();
    }
  };

  handleExpand = (event) => {
    this.props.onExpandEvent(event);
  };

  handleListKeyDown = (event) => {
    event.preventDefault();
    const { highlighted: currentHighlighted } = this.state;
    const options = this.props.children[1];
    const eventKey = event.key;
    if (eventKey === 'ArrowDown' || eventKey === 'ArrowUp') {
      const lastIndex = options.length - 1;
      this.setState((prevState) => {
        return {
          highlighted:
            eventKey === 'ArrowDown'
              ? Math.min(prevState.highlighted + 1, lastIndex)
              : Math.max(prevState.highlighted - 1, 0),
        };
      });
    } else if (eventKey === 'Enter') {
      const value = options[currentHighlighted].props.value;
      const { onChange } = this.props;
      if (onChange) {
        onChange(value);
      }
    }
  };

  render() {
    const {
      expanded,
      children,
      className,
      optionWrapperClassName,
      triggerClassName,
      ariaLabel,
      onExpandEvent,
      menu,
      tooltip,
    } = this.props;

    const { highlighted } = this.state;
    const options = children.slice(1, children.length);

    const DropdownWrapperClass = classNames(
      {
        ['Editor-dropdown']: true,
        ['Editor-dropdown--expanded']: expanded,
      },
      className
    );

    const trigger = (
      <Button
        ref={this.buttonRef}
        appearance="transparent"
        aria-expanded={expanded}
        aria-label={ariaLabel || 'Editor-dropdown'}
        className={triggerClassName}
        onClick={this.handleExpand}
      >
        {children[0]}
        {!menu && <Icon name="keyboard_arrow_down" />}
      </Button>
    );

    return (
      <div className={DropdownWrapperClass}>
        {tooltip ? <Tooltip tooltip={tooltip}>{trigger}</Tooltip> : trigger}
        {/* <a className={triggerClassName} onClick={onExpandEvent}>
          {children[0]}
          {!menu && <Icon name="keyboard_arrow_down" />}
        </a> */}
        {expanded && (
          <ul
            id={this.listId}
            tabIndex={-1}
            role="listbox"
            aria-label={ariaLabel || 'Editor-dropdown'}
            aria-activedescendant={highlighted >= 0 ? this.getOptionId(highlighted) : undefined}
            ref={this.listRef}
            onKeyDown={this.handleListKeyDown}
            className={classNames('Editor-dropdown-optionWrapper', optionWrapperClassName)}
            onClick={stopPropagation}
          >
            {React.Children.map(options, (option, index) => {
              const temp =
                option &&
                React.cloneElement(option, {
                  id: this.getOptionId(index),
                  onSelect: this.onChange,
                  highlighted: highlighted === index,
                  setHighlighted: this.setHighlighted,
                  highlightedClassName: 'Editor-dropdown-option--highlight',
                  index,
                });
              return temp;
            })}
          </ul>
        )}
      </div>
    );
  }
}
