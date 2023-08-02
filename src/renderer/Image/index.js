import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, SelectionState, Modifier } from 'draft-js';
import classNames from 'classnames';
import { Icon } from '@innovaccer/design-system';
import ImageResizer from './ImageResizer';
import './style.css';

const getImageComponent = (config) =>
  class Image extends Component {
    imageRef = null;

    constructor(props) {
      super(props);
      this.imageRef = React.createRef();
      this.onResizeEnd = this.onResizeEnd.bind(this);
    }

    static propTypes = {
      block: PropTypes.object,
      contentState: PropTypes.object,
    };

    state = {
      hovered: false,
    };

    setEntityAlignmentLeft = () => {
      this.setEntityAlignment('left');
    };

    setEntityAlignmentRight = () => {
      this.setEntityAlignment('right');
    };

    setEntityAlignmentCenter = () => {
      this.setEntityAlignment('center');
    };

    setEntityAlignment = (alignment) => {
      const { block, contentState } = this.props;
      const entityKey = block.getEntityAt(0);
      contentState.mergeEntityData(entityKey, { alignment: alignment, alt: alignment });
      config.onChange(EditorState.push(config.getEditorState(), contentState, 'change-block-data'));
    };

    removeEntity = (e) => {
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

    toggleHovered = () => {
      if (this.state.hovered) {
        const editorState = config.getEditorState();
        const contentState = editorState.getCurrentContent();
        config.onChange(EditorState.push(config.getEditorState(), contentState, ''));
      }

      this.setState({
        hovered: !this.state.hovered,
      });
    };

    renderAlignmentOptions(isImageResizeEnabled) {
      return (
        <div className={`Popover d-flex ${isImageResizeEnabled ? 'mt-4' : ''}`}>
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
      );
    }

    updateImageSize(newWidth, newHeight) {
      const { block } = this.props;

      const entityKey = block.getEntityAt(0);
      const editorState = config.getEditorState();
      const contentState = editorState.getCurrentContent();
      const newContentState = contentState.mergeEntityData(entityKey, {
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      });
      config.onChange(EditorState.push(config.getEditorState(), newContentState, ''));

      // Insert extra spaces to preserve editor state
      const tabCharacter = ' ';
      const currentState = config.getEditorState();
      let modifiedContentState = Modifier.replaceText(
        currentState.getCurrentContent(),
        currentState.getSelection(),
        tabCharacter
      );
      config.onChange(EditorState.push(currentState, modifiedContentState, 'insert-characters'));
    }

    onResizeEnd(newWidth, newHeight) {
      this.setState({
        hovered: false,
      });

      this.updateImageSize(newWidth, newHeight);
    }

    render() {
      const { block, contentState } = this.props;
      const { hovered } = this.state;
      const { isImageAlignmentEnabled, isImageResizeEnabled, isReadOnly, nonFloatingImage } = config;
      const entity = contentState.getEntity(block.getEntityAt(0));
      const { src, alignment, height, width, alt } = entity.getData();

      if (alt === 'center' && !alignment) {
        this.setEntityAlignmentCenter();
      } else if (nonFloatingImage && alt === 'right' && !alignment) {
        this.setEntityAlignmentRight();
      } else if (nonFloatingImage && alt === 'left' && !alignment) {
        this.setEntityAlignmentLeft();
      }

      const editorRef = document.getElementById('RichTextEditorWrapper');

      const wrapperClass = classNames({
        'd-flex': true,
        'justify-content-end': alignment === 'right',
        'justify-content-start': !alignment || alignment === 'left',
        'justify-content-center': alignment === 'center',
      });

      const imgWrapperClass = classNames({
        'position-relative': true,
        'Editor-image--selected': hovered && isImageResizeEnabled,
        'Editor-image': !hovered && isImageResizeEnabled,
        'ml-4': isImageResizeEnabled,
      });

      return (
        <div className={wrapperClass}>
          <span
            onClick={this.toggleHovered}
            className={imgWrapperClass}
          >
            <img
              src={src}
              alt={alt}
              style={{
                height,
                width,
              }}
              ref={this.imageRef}
            />
            {!isReadOnly && hovered && (
              <>
                {isImageAlignmentEnabled() && this.renderAlignmentOptions(isImageResizeEnabled)}
                {isImageResizeEnabled && (
                  <ImageResizer editor={editorRef} imageRef={this.imageRef} onResizeEnd={this.onResizeEnd} />
                )}
              </>
            )}
          </span>
        </div>
      );
    }
  };

export default getImageComponent;
