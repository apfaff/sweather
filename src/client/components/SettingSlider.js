import React from 'react'
import { Slider, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'

import style from '../styles/styles'
import colors from '../styles/colors'
import dimensions from '../styles/dimensions'
import { kelvinToCelsius, kelvinToFahrenheit } from '../util/weather'

class SettingSlider extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    scale: PropTypes.string,
    default: PropTypes.number,
    onChange: PropTypes.func
  }

  state = {
    value: null
  }

  temperature = () => {
    const value = this.state.value !== null ? this.state.value : this.props.default
    return this.props.scale === 'celsius'
      ? `${kelvinToCelsius(value)} °C`
      : `${kelvinToFahrenheit(value)} °F`
  }

  _handleValueChange = value => {
    this.setState({ value })
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {this.props.description}
        </Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumTrackTintColor={colors.SECONDARY}
            minimumValue={273.15}
            maximumValue={303.15}
            step={1}
            value={this.props.default}
            onSlidingComplete={value => this.props.onChange(this.props.name, value)}
            onValueChange={value => this._handleValueChange(value)} />
          <Text style={styles.value}>{this.temperature()}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  slider: {
    flex: 1,
    marginRight: dimensions.smallWidth
  },
  text: {
    ...style.text
  }
})

export default SettingSlider
