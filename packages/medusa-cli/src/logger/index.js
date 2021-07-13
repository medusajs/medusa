import { ulid } from "ulid"
import winston from "winston"
import ora from "ora"

const LOG_LEVEL = process.env.LOG_LEVEL || "silly"

const transports = []
if (process.env.NODE_ENV !== "development") {
  transports.push(new winston.transports.Console())
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat()
      ),
    })
  )
}

const loggerInstance = winston.createLogger({
  level: LOG_LEVEL,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
})

class Logger {
  activities = []

  shouldLog = level => {
    level = loggerInstance.levels[level]
    const logLevel = loggerInstance.levels[loggerInstance.level]
    return level <= logLevel
  }

  setLogLevel = level => {
    loggerInstance.level = level
  }

  unsetLogLevel = () => {
    loggerInstance.level = LOG_LEVEL
  }

  activity = message => {
    const id = ulid()
    if (process.env.NODE_ENV === "development" && this.shouldLog("info")) {
      const activity = ora(message).start()

      this.activities[id] = {
        activity,
        start: Date.now(),
      }

      return id
    } else {
      this.activities[id] = {
        start: Date.now(),
      }
      loggerInstance.log({
        activity_id: id,
        level: "info",
        message,
      })

      return id
    }
  }

  progress = (activityId, message) => {
    if (typeof activityId === "string" && this.activities[activityId]) {
      const activity = this.activities[activityId]
      if (activity.activity) {
        activity.text = message
      } else {
        loggerInstance.log({
          activity_id: activityId,
          level: "info",
          message,
        })
      }
    } else {
      loggerInstance.log({
        level: "info",
        message,
      })
    }
  }

  error = (messageOrError, error) => {
    let message = messageOrError
    if (typeof messageOrError === "object") {
      message = messageOrError.message
      error = messageOrError
    }

    loggerInstance.log({
      level: "error",
      message,
    })
    if (error) {
      loggerInstance.error(error.stack)
    }
  }

  failure = (activityId, message) => {
    if (typeof activityId === "string" && this.activities[activityId]) {
      const time = Date.now()
      const activity = this.activities[activityId]
      if (activity.activity) {
        activity.activity.fail(`${message} – ${time - activity.start}`)
      } else {
        loggerInstance.log({
          duration: time - activity.start,
          activity_id: activityId,
          level: "error",
          message,
        })
      }
    } else {
      loggerInstance.log({
        level: "error",
        message,
      })
    }
  }

  success = (activityId, message) => {
    if (typeof activityId === "string" && this.activities[activityId]) {
      const time = Date.now()
      const activity = this.activities[activityId]
      if (activity.activity) {
        activity.activity.succeed(`${message} – ${time - activity.start}ms`)
      } else {
        loggerInstance.log({
          duration: time - activity.start,
          activity_id: activityId,
          level: "info",
          message,
        })
      }
    } else {
      loggerInstance.log({
        level: "info",
        message,
      })
    }
  }

  info = message => {
    loggerInstance.log({
      level: "info",
      message,
    })
  }

  warn = message => {
    loggerInstance.warn({
      level: "warn",
      message,
    })
  }

  log = (...args) => {
    loggerInstance.log(...args)
  }
}

export const logger = new Logger()
export default logger
