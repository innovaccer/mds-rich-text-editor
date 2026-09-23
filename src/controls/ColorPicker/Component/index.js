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
    this.containerRef = React.createRef();
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
    } else if (!expanded && prevProps.expanded) {
      // The palette (and whichever swatch had focus) unmounts on close; without this,
      // the browser just drops focus to the document body instead of the trigger.
      this.focusTrigger();
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

  // Mirrors design-system's own Modal restore-focus-on-close convention
  // (restoreFocusToElementIfConnected in overlayHelper.ts): defer via
  // requestAnimationFrame so the closing swatch finishes unmounting first,
  // and re-check isConnected in case the trigger itself is gone by then too.
  // Unlike focusSwatch, no retry loop is needed here — the trigger button
  // is always rendered, open or closed, so it already exists synchronously.
  focusTrigger = () => {
    const triggerEl = this.containerRef.current?.querySelector('[aria-haspopup="true"]');
    if (!triggerEl?.focus || !triggerEl.isConnected) return;

    window.requestAnimationFrame(() => {
      if (triggerEl.isConnected) {
        triggerEl.focus();
      }
    });
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
    if (event.key === 'Tab') {
      this.trapTabFocus(event);
      return;
    }

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

  // Keeps Tab/Shift+Tab cycling within the swatches while the palette is open,
  // instead of leaving it to escape into the rest of the page: the popover has
  // no visible way to know it's still open once focus has moved past it.
  trapTabFocus = (event) => {
    const currentIndex = this.swatchRefs.indexOf(event.target);
    if (currentIndex === -1) {
      return;
    }

    const lastIndex = this.swatchRefs.length - 1;

    if (!event.shiftKey && currentIndex === lastIndex) {
      event.preventDefault();
      this.focusSwatch(0);
    } else if (event.shiftKey && currentIndex === 0) {
      event.preventDefault();
      this.focusSwatch(lastIndex);
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
      <div className={className} ref={this.containerRef}>
        <Popover trigger={trigger} position="bottom-start" open={expanded}>
          {this.renderModal()}
        </Popover>
      </div>
    );
  }
}

export default LayoutComponent;
