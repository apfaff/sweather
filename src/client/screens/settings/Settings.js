import React from 'react'
import { AsyncStorage, Button, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native'
import PropTypes from 'prop-types'

import SettingSlider from '../../components/SettingSlider'
import SettingPicker from '../../components/SettingPicker'
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
      cold: 5,
      warm: 21
    },
    location: {
      lat: null,
      lng: null,
      name: null
    }
  }

  async componentWillMount () {
    // TODO: get initial state from AsyncStorage
  }

  _handleChange = field => async (name, value) => {
    try {
      await AsyncStorage.setItem(`${field}.${name}`, JSON.stringify(value))
    } catch (err) {
      console.error(err)
    }

    this.setState({
      ...this.state,
      [field]: { ...this.state[field], [name]: value }
    })
  }

  _handleNotificationToggle = value => {
    this.setState({ notifications: value })
    // TODO: handleNotificationToggle => post to API /register
  }

  _handleTimeChange = () => {
    // TODO: handleTimeChange => put to API /register/:token
  }

  _handlePress = () => {
    // TODO: query weather and unsplashed
    this.props.changeSlide(-1)
  }

  render () {
    const { notifications, delivery, location, temperature } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Settings Screen</Text>
        <ScrollView style={styles.scrollview}>
          <SettingPicker
            name={'scale'}
            default={temperature.scale}
            onChange={this._handleChange('temperature')} />
          <SettingSlider
            name={'warm'}
            description={'Ab welcher Temperatur trägst du ein T-Shirt?'}
            default={temperature.warm}
            onChange={this._handleChange('temperature')} />
          <SettingSlider
            name={'cold'}
            description={'Ab welcher Temperatur trägst du einen Schal?'}
            default={temperature.cold}
            onChange={this._handleChange('temperature')} />
          <NotificationSwitch
            default={notifications}
            onChange={this._handleNotificationToggle} />
          <Button
            title={'OK'}
            color={'green'}
            accessibilityLabel={'Save your settings'}
            onPress={this._handlePress} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'whitesmoke',
    paddingTop: 20
  },
  scrollview: {
    paddingTop: 20
  },
  text: {
    color: 'dimgrey'
  }
})
