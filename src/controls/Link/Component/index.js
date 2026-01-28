import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { stopPropagation } from '../../../utils/common';
import Option from '../../../components/Option';
import { DropdownOption } from '../../../components/Dropdown';
import { Popover, Icon, Text, Input, Button, Tooltip, HelpText } from '@innovaccer/design-system';

class LayoutComponent extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    doExpand: PropTypes.func,
    doCollapse: PropTypes.func,
    onExpandEvent: PropTypes.func,
    config: PropTypes.object,
    onChange: PropTypes.func,
    currentState: PropTypes.object,
    inDropdown: PropTypes.boolean,
    errorMessage: PropTypes.string,
    onErrorClear: PropTypes.func,
  };

  state = {
    showModal: false,
    editing: false,
    linkTarget: '',
    linkTitle: '',
    linkTargetOption: this.props.config.defaultTargetOption,
  };

  componentDidUpdate(prevProps) {
    const {
      currentState: { link, selectionText },
    } = this.props;

    if (prevProps.expanded && !this.props.expanded) {
      this.setState({
        showModal: false,
        linkTarget: '',
        linkTitle: '',
        linkTargetOption: this.props.config.defaultTargetOption,
      });
      if (this.props.onErrorClear) {
        this.props.onErrorClear();
      }
    }

    if (!prevProps.expanded && this.props.expanded) {
      this.setState({
        showModal: false,
        linkTarget: link && link.target,
        linkTitle: (link && link.title) || selectionText,
        linkTargetOption: this.props.config.defaultTargetOption,
        editing: link !== undefined,
      });
      if (this.props.onErrorClear) {
        this.props.onErrorClear();
      }
    }
  }

  addLink = () => {
    const { onChange } = this.props;
    const { linkTitle, linkTarget, linkTargetOption } = this.state;
    onChange('link', linkTitle, linkTarget, linkTargetOption);
  };

  updateValue = (event) => {
    this.setState({
      [`${event.target.name}`]: event.target.value,
    });
    if (event.target.name === 'linkTarget' && this.props.onErrorClear) {
      this.props.onErrorClear();
    }
  };

  updateTargetOption = (event) => {
    this.setState({
      linkTargetOption: event.target.checked ? '_blank' : '_self',
    });
  };

  renderAddLinkModal() {
    const { onExpandEvent, errorMessage } = this.props;

    const { linkTitle, linkTarget, editing } = this.state;

    return (
      <div className="px-6 mt-6 mb-5" onClick={stopPropagation}>
        <Text weight="strong" size="large">
          {editing ? 'Edit' : 'Insert a'} link
        </Text>
        <Input
          icon="insert_link"
          className="mt-4"
          placeholder="Paste a link to insert"
          onChange={this.updateValue}
          onBlur={this.updateValue}
          name="linkTarget"
          value={linkTarget}
          autoComplete="off"
          autoFocus={true}
          onClick={stopPropagation}
          error={!!errorMessage}
        />
        {errorMessage && (
          <HelpText message={errorMessage} error={true} className="mt-2" />
        )}
        <Input
          icon="text_fields"
          className="my-5"
          placeholder="Text to display"
          onChange={this.updateValue}
          onBlur={this.updateValue}
          name="linkTitle"
          value={linkTitle}
          autoComplete="off"
          onClick={stopPropagation}
        />
        <div className="d-flex justify-content-end">
          <Button onClick={onExpandEvent} className="mr-4">
            Cancel
          </Button>
          <Button onClick={this.addLink} disabled={!linkTarget || !linkTitle} appearance="primary">
            Save
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const {
      config: { icon, title },
      inDropdown,
      onExpandEvent,
      expanded,
    } = this.props;

    const trigger = !inDropdown ? (
      <Tooltip tooltip="Link">
        <Option
          value="unordered-list-item"
          onClick={onExpandEvent}
          aria-haspopup="true"
          aria-expanded={expanded}
          active={expanded}
          activeClassName="bg-secondary"
        >
          <Icon name={icon} size={20} />
        </Option>
      </Tooltip>
    ) : (
      <DropdownOption>
        <Icon size={20} name={icon} className="mr-4" />
        <Text>{title}</Text>
      </DropdownOption>
    );

    return (
      <div aria-haspopup="true" aria-expanded={expanded}>
        <Popover trigger={trigger} position={inDropdown ? 'right' : 'bottom'} open={expanded} onToggle={onExpandEvent}>
          {this.renderAddLinkModal()}
        </Popover>
      </div>
    );
  }
}

export default LayoutComponent;
