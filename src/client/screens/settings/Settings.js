import React from 'react'
import { AsyncStorage, Button, StyleSheet, ScrollView, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'

import SettingSlider from '../../components/SettingSlider'
import SettingPicker from '../../components/SettingPicker'
import SettingTimePicker from '../../components/SettingTimePicker'
import NotificationSwitch from '../../components/NotificationSwitch'

export default class Settings extends React.Component {
  static propTypes = {
    changeSlide: PropTypes.func
  }

  state = {
    notifications: false,
    delivery: {
      hour: 6,
      minute: 0
    },
    temperature: {
      scale: 'celsius',
      cold: 278.15,
      warm: 294.15
    },
    location: {
      lng: null,
      lat: null
    }
  }

  async componentWillMount () {
    // TODO: get initial state from AsyncStorage
  }

  async componentWillUnmount () {
    // TODO: make server requests here
    // fetch POST to API /register
  }

  _handleChange = field => async (name, value) => {
    this.setState({
      ...this.state,
      [field]: { ...this.state[field], [name]: value }
    })

    try {
      await AsyncStorage.setItem(field, JSON.stringify(this.state[field]))
    } catch (err) {
      console.error(err)
    }
  }

  _handleNotificationToggle = async value => {
    this.setState({ notifications: value })

    try {
      await AsyncStorage.setItem('notifications', JSON.stringify(this.state.notifications))
    } catch (err) {
      console.error(err)
    }
  }

  // NOTE: Call to API will be debounced, because iOS does not hide TimePicker like on Android
  _handleTimeChange = async date => {
    // Because iOS returns a Date object check for any own method
    const ios = typeof date.getHours !== 'undefined'
    this.setState({
      delivery: {
        hour: ios ? date.getHours() : date.hour,
        minute: ios ? date.getMinutes() : date.minutes
      }
    })

    try {
      await AsyncStorage.setItem('delivery', JSON.stringify(this.state.delivery))
    } catch (err) {
      console.error(err)
    }
  }

  _handlePress = async () => {
    this.props.changeSlide(-1)
  }

  render () {
    const { notifications, delivery, temperature } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Settings Screen</Text>
        <ScrollView
          style={styles.scrollview}>
          <SettingPicker
            name={'scale'}
            default={temperature.scale}
            onChange={this._handleChange('temperature')} />
          <SettingSlider
            name={'warm'}
            description={'Ab welcher Temperatur trägst du ein T-Shirt?'}
            scale={temperature.scale}
            default={temperature.warm}
            onChange={this._handleChange('temperature')} />
          <SettingSlider
            name={'cold'}
            description={'Ab welcher Temperatur trägst du einen Schal?'}
            scale={temperature.scale}
            default={temperature.cold}
            onChange={this._handleChange('temperature')} />
          <NotificationSwitch
            default={notifications}
            onChange={this._handleNotificationToggle} />
          <SettingTimePicker
            default={delivery}
            onChange={_.debounce(this._handleTimeChange, 4000)} />
          <Button
            title={'OK'}
            color={'green'}
            accessibilityLabel={'Save your settings'}
            onPress={this._handlePress} />
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    paddingTop: 20
  },
  scrollview: {
    alignSelf: 'center',
    paddingTop: 20
  },
  text: {
    color: 'white'
  }
})
