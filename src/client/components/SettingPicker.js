import React from 'react'
import { Picker, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'

const SettingPicker = props => (
  <View style={styles.container}>
    <Text style={styles.text}>Welche Temperatureinheit nutzt man bei dir?</Text>
    <Picker
      style={styles.picker}
      mode={'dropdown'}
      itemStyle={styles.pickerItem}
      selectedValue={props.default}
      onValueChange={(itemValue, itemPosition) => props.onChange(props.name, itemValue)} >
      <Picker.Item label='Celsius' value='celsius' />
      <Picker.Item label='Fahrenheit' value='fahrenheit' />
    </Picker>
  </View>
)

SettingPicker.propTypes = {
  name: PropTypes.string,
  default: PropTypes.string,
  onChange: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  text: {
    color: 'white'
  },
  picker: {
    alignSelf: 'stretch'
  },
  pickerItem: {
    height: 46
  }
})

export default SettingPicker
