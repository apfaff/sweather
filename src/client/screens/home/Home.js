import React from 'react'
import { StyleSheet, Text, SafeAreaView } from 'react-native'

export default class Home extends React.Component {
  render () {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Home Screen</Text>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'skyblue'
  },
  text: {
    color: 'white'
  }
})
