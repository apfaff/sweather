import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'

import colors from '../../styles/colors'
import dimensions from '../../styles/dimensions'
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
        <View style={styles.module}>
          { error && <Text style={styles.text}>{error}</Text> }
          { weather &&
            <Text style={styles.text}>
              {weather.weather[0].main} - {kelvinToCelsius(weather.main.temp)} °C
            </Text>
          }
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
    flex: 0.25,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: dimensions.mediumWidth,
    borderRadius: 25,
    backgroundColor: colors.BACKGROUND
  },
  text: {
    color: colors.PRIMARY
  }
})
