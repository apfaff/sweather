import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'

import { kelvinToCelsius } from '../../util/weather'

export default class Home extends React.Component {
  static propTypes = {
    weather: PropTypes.object,
    error: PropTypes.string
  }

  render () {
    const { error, weather } = this.props

    return (
      <View style={styles.container}>
        { error && <Text style={styles.text}>{error}</Text> }
        { weather &&
          <Text style={styles.text}>
            {weather.weather[0].main} {kelvinToCelsius(weather.main.temp)}
          </Text>
        }
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
  text: {
    color: 'white'
  }
})
