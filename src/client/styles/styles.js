import colors from './colors'
import typography from './typography'

const styles = {
  headline: {
    ...typography.H1,
    color: colors.PRIMARY,
    textAlign: 'center'
  },
  text: {
    ...typography.P,
    color: colors.PRIMARY
  },
  background: {
    backgroundColor: colors.BACKGROUND
  }
}

export default styles
