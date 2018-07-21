import React from 'react'
import { AsyncStorage, Button, StyleSheet, ScrollView, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'

import style from '../../styles/styles'
import colors from '../../styles/colors'
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
        <View style={styles.module}>
          <ScrollView
            style={styles.scrollview}>
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
                onChange={_.debounce(this._handleTimeChange, 4000)} />
            </View>
            <Button
              title={'OK'}
              color={'green'}
              accessibilityLabel={'Save your settings'}
              onPress={this._handlePress} />
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
  module: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginVertical: 35,
    borderRadius: 25,
    backgroundColor: colors.BACKGROUND
  },
  headline: {
    ...style.headline,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  scrollview: {
    alignSelf: 'center',
    paddingTop: 20
  }
})
