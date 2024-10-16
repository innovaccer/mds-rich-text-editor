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
  };

  constructor(props) {
    super(props);
    this.state = {
      currentStyle: 'color',
    };
    this.ref = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { expanded } = this.props;
    if (expanded && !prevProps.expanded) {
      if (this.ref.current) {
        // Todo
        // this.ref.current.focus();
      }
      this.setState({
        currentStyle: 'color',
      });
    }
  }

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
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.onChange(color);
    }
  };

  renderModal = () => {
    const {
      config: { colors },
      currentState: { color, bgColor },
    } = this.props;

    const { currentStyle } = this.state;
    const currentSelectedColor = currentStyle === 'color' ? color : bgColor;

    return (
      <div className={'Editor-colorPicker'} onClick={this.handleClick} onKeyDown={this.handleKeyDown}>
        {colors.map((c, index) => (
          <div className="Editor-colorPicker-circleWrapper">
            <div
              ref={index === 0 ? this.ref : null}
              data-color={c}
              tabIndex={0}
              key={index}
              style={{ backgroundColor: c }}
              className="Editor-colorPicker-circle"
              aria-selected={currentSelectedColor === c}
            />
            {currentSelectedColor === c && (
              <Icon name="check" appearance="white" className={'Editor-colorPicker-selectedCircle'} />
            )}
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { expanded, onToggle, className } = this.props;

    const trigger = (
      <Tooltip tooltip="Text color">
        <Option
          tabIndex={0}
          aria-label="Font colors"
          onClick={onToggle}
          active={expanded}
          activeClassName="bg-secondary"
        >
          <Icon name="text_format" size={20} />
        </Option>
      </Tooltip>
    );

    return (
      <div className={className} aria-haspopup="true" aria-expanded={expanded}>
        <Popover trigger={trigger} position="bottom-start" open={expanded}>
          {this.renderModal()}
        </Popover>
      </div>
    );
  }
}

export default LayoutComponent;
