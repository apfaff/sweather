import { Dimensions } from 'react-native'

const { width } = Dimensions.get('window')
const scalingFactors = {
  small: 40,
  normal: 30,
  big: 20
}

const fontSizes = {
  H1: {
    fontSize: width / scalingFactors.big,
    lineHeight: (width / scalingFactors.big) * 1.3
  },
  P: {
    fontSize: width / scalingFactors.normal,
    lineHeight: (width / scalingFactors.normal) * 1.3
  },
  SMALL: {
    fontSize: width / scalingFactors.small
  }
}

export default fontSizes
