import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')
const scalingFactors = {
  small: 30,
  normal: 20,
  big: 10
}

const dimensions = {
  smallWidth: width / scalingFactors.small,
  mediumWidth: width / scalingFactors.normal,
  largeWidth: width / scalingFactors.big,
  smallHeight: height / scalingFactors.small,
  mediumHeight: height / scalingFactors.normal,
  largeHeight: height / scalingFactors.big
}

export default dimensions
