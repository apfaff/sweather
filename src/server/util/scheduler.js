const schedule = require('node-schedule')

const daily = [new schedule.Range(0, 6)]

const scheduleJob = fn => ({ dayOfWeek, hour, minute }, name) =>
  schedule.scheduleJob(name, {hour, minute, dayOfWeek}, fn)

const scheduleDailyJob = fn => (name, rule) =>
  schedule.scheduleJob(name, {dayOfWeek: daily, ...rule}, fn)

const cancelJob = name => schedule.scheduledJobs[name].cancel()

module.exports = {
  scheduleJob,
  scheduleDailyJob,
  cancelJob
}
