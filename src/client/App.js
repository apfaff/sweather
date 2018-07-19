import React from 'react'
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native'
import Swiper from 'react-native-swiper'

import Home from './screens/home/Home'
import Settings from './screens/settings/Settings'

import { isInitialLaunch } from './util/storage'
import { getLocationAsync } from './util/location'
import { getStoredOrRandomPhoto } from './util/unsplash'
import { requestCurrentWeatherDataByLatLon } from './util/weather'

export default class App extends React.Component {
  state = {
    photo: null,
    weather: null,
    fetching: true,
    initialLaunch: null
  }

  async componentWillMount () {
    const initialLaunch = await isInitialLaunch()
    const location = await getLocationAsync()
    if (!location) {
      const randomPhoto = await getStoredOrRandomPhoto('weather')

      this.setState({
        initialLaunch,
        error: 'No location, no weather',
        photo: randomPhoto,
        fetching: false
      })
    } else {
      const weather = await requestCurrentWeatherDataByLatLon(location.lat, location.lng)
      const photo = await getStoredOrRandomPhoto(weather.weather[0].main)

      this.setState({ initialLaunch, weather, photo, fetching: false })
    }
  }

  _handleSlideChange = index => {
    this._swiper.scrollBy(index)
  }

  assignSwiper = ref => {
    this._swiper = ref
  };

  render () {
    const { photo, weather, initialLaunch, error, fetching } = this.state

    if (fetching) return null
    console.log('should have rendered UI')
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <ImageBackground
          // TODO: hotlink image and author to satisfy unsplash criteria
          style={styles.image}
          source={{ uri: photo.urls.regular }}>
          <Swiper
            ref={this.assignSwiper}
            index={initialLaunch ? 1 : 0}
            showsButtons={false}
            showsPagination={false}
            loop={false}
            style={styles.navigator}>
            <Home
              error={error}
              weather={weather} />
            <Settings
              changeSlide={this._handleSlideChange} />
          </Swiper>
        </ImageBackground>
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
  image: {
    flex: 1,
    alignSelf: 'stretch'
  },
  navigator: {}
})
