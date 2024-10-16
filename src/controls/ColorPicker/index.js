import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toggleCustomInlineStyle, getSelectionCustomInlineStyle, getSelectionEntity } from 'draftjs-utils';

import LayoutComponent from './Component';

class ColorPicker extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    className: PropTypes.string,
  };

  state = {
    expanded: false,
    currentColor: 'var(--text)',
    currentBgColor: undefined,
  };

  constructor(props) {
    super(props);
    const { editorState, modalHandler } = props;
    const state = {
      expanded: false,
      currentColor: undefined,
      currentBgColor: undefined,
    };
    if (editorState) {
      state.currentColor = getSelectionCustomInlineStyle(editorState, ['COLOR']).COLOR || 'color-var(--text)';
      state.currentBgColor = getSelectionCustomInlineStyle(editorState, ['BGCOLOR']).BGCOLOR;
    }

    this.state = state;
    modalHandler.registerCallBack(this.expandCollapse);
  }

  // componentDidUpdate(prevProps) {
  //   const { editorState } = this.props;
  //   if (editorState && editorState !== prevProps.editorState) {
  //     this.setState({
  //       currentColor: getSelectionCustomInlineStyle(editorState, ['COLOR']).COLOR || 'color-var(--text)',
  //       currentBgColor: getSelectionCustomInlineStyle(editorState, ['BGCOLOR']).BGCOLOR,
  //     });
  //   }
  // }

  componentWillUnmount() {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.expandCollapse);
  }

  expandCollapse = () => {
    this.setState({
      expanded: false,
    });
  };

  toggleColorPicker = () => {
    this.setState((prevState) => {
      return {
        expanded: !prevState.expanded,
      };
    });
  };

  toggleColor = (style, color) => {
    const { editorState, onChange } = this.props;
    const entityKey = getSelectionEntity(editorState);

    if (entityKey) {
      const entityType = editorState.getCurrentContent().getEntity(entityKey).getType();
      if (entityType === 'MENTION' || entityType === 'LINK') {
        return;
      }
    }

    this.setState(
      () => {
        return {
          currentColor: color ? `color-${color}` : 'color-var(--text)',
          currentBgColor: getSelectionCustomInlineStyle(editorState, ['BGCOLOR']).BGCOLOR,
          expanded: false,
        };
      },
      () => {
        const newState = toggleCustomInlineStyle(editorState, style, color);
        if (newState) {
          onChange(newState);
        }
      }
    );
  };

  render() {
    const { config, className } = this.props;
    const { currentColor, currentBgColor, expanded } = this.state;
    const ColorPickerComponent = config.component || LayoutComponent;
    const color = currentColor && currentColor.substring(6);
    const bgColor = currentBgColor && currentBgColor.substring(8);

    return (
      <ColorPickerComponent
        config={config}
        className={className}
        onChange={this.toggleColor}
        expanded={expanded}
        onToggle={this.toggleColorPicker}
        currentState={{ color, bgColor }}
      />
    );
  }
}

export default ColorPicker;
