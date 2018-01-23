import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableHighlight } from 'react-native';
import Collapsible from './Collapsible';
import { ViewPropTypes } from './config';

const COLLAPSIBLE_PROPS = Object.keys(Collapsible.propTypes);
const VIEW_PROPS = Object.keys(ViewPropTypes);

export default class Accordion extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    itemIndex: PropTypes.number.isRequired,
    renderHeader: PropTypes.func.isRequired,
    renderContent: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    align: PropTypes.oneOf(['top', 'center', 'bottom']),
    duration: PropTypes.number,
    easing: PropTypes.string,
    initiallyActiveSection: PropTypes.number,
    activeSection: PropTypes.oneOfType([
      PropTypes.bool, // if false, closes all sections
      PropTypes.number, // sets index of section to open
    ]),
    underlayColor: PropTypes.string,
    touchableComponent: PropTypes.func,
    touchableProps: PropTypes.object,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    underlayColor: 'black',
    disabled: false,
    touchableComponent: TouchableHighlight,
  };

  constructor(props) {
    super(props);

    // if activeSection not specified, default to initiallyActiveSection
    this.state = {
      activeSection:
        props.activeSection !== undefined
          ? props.activeSection
          : props.initiallyActiveSection,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeSection !== undefined) {
      this.setState({
        activeSection: nextProps.activeSection,
      });
    }
  }

  _toggleSection(section) {
    if (!this.props.disabled) {
      const activeSection =
        this.state.activeSection === section ? false : section;

      if (this.props.activeSection === undefined) {
        this.setState({ activeSection });
      }
      if (this.props.onChange) {
        this.props.onChange(activeSection);
      }
    }
  }

  render() {
    let viewProps = {};
    let collapsibleProps = {};
    Object.keys(this.props).forEach(key => {
      if (COLLAPSIBLE_PROPS.indexOf(key) !== -1) {
        collapsibleProps[key] = this.props[key];
      } else if (VIEW_PROPS.indexOf(key) !== -1) {
        viewProps[key] = this.props[key];
      }
    });

    const Touchable = this.props.touchableComponent;

    return (
      <View {...viewProps}>
        <View key={this.props.itemIndex}>
          <Touchable
            onPress={() => this._toggleSection(this.props.itemIndex)}
            underlayColor={this.props.underlayColor}
            {...this.props.touchableProps}
          >
            {this.props.renderHeader(
              this.props.item,
              this.props.itemIndex,
              this.state.activeSection === this.props.itemIndex,
            )}
          </Touchable>
          <Collapsible
            collapsed={this.state.activeSection !== this.props.itemIndex}
            {...collapsibleProps}
          >
            {this.props.renderContent(
              this.props.item,
              this.props.itemIndex,
              this.state.activeSection === this.props.itemIndex,
            )}
          </Collapsible>
        </View>
      </View>
    );
  }
}
