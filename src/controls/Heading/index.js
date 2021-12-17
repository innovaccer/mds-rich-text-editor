import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getSelectedBlocksType } from 'draftjs-utils';
import { RichUtils } from 'draft-js';

import LayoutComponent from './Component';

class Heading extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object,
    config: PropTypes.object,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const { editorState } = props;
    this.state = {
      expanded: false,
      currentBlockType: editorState ? getSelectedBlocksType(editorState) : 'unstyled',
    };
  }

  componentDidUpdate(prevProps) {
    const { editorState } = this.props;
    if (editorState && editorState !== prevProps.editorState) {
      this.setState({
        currentBlockType: getSelectedBlocksType(editorState),
      });
    }
  }

  expandCollapse = () => {
    this.setState((x) => ({
      expanded: !x.expanded,
    }));
  };

  blocksTypes = [
    //{ label: 'Normal', style: 'unstyled' },
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
  ];

  doExpand = () => {
    this.setState({
      expanded: true,
    });
  };

  doCollapse = () => {
    this.setState({
      expanded: false,
    });
  };

  toggleBlockType = (blockType) => {
    const blockTypeValue = this.blocksTypes.find((bt) => bt.label === blockType).style;
    const { editorState, onChange } = this.props;
    const newState = RichUtils.toggleBlockType(editorState, blockTypeValue);
    if (newState) {
      onChange(newState);
    }
  };

  render() {
    const { config, className } = this.props;
    const { expanded, currentBlockType } = this.state;
    const blockType = this.blocksTypes.find((bt) => bt.style === currentBlockType);

    return (
      <LayoutComponent
        config={config}
        currentState={{ blockType: blockType && blockType.label }}
        onChange={this.toggleBlockType}
        expanded={expanded}
        onExpandEvent={this.expandCollapse}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
        className={className}
      />
    );
  }
}

export default Heading;
