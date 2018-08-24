import { Constants } from 'expo'

const defaults = {
  API_URL: 'http://0.0.0.0:3000',
  OPEN_WEATHER_API_KEY: 'xxx',
  UNSPLASH_API_ACCESS_KEY: 'xxx',
  UNSPLASH_API_SECRET_KEY: 'xxx'
}

const ENV = {
  dev: {
    ...defaults
  },
  staging: {
    ...defaults
  },
  prod: {
    ...defaults
  }
}

function getEnvVars (env = '') {
  if (env === null || env === undefined || env === '') return ENV.dev
  if (env.indexOf('dev') !== -1) return ENV.dev
  if (env.indexOf('staging') !== -1) return ENV.staging
  if (env.indexOf('prod') !== -1) return ENV.prod
}

export default getEnvVars(Constants.manifest.releaseChannel)
