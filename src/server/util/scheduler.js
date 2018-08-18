const schedule = require('node-schedule')

const daily = [new schedule.Range(0, 6)]

const scheduleJob = fn => (name, { dayOfWeek, hour, minute }) =>
  schedule.scheduleJob(name, {hour, minute, dayOfWeek}, fn)

/**
 * Schedules a daily running job
 *
 * @param {function} fn - The function to be run daily
 * @param {string} name - The name of the job, ideally the Push Token
 * @param {object} rule - The rule object containing hour and minute
 */
const scheduleDailyJob = fn => (name, rule) =>
  schedule.scheduleJob(name, {dayOfWeek: daily, ...rule}, fn)

const cancelJob = name => {
  if (schedule.scheduledJobs[name]) {
    schedule.scheduledJobs[name].cancel()
  } else {
    throw new Error('no such job')
  }
}

const reScheduleDailyJob = (name, rule) => {
  if (schedule.scheduledJobs[name]) {
    schedule.scheduledJobs[name].reschedule({
      dayOfWeek: daily,
      ...rule
    })
  } else {
    throw new Error('no such job')
  }
}

module.exports = {
  scheduleJob,
  scheduleDailyJob,
  reScheduleDailyJob,
  cancelJob
}
