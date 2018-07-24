import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import PropTypes from 'prop-types'

import style from '../styles/styles'
import colors from '../styles/colors'

const SettingPicker = props => (
  <View style={styles.container}>
    <Text style={styles.text}>Do you want to get notified?</Text>
    <Switch
      style={styles.switch}
      value={props.default}
      onTintColor={colors.SECONDARY}
      onValueChange={value => props.onChange(value)} />
  </View>
)

SettingPicker.propTypes = {
  default: PropTypes.bool,
  onChange: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  switch: {
    marginLeft: 20
  },
  text: {
    flex: 1,
    ...style.text
  }
})

export default SettingPicker
