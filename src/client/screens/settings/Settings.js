import React from 'react'
import PropTypes from 'prop-types'
import { AsyncStorage, Button, StyleSheet, Text, View } from 'react-native'
import _ from 'lodash'

import { Permissions, Notifications } from 'expo'
import env from '../../env'

import { getSettings, setNotifications, setDeliveryTime, getSynced, getRegistered, setSynced, setRegisterd } from '../../util/storage'
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
    registered: false,
    synced: false,

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
    const persistedRegistered = await getRegistered()
    const persistedSync = await getSynced()
    const persistentSettings = await getSettings()
    if (persistentSettings) {
      const settings = persistentSettings.reduce((acc, setting) => {
        const [ key, value ] = setting
        if (value !== null) acc[key] = JSON.parse(value)
        return acc
      }, {})

      this.setState({
        registered: persistedRegistered,
        synced: persistedSync,
        ...this.state,
        ...settings
      })
    }

    // schedule sync in case the last one was not successful
    this.sync()
  }

  async componentWillUnmount () {}

  markUnsynced = async () => {
    this.setState({ synced: false })
    try {
      await setSynced(false)
    } catch (err) {
      console.error(err)
    }

    // schedule sync
    this.sync()
  }

  syncJob = null
  // will try to sync with api at all costs
  sync = _.debounce(() => {
    //  sync is not necessary
    if (this.state.synced) return

    // sync is already in progress
    if (this.syncJob) return

    const job = async () => {
      // seems the last sync attempt was successfull already
      if (this.state.synced) return cleanUp()

      try {
      // we are registerd but notifications are no longer to be send
        if (this.state.registered && !this.state.notifications) {
          await this._handlePushDeRegistration()
          this.setState({ registered: false })
          await setRegisterd(false)
          await cleanUp()
        } else
        // is not registered? then register
        if (!this.state.registered && this.state.notifications) {
          await this._handlePushRegistration()
          this.setState({ registered: true })
          await setRegisterd(true)
          await cleanUp()
        } else
        //  we are registerd so update instead
        if (this.state.registered && this.state.notifications) {
          await this._handlePushRegistrationUpdate()
          await cleanUp()
        } else {
          console.info('nothing to do...')
          await cleanUp()
        }
      } catch (err) {
        console.info(err)
      }
    }

    const cleanUp = () => {
      console.info('sync was successfull. cleaning up.')

      // remove this job
      clearInterval(this.syncJob)
      this.syncJob = null

      // we are officially synced
      this.setState({ synced: true })
      return setSynced(true)
    }

    this.syncJob = setInterval(job, 30000)
    job()
  }, 3000)

  _handlePushRegistrationUpdate = async () => {
    let token = await Notifications.getExpoPushTokenAsync()
    return fetch(`${env.API_URL}/register/${token}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json', 'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...this.state,
        token: token
      })
    })
  }

  _handlePushRegistration = async (register) => {
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync()
    return fetch(`${env.API_URL}/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json', 'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...this.state,
        token: token
      })
    })
  }

  _handlePushDeRegistration = async (register) => {
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync()
    return fetch(`${env.API_URL}/deregister/${token}`, {
      method: 'DELETE'
    })
  }

  _handleNotificationToggle = async value => {
    if (value) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      )
      let finalStatus = existingStatus
      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
        finalStatus = status
      }
      //TODO: Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {}
    }

    this.setState({ notifications: value })
    try {
      await setNotifications(value)
    } catch (err) {
      console.error(err)
    }
    this.markUnsynced()
  }

  // NOTE: Call to API will be debounced, because iOS does not hide TimePicker like on Android
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
    this.markUnsynced()
  }

  _handlePress = async () => {
    this.props.changeSlide(-1)
    this.markUnsynced()
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

    this.markUnsynced()
  }

  // TODO: indicator if synced successfully or not.
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
              onChange={_.debounce(this._handleTimeChange, 3000)} />
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
