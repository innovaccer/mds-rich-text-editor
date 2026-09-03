import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { stopPropagation } from '../../../utils/common';
import Option from '../../../components/Option';
import { Button, Icon, Popover, Tooltip } from '@innovaccer/design-system';

class LayoutComponent extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    onChange: PropTypes.func,
    config: PropTypes.object,
    currentState: PropTypes.object,
    className: PropTypes.className,
    toolbarContext: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentStyle: 'color',
    };
    this.swatchRefs = [];
  }

  componentDidUpdate(prevProps) {
    const { expanded } = this.props;
    if (expanded && !prevProps.expanded) {
      const {
        config: { colors },
        currentState: { color, bgColor },
      } = this.props;
      const currentSelectedColor = this.state.currentStyle === 'color' ? color : bgColor;
      const selectedIndex = colors.indexOf(currentSelectedColor);
      const focusIndex = selectedIndex === -1 ? 0 : selectedIndex;
      this.setState({
        currentStyle: 'color',
      });
      this.focusSwatch(focusIndex);
    }
  }

  focusSwatch = (index, retriesLeft = 5) => {
    if (this.swatchRefs[index]) {
      this.swatchRefs[index].focus();
      return;
    }
    if (retriesLeft > 0) {
      setTimeout(() => this.focusSwatch(index, retriesLeft - 1), 16);
    }
  };

  onChange = (color) => {
    const { onChange, expanded } = this.props;
    if (!expanded) return;
    const { currentStyle } = this.state;
    onChange(currentStyle, color);
  };

  handleClick = (event) => {
    const color = event.target.getAttribute('data-color');
    if (!color) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.onChange(color);
  };

  handleKeyDown = (event) => {
    const color = event.target.getAttribute('data-color');
    if (!color) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      event.stopPropagation();
      this.onChange(color);
    }
  };

  getColorLabel = (colorValue) => {
    const match = /^var\(--([a-zA-Z0-9]+)\)$/.exec(colorValue);
    const name = match ? match[1] : colorValue;
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  renderModal = () => {
    const {
      config: { colors },
      currentState: { color, bgColor },
    } = this.props;

    const { currentStyle } = this.state;
    const currentSelectedColor = currentStyle === 'color' ? color : bgColor;

    return (
      <div
        className={'Editor-colorPicker'}
        role="radiogroup"
        aria-label="Text color"
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
      >
        {colors.map((c, index) => {
          const isSelected = currentSelectedColor === c;
          return (
            <div className="Editor-colorPicker-circleWrapper" key={index}>
              <div
                ref={(el) => {
                  this.swatchRefs[index] = el;
                }}
                data-color={c}
                tabIndex={0}
                style={{ backgroundColor: c }}
                className="Editor-colorPicker-circle"
                role="radio"
                aria-checked={isSelected}
                aria-label={this.getColorLabel(c)}
              />
              {isSelected && <Icon name="check" appearance="white" className={'Editor-colorPicker-selectedCircle'} />}
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { expanded, onToggle, className, toolbarContext } = this.props;

    const ariaLabel = toolbarContext ? `Font colors ${toolbarContext}` : 'Font colors';

    const trigger = (
      <Tooltip tooltip="Text color">
        <Option
          tabIndex={0}
          aria-label={ariaLabel}
          onClick={onToggle}
          active={expanded}
          activeClassName="bg-secondary"
          aria-expanded={expanded}
          aria-haspopup="true"
        >
          <Icon name="text_format" size={20} />
        </Option>
      </Tooltip>
    );

    return (
      <div className={className}>
        <Popover trigger={trigger} position="bottom-start" open={expanded}>
          {this.renderModal()}
        </Popover>
      </div>
    );
  }
}

export default LayoutComponent;
