import React from 'react'
import PropTypes from 'prop-types'
import { AsyncStorage, Button, StyleSheet, Text, View } from 'react-native'

import { getSettings, setNotifications, setDeliveryTime } from '../../util/storage'
import style from '../../styles/styles'
import colors from '../../styles/colors'
import dimensions from '../../styles/dimensions'
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
      date: null,
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

  async componentDidMount () {
    const persistentSettings = await getSettings()
    if (persistentSettings) {
      const settings = persistentSettings.reduce((acc, setting) => {
        const [ key, value ] = setting
        if (value !== null) acc[key] = JSON.parse(value)
        return acc
      }, {})

      this.setState({
        ...this.state,
        ...settings
      })
    }
  }

  _handleChange = field => async (name, value) => {
    this.setState({
      ...this.state,
      [field]: { ...this.state[field], [name]: value }
    })

    try {
      await AsyncStorage.setItem(field, JSON.stringify({ ...this.state[field], [name]: value }))
    } catch (err) {
      console.error(err)
    }
  }

  _handleNotificationToggle = async value => {
    this.setState({ notifications: value })

    try {
      await setNotifications(value)
    } catch (err) {
      console.error(err)
    }
  }

  _handleTimeChange = async date => {
    // Because iOS returns a Date object check for any own method
    const ios = typeof date.getHours !== 'undefined'
    const delivery = {
      date: date,
      hour: ios ? date.getHours() : date.hour,
      minute: ios ? date.getMinutes() : date.minute
    }

    this.setState({ delivery })

    try {
      await setDeliveryTime(delivery)
    } catch (err) {
      console.error(err)
    }
  }

  _handlePress = async () => {
    // TODO: make server requests here
    // fetch POST to API /register
    this.props.changeSlide(-1)
  }

  render () {
    const { notifications, delivery, temperature } = this.state

    return (
      <View style={styles.container}>
        <View style={styles.module}>
          <View style={styles.category}>
            <Text style={styles.headline}>GENERAL SETTINGS</Text>
            <SettingPicker
              name={'scale'}
              default={temperature.scale}
              onChange={this._handleChange('temperature')} />
          </View>
          <View style={styles.category}>
            <Text style={styles.headline}>CLOTHES</Text>
            <SettingSlider
              name={'warm'}
              description={'When do you wear a T-Shirt?'}
              scale={temperature.scale}
              default={temperature.warm}
              onChange={this._handleChange('temperature')} />
            <SettingSlider
              name={'cold'}
              description={'When do you wear a scarf?'}
              scale={temperature.scale}
              default={temperature.cold}
              onChange={this._handleChange('temperature')} />
          </View>
          <View style={styles.category}>
            <Text style={styles.headline}>NOTIFICATIONS</Text>
            <NotificationSwitch
              default={notifications}
              onChange={this._handleNotificationToggle} />
            <SettingTimePicker
              default={delivery}
              onChange={this._handleTimeChange} />
          </View>
          <Button
            title={'OK'}
            color={'green'}
            accessibilityLabel={'Save your settings'}
            onPress={this._handlePress} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  module: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: dimensions.mediumWidth,
    marginVertical: 35,
    borderRadius: 25,
    backgroundColor: colors.BACKGROUND
  },
  headline: {
    ...style.headline,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  category: {
    alignSelf: 'stretch',
    paddingHorizontal: dimensions.mediumWidth,
    marginBottom: 5
  }
})
