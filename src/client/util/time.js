const HOUR = 1000 * 60 * 60
const NOW = Date.now()

export const lessThanOneHourAgo = date => {
  const anHourAgo = NOW - HOUR
  return date < anHourAgo
}
