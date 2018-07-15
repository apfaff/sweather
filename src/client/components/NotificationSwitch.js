import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import PropTypes from 'prop-types'

const SettingPicker = props => (
  <View style={styles.container}>
    <Text style={styles.text}>Push Notifications?</Text>
    <Switch
      style={styles.switch}
      value={props.default}
      onValueChange={value => props.onChange(value)} />
  </View>
)

SettingPicker.propTypes = {
  default: PropTypes.string,
  onChange: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  text: {
    color: 'dimgrey'
  },
  switch: {}
})

export default SettingPicker
