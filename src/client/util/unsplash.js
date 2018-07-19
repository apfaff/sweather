import Unsplash, { toJson } from 'unsplash-js/native'

import { getBackgroundImage, setBackgroundImage } from './storage'
import { lessThanOneHourAgo } from './time'
import env from '../env'

const unsplash = new Unsplash({
  applicationId: env.UNSPLASH_API_ACCESS_KEY,
  secret: env.UNSPLASH_API_SECRET_KEY
})

// TODO: extract relevant data: urls.regular, user.name

export const searchPhotos = (page, perPage) => async string => {
  const result = await unsplash.search.photos(string, page, perPage)
  return toJson(result)
}

export const getRandomPhoto = async query => {
  const result = await unsplash.photos.getRandomPhoto({
    featured: true,
    orientation: 'portrait',
    query
  })
  return toJson(result)
}

export const getStoredOrRandomPhoto = async query => {
  const storedPhoto = await getBackgroundImage()
  const isOldEnough = lessThanOneHourAgo(storedPhoto.queried_at)
  if (storedPhoto && !isOldEnough) return storedPhoto

  const randomPhoto = await getRandomPhoto(query)
  await setBackgroundImage({
    ...randomPhoto,
    queried_at: new Date()
  })
  return randomPhoto
}
