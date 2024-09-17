import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import addMention from '../addMention';
import KeyDownHandler from '../../../event-handler/keyDown';
import SuggestionHandler from '../../../event-handler/suggestions';
import { Icon, Text, Popover, Placeholder, PlaceholderParagraph } from '@innovaccer/design-system';
import { searchElement, debounce } from '../../../utils/common';

class Suggestion {
  constructor(config) {
    const {
      separator = ' ',
      trigger = '@',
      getSuggestions,
      onChange,
      getEditorState,
      getWrapperRef,
      caseSensitive,
      optionClassName,
      modalHandler,
      dropdownOptions,
      fetchSuggestions,
    } = config;
    this.config = {
      separator,
      trigger,
      getSuggestions,
      onChange,
      getEditorState,
      getWrapperRef,
      caseSensitive,
      dropdownOptions,
      optionClassName,
      modalHandler,
      fetchSuggestions,
    };
  }

  findSuggestionEntities = (contentBlock, callback) => {
    if (this.config.getEditorState()) {
      const { separator, trigger, getSuggestions, getEditorState, fetchSuggestions } = this.config;
      const selection = getEditorState().getSelection();
      if (
        selection.get('anchorKey') === contentBlock.get('key') &&
        selection.get('anchorKey') === selection.get('focusKey')
      ) {
        let text = contentBlock.getText();

        text = text.substr(
          0,
          selection.get('focusOffset') === text.length - 1 ? text.length : selection.get('focusOffset') + 1
        );
        let index = text.lastIndexOf(separator + trigger);
        let preText = separator + trigger;
        if ((index === undefined || index < 0) && text[0] === trigger) {
          index = 0;
          preText = trigger;
        }

        if (index >= 0) {
          if (fetchSuggestions) {
            callback(index === 0 ? 0 : index + 1, text.length);
          } else {
            const staticSuggestionList = getSuggestions();
            const mentionText = text.substr(index + preText.length, text.length);
            const suggestionPresent = searchElement(staticSuggestionList, mentionText, this.config.caseSensitive);

            if (suggestionPresent.length > 0) {
              callback(index === 0 ? 0 : index + 1, text.length);
            }
          }
        }
      }
    }
  };

  getSuggestionComponent = getSuggestionComponent.bind(this);

  getSuggestionDecorator = () => ({
    strategy: this.findSuggestionEntities,
    component: this.getSuggestionComponent(),
  });
}

