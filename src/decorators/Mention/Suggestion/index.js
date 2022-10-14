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
      config.modalHandler.setSuggestionCallback(this.closeSuggestionDropdown);
      this.updateSuggestions(this.props);
      this.setState({
        showSuggestions: true,
      });

      document.addEventListener('scroll', this.closeSuggestionDropdown, { once: true });
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
      document.removeEventListener('scroll', this.closeSuggestionDropdown);
      KeyDownHandler.deregisterCallBack(this.onEditorKeyDown);
      SuggestionHandler.close();
      config.modalHandler.removeSuggestionCallback();
    }

    focusOption = (direction, classes, index) => {
      const elements = document.querySelectorAll(classes);
      console.log(index);
      console.log('before', typeof index);
      if (typeof index == 'string') {
        index = parseInt(index);
      }

      console.log('after', typeof index);
      const updatedCursor = direction === 'down' ? index + 1 : index - 1;
      let startIndex = updatedCursor;
      const endIndex = direction === 'down' ? elements.length : -1;

      console.log(updatedCursor, startIndex, endIndex);

      // while (startIndex !== endIndex) {
      if (startIndex === endIndex) {
        startIndex = 0;
      }

      if (updatedCursor === -1 && endIndex === -1) {
        startIndex = elements.length - 1;
      }

      // const node = elements[startIndex];

      // if (node.getAttribute('data-disabled') !== 'true') {
      //   const element = elements[startIndex];
      //   console.log(element);
      //   if (element) element.scrollIntoView({ block: 'end' });
      //   // if (element !== undefined) setCursor(startIndex);
      //   break;
      // }

      console.log(updatedCursor, startIndex, endIndex);

      const element = elements[startIndex];
      console.log(element);
      if (element) element.scrollIntoView({ block: 'end' });

      // if (direction === 'down') {
      //   startIndex++;
      // } else {
      //   startIndex--;
      // }
      // }
    };

    onEditorKeyDown = (event) => {
      const { activeOption } = this.state;
      const newState = {};
      const optionClass = '.Editor-dropdown-option';

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focusOption('down', optionClass, activeOption);
        if (activeOption === this.filteredSuggestions.length - 1) {
          newState.activeOption = 0;
        } else {
          newState.activeOption = Number(activeOption) + 1;
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focusOption('up', optionClass, activeOption);
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

    onOptionMouseEnter = (event) => {
      const index = event.target.getAttribute('data-index');
      this.setState({
        activeOption: index,
      });
    };

    onOptionMouseLeave = () => {
      this.setState({
        activeOption: -1,
      });
    };

    setSuggestionReference = (ref) => {
      this.suggestion = ref;
    };

    setDropdownReference = (ref) => {
      this.dropdown = ref;
    };

    closeSuggestionDropdown = () => {
      if (this.state.showSuggestions) {
        this.setState({
          showSuggestions: false,
        });
      }
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

    addMention = (eventName) => {
      const { activeOption } = this.state;
      const editorState = config.getEditorState();
      const { onChange, separator, trigger } = config;
      const selectedMention = this.filteredSuggestions[activeOption];
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
          onMouseEnter: this.onOptionMouseEnter,
          onMouseLeave: this.onOptionMouseLeave,
        });
        return CustomOption;
      }

      return (
        <span
          key={index}
          spellCheck={false}
          onClick={() => this.addMention('onMouseSelect')}
          data-index={index}
          onMouseEnter={this.onOptionMouseEnter}
          onMouseLeave={this.onOptionMouseLeave}
          className={this.getOptionClass(index)}
        >
          {icon && <Icon name={icon} className="mr-4" />}
          <Text>{label}</Text>
        </span>
      );
    };

    render() {
      const { children } = this.props;
      const { showSuggestions } = this.state;
      const { dropdownOptions = {} } = config;
      const { dropdownClassName } = dropdownOptions;

      const DropdownClass = classNames({
        ['Popover']: true,
        [`${dropdownClassName}`]: dropdownClassName !== undefined,
        ['Editor-mention-dropdown']: true,
        ['position-fixed']: true,
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
            <span
              className={DropdownClass}
              style={this.state.style}
              contentEditable="false"
              suppressContentEditableWarning
              ref={this.setDropdownReference}
            >
              {this.state.showLoader ? (
                <span className="Editor-dropdown-option">
                  <Placeholder withImage={false}>
                    <PlaceholderParagraph length="large" />
                    <PlaceholderParagraph length="large" />
                    <PlaceholderParagraph length="large" />
                  </Placeholder>
                </span>
              ) : (
                this.filteredSuggestions.map((suggestion, index) => this.renderOption(suggestion, index))
              )}
            </span>
          )}
        </span>
      );
    }
  };
}

export default Suggestion;
