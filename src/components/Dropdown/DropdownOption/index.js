import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class DropDownOption extends Component {
  static propTypes = {
    children: PropTypes.any,
    value: PropTypes.any,
    onClick: PropTypes.func,
    onSelect: PropTypes.func,
    setHighlighted: PropTypes.func,
    index: PropTypes.number,
    disabled: PropTypes.bool,
    active: PropTypes.bool,
    highlighted: PropTypes.bool,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    disabledClassName: PropTypes.string,
    highlightedClassName: PropTypes.string,
    title: PropTypes.string,
    isCheckbox: PropTypes.bool,
  };

  static defaultProps = {
    activeClassName: '',
    disabledClassName: '',
    highlightedClassName: '',
  };

  onClick = (event) => {
    const { onSelect, onClick, value, disabled } = this.props;
    if (!disabled) {
      if (onSelect) {
        onSelect(value);
      }
      if (onClick) {
        event.stopPropagation();
        onClick(value);
      }
    }
  };

  setHighlighted = () => {
    this.props.setHighlighted(this.props.index);
  };

  resetHighlighted = () => {
    const { setHighlighted } = this.props;
    setHighlighted(-1);
  };

  render() {
    const {
      children,
      active,
      disabled,
      highlighted,
      className,
      isCheckbox,
      activeClassName,
      disabledClassName,
      highlightedClassName,
    } = this.props;

    const OptionClass = classNames(
      {
        ['Editor-dropdown-option']: true,
        [`Editor-dropdown-option--active ${activeClassName}`]: active && !isCheckbox,
        [`${highlightedClassName}`]: highlighted,
        [`${disabledClassName}`]: disabled,
      },
      className
    );

    return (
      <li
        tabIndex={1}
        className={OptionClass}
        onMouseEnter={this.setHighlighted}
        onMouseLeave={this.resetHighlighted}
        onClick={this.onClick}
      >
        {children}
      </li>
    );
  }
}