function getSuggestionComponent() {
  const { config } = this;
  return class SuggestionComponent extends Component {
    static propTypes = {
      children: PropTypes.array,
    };

    state = {
      style: { left: 15 },
      activeOption: -1,
      showSuggestions: true,
      showLoader: false,
      keyDown: true,
    };

    componentDidMount() {
      const suggestionRect = this.suggestion.getBoundingClientRect();
      let left = suggestionRect.left;
      let top = suggestionRect.top + 25;
      this.setState({
        // eslint-disable-line react/no-did-mount-set-state
        style: { left, top },
      });
      KeyDownHandler.registerCallBack(this.onEditorKeyDown);
      SuggestionHandler.open();
      this.updateSuggestions(this.props);
      this.setState({
        showSuggestions: true,
      });

    }

    componentDidUpdate(props) {
      const { children } = this.props;
      if (children !== props.children) {
        this.updateSuggestions(this.props);
        this.setState({
          showSuggestions: true,
        });
      }
    }

    componentWillUnmount() {
      KeyDownHandler.deregisterCallBack(this.onEditorKeyDown);
      SuggestionHandler.close();
      config.modalHandler.removeSuggestionCallback();
    }

    focusOption = (direction, classes, index, customOptionClass) => {
      let elements = document.querySelectorAll(classes);

      if (elements.length === 0) {
        elements = document.querySelectorAll(`.${customOptionClass}`);
      }
      if (typeof index == 'string') {
        index = parseInt(index);
      }
      const updatedCursor = direction === 'down' ? index + 1 : index - 1;
      let startIndex = updatedCursor;
      const endIndex = direction === 'down' ? elements.length : -1;
      if (startIndex === endIndex) {
        startIndex = 0;
      }
      if (updatedCursor === -1 && endIndex === -1) {
        startIndex = elements.length - 1;
      }
      const element = elements[startIndex];
      if (element) {
        element.scrollIntoView({ block: 'end' });
      }
    };

    onEditorKeyDown = (event) => {
      const { activeOption } = this.state;
      const newState = {};
      const customOptionClass = config?.dropdownOptions?.dropdownOptionClassName;
      const optionClass = '.Editor-dropdown-option' || `.${customOptionClass}`;

      this.disableMouseEvents();
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focusOption('down', optionClass, activeOption, customOptionClass);
        if (activeOption === this.filteredSuggestions.length - 1) {
          newState.activeOption = 0;
        } else {
          newState.activeOption = Number(activeOption) + 1;
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focusOption('up', optionClass, activeOption, customOptionClass);
        if (activeOption <= 0) {
          newState.activeOption = this.filteredSuggestions.length - 1;
        } else {
          newState.activeOption = Number(activeOption) - 1;
        }
      } else if (event.key === 'Escape') {
        newState.showSuggestions = false;
        SuggestionHandler.close();
      } else if (event.key === 'Enter') {
        this.addMention();
      }
      this.setState(newState);
    };

    onOptionMouseOver = (event) => {
      this.enableMouseEvents();
      const index = parseInt(event.target.getAttribute('data-index'));
      if (index >= 0 && index < this.filteredSuggestions.length) {
        this.setState({
          activeOption: index,
        });
      }
    };

    disableMouseEvents = () => {
      this.setState({
        keyDown: true,
      });
    };

    enableMouseEvents = () => {
      this.setState({
        keyDown: false,
      });
    };

    setSuggestionReference = (ref) => {
      this.suggestion = ref;
    };

    setDropdownReference = (ref) => {
      this.dropdown = ref;
    };

    filteredSuggestions = [];

    filterSuggestions = (mentionText) => {
      const suggestions = config.getSuggestions ? config.getSuggestions() : [];
      this.filteredSuggestions = searchElement(suggestions, mentionText, config.caseSensitive);
    };

    debouncedFetchSuggestion = debounce((mentionText) => {
      config.fetchSuggestions(mentionText).then((result) => {
        this.filteredSuggestions = result;
        this.setState({
          showSuggestions: result.length > 0,
          showLoader: false,
        });
      });
    });

    updateSuggestions = (props) => {
      const mentionText = props.children[0].props.text.substr(1);

      if (config.fetchSuggestions) {
        this.setState({
          showLoader: true,
        });
        this.debouncedFetchSuggestion(mentionText);
      } else {
        this.filterSuggestions(mentionText);
      }
    };

    addMention = (eventName, label, value) => {
      const { activeOption } = this.state;
      const editorState = config.getEditorState();
      const { onChange, separator, trigger } = config;
      const selectedMention = this.filteredSuggestions[activeOption] || {
        label,
        value,
      };
      const mentionText = this.props.children[0].props.text.substr(1);
      if (selectedMention) {
        addMention(editorState, onChange, separator, trigger, selectedMention, eventName, mentionText);
      }
    };

    getOptionClass = (index) => {
      const { activeOption } = this.state;

      const OptionClass = classNames({
        ['Editor-dropdown-option']: true,
        ['Editor-dropdown-option--highlight']: index === activeOption,
        ['Editor-dropdown--keydown']: this.state.keyDown,
      });

      return OptionClass;
    };

    renderOption = (suggestion, index) => {
      const { dropdownOptions = {} } = config;
      const { customOptionRenderer } = dropdownOptions;
      const { icon, label } = suggestion;

      if (customOptionRenderer) {
        const optionRenderer = customOptionRenderer(suggestion, this.state.activeOption, index);
        const CustomOption = React.cloneElement(optionRenderer, {
          key: index,
          spellCheck: false,
          onClick: (ev) => {
            this.addMention(ev);
            if (optionRenderer.props.onClick) {
              optionRenderer.props.onClick();
            }
          },
          'data-index': index,
          onMouseOver: this.onOptionMouseOver,
        });
        return CustomOption;
      }

      return (
        <span
          key={index}
          spellCheck={false}
          onClick={() => this.addMention('onMouseSelect')}
          data-index={index}
          onMouseOver={this.onOptionMouseOver}
          className={this.getOptionClass(index)}
        >
          {icon && <Icon name={icon} className="mr-4" />}
          <Text>{label}</Text>
        </span>
      );
    };

    mentionPopover = (popoverRenderer) => {
      const { showLoader, showSuggestions } = this.state;

      if (popoverRenderer) {
        return popoverRenderer(
          this.filteredSuggestions,
          this.addMention,
          showLoader,
          showSuggestions,
          this.state.activeOption
        );
      }

      if (showLoader) {
        return (
          <span className="Editor-dropdown-option">
            <Placeholder withImage={false}>
              <PlaceholderParagraph length="large" />
              <PlaceholderParagraph length="large" />
              <PlaceholderParagraph length="large" />
            </Placeholder>
          </span>
        );
      }

      return this.filteredSuggestions.map((suggestion, index) => this.renderOption(suggestion, index));
    };

    render() {
      const { children } = this.props;
      const { showSuggestions } = this.state;
      const { dropdownOptions = {} } = config;
      const { dropdownClassName, popoverRenderer, appendToBody = true } = dropdownOptions;

      const DropdownClass = classNames({
        ['Popover']: true,
        [`${dropdownClassName}`]: dropdownClassName !== undefined,
        ['Editor-mention-dropdown']: true,
      });

      return (
        <span
          className="Editor-mention-suggestion"
          ref={this.setSuggestionReference}
          onClick={config.modalHandler.onSuggestionClick}
          aria-haspopup="true"
        >
          <span>{children}</span>
          {showSuggestions && (
            <Popover
              position="bottom-start"
              open={true}
              appendToBody={appendToBody}
              boundaryElement={this.setSuggestionReference}
              className={DropdownClass}
              contentEditable="false"
              suppressContentEditableWarning
              ref={this.setDropdownReference}
              onMouseMove={this.enableMouseEvents}
              onMouseLeave={this.disableMouseEvents}
              onScroll={this.enableMouseEvents}
            >
              {this.mentionPopover(popoverRenderer)}
            </Popover>
          )}
        </span>
      );
    }
  };
}

export default Suggestion;
