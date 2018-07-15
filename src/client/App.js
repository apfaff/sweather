import React from 'react'
import { StyleSheet } from 'react-native'
import Swiper from 'react-native-swiper'

import Home from './screens/home/Home'
import Settings from './screens/settings/Settings'
import checkIfInitialLaunch from './util/initialLaunch'

export default class App extends React.Component {
  state = {
    isInitialLaunch: null,
    fetching: true
  }

  async componentWillMount () {
    const isInitialLaunch = await checkIfInitialLaunch()
    this.setState({ isInitialLaunch, fetching: false })
  }

  _handleSlideChange = index => {
    this._swiper.scrollBy(index)
  }

  assignSwiper = ref => {
    this._swiper = ref
  };

  render () {
    const { isInitialLaunch, fetching } = this.state

    if (fetching) return null
    return (
      <Swiper
        ref={this.assignSwiper}
        index={1}
        showsButtons={false}
        showsPagination={false}
        loop={false}
        style={styles.navigator}>
        <Home />
        <Settings
          changeSlide={this._handleSlideChange} />
      </Swiper>
    )
  }
}

const styles = StyleSheet.create({
  navigator: {}
})
