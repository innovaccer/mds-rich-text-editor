/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Option extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.any,
    value: PropTypes.string,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    tabIndex: PropTypes.number,
  };

  static defaultProps = {
    activeClassName: '',
  };

  onClick = () => {
    const { disabled, onClick, value } = this.props;
    if (!disabled) {
      onClick(value);
    }
  };

  handleKeyDown = (event) => {
    const allowedActions = new Set(['Enter', 'Space', 'Spacebar', ' ']);
    const { disabled, onClick, value } = this.props;

    if (disabled) {
      return;
    }

    if (allowedActions.has(event.key)) {
      event.preventDefault();
      onClick(value, event);
    }
  };

  render() {
    const { children, className, activeClassName, active, disabled, 'aria-label': ariaLabel } = this.props;

    const OptionClass = classNames(
      {
        ['Editor-option']: true,
        [`Editor-option--active`]: active && !activeClassName,
        [`${activeClassName}`]: active && activeClassName,
        ['Editor-option--disabled']: disabled,
      },
      className
    );

    return (
      <div
        aria-label={ariaLabel}
        onKeyDown={this.handleKeyDown}
        tabIndex={0}
        className={OptionClass}
        onClick={this.onClick}
        aria-selected={active}
      >
        {children}
      </div>
    );
  }
}
