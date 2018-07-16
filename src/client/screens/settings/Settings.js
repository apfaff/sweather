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
      cold: 278.15,
      warm: 294.15
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
    // TODO: fetch POST to API /register
  }

  _handleTimeChange = () => {
    // TODO: handleTimeChange => put to API /register/:token
  }

  _handlePress = async () => {
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
    alignSelf: 'center',
    paddingTop: 20
  },
  text: {
    color: 'dimgrey'
  }
})
