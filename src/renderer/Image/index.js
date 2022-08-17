import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, SelectionState, Modifier } from 'draft-js';
import classNames from 'classnames';
import { Icon, Popover } from '@innovaccer/design-system';

const getImageComponent = (config) =>
  class Image extends Component {
    static propTypes: Object = {
      block: PropTypes.object,
      contentState: PropTypes.object,
    };

    state: Object = {
      hovered: false,
    };

    setEntityAlignmentLeft: Function = (): void => {
      this.setEntityAlignment('left');
    };

    setEntityAlignmentRight: Function = (): void => {
      this.setEntityAlignment('right');
    };

    setEntityAlignmentCenter: Function = (): void => {
      this.setEntityAlignment('center');
    };

    setEntityAlignment: Function = (alignment): void => {
      const { block, contentState } = this.props;
      const entityKey = block.getEntityAt(0);
      contentState.mergeEntityData(entityKey, { alignment });
      config.onChange(EditorState.push(config.getEditorState(), contentState, 'change-block-data'));
    };

    removeEntity: Function = (e): void => {
      e.preventDefault();
      e.stopPropagation();
      const { block, contentState } = this.props;

      const blockKey = block.getKey();
      const afterKey = contentState.getKeyAfter(blockKey);

      const targetRange = new SelectionState({
        anchorKey: blockKey,
        anchorOffset: 0,
        focusKey: afterKey,
        focusOffset: 0,
      });

      let newContentState = Modifier.setBlockType(contentState, targetRange, 'unstyled');

      newContentState = Modifier.removeRange(newContentState, targetRange, 'backward');
      config.onChange(EditorState.push(config.getEditorState(), newContentState, 'remove-range'));
    };

    toggleHovered: Function = (): void => {
      const hovered = true;
      this.setState({
        hovered,
      });
    };

    renderAlignmentOptions(): Object {
      return (
        <Popover position="bottom-end" appendToBody={false} open={true}>
          <div className="d-flex">
            <div onClick={this.setEntityAlignmentLeft} className="Editor-image-options">
              <Icon name="format_align_left" size={20} />
            </div>
            <div onClick={this.setEntityAlignmentCenter} className="Editor-image-options">
              <Icon name="format_align_center" size={20} />
            </div>
            <div onClick={this.setEntityAlignmentRight} className="Editor-image-options">
              <Icon name="format_align_right" size={20} />
            </div>
            <div onClick={this.removeEntity} className="Editor-image-options">
              <Icon name="delete" size={20} />
            </div>
          </div>
        </Popover>
      );
    }

    render(): Object {
      const { block, contentState } = this.props;
      const { hovered } = this.state;
      const { isImageAlignmentEnabled } = config;
      const entity = contentState.getEntity(block.getEntityAt(0));
      const { src, alignment, height, width, alt } = entity.getData();

      const wrapperClass = classNames({
        'd-flex': true,
        'justify-content-end': alignment === 'right',
        'justify-content-start': !alignment || alignment === 'left',
        'justify-content-center': alignment === 'center',
      });

      return (
        <div onClick={this.toggleHovered} className={wrapperClass}>
          <span className="position-relative">
            <img
              src={src}
              alt={alt}
              style={{
                height,
                width,
              }}
            />
            {hovered && isImageAlignmentEnabled() && this.renderAlignmentOptions(alignment)}
          </span>
        </div>
      );
    }
  };

export default getImageComponent;
