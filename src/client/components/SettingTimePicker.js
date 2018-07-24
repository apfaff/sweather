import React from 'react'
import { Button, DatePickerIOS, Platform, StyleSheet, Text, TimePickerAndroid, View } from 'react-native'
import PropTypes from 'prop-types'

import style from '../styles/styles'

class SettingTimePicker extends React.Component {
  getDate = () => {
    let date = new Date()
    date.setHours(this.props.default.hour, this.props.default.minute)
    return date
  }

  openTimePickerAndroid = async () => {
    try {
      const result = await TimePickerAndroid.open({
        hour: this.props.default.hour,
        min: this.props.default.minute
      })

      if (result !== TimePickerAndroid.dismissedAction) {
        this.props.onChange(result)
      }
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>At what time?</Text>
        {
          Platform.OS === 'ios'
            ? <DatePickerIOS
              date={this.getDate()}
              mode={'time'}
              onDateChange={date => this.props.onChange(date)} />
            : <Button
              title={`${this.props.default.hour}:${this.props.default.minute}`}
              onPress={this.openTimePickerAndroid} />
        }
      </View>
    )
  }
}

SettingTimePicker.propTypes = {
  default: PropTypes.object,
  onChange: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginVertical: 10
  },
  text: {
    ...style.text
  }
})

export default SettingTimePicker
