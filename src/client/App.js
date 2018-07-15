import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

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

  render () {
    const { isInitialLaunch, fetching } = this.state

    if (fetching) return null
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
