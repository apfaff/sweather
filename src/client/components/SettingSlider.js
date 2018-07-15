import React from 'react'
import { Slider, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'

const SettingSlider = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {props.description}
      </Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderTextLeft}>0</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={30}
          step={1}
          value={props.default}
          onSlidingComplete={value => props.onChange(props.name, value)}
          onValueChange={null} />
        <Text style={styles.sliderTextRight}>30</Text>
      </View>
    </View>
  )
}

SettingSlider.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  default: PropTypes.number,
  onChange: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: 'dimgrey'
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  slider: {
    flex: 1
  },
  sliderTextRight: {
    marginLeft: 10
  },
  sliderTextLeft: {
    marginRight: 10
  }
})

export default SettingSlider
