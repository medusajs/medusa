import { track } from "medusa-telemetry"
import ora from "ora"
import stackTrace from "stack-trace"
import { ulid } from "ulid"
import winston from "winston"

import * as Transport from "winston-transport"
import { panicHandler } from "./panic-handler"

const LOG_LEVEL = process.env.LOG_LEVEL || "info"
const LOG_FILE = process.env.LOG_FILE || ""
const NODE_ENV = process.env.NODE_ENV || "development"
const IS_DEV = NODE_ENV.startsWith("dev")

let transports: Transport[] = []

if (!IS_DEV) {
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

if (LOG_FILE) {
  transports.push(
    new winston.transports.File({
      filename: LOG_FILE,
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

export class Reporter {
  protected activities_: Record<string, any>
  protected loggerInstance_: winston.Logger
  protected ora_: typeof ora

  constructor({ logger, activityLogger }) {
    this.activities_ = {}
    this.loggerInstance_ = logger
    this.ora_ = activityLogger
  }

  panic(data) {
    const parsedPanic = panicHandler(data)

    this.loggerInstance_.log({
      level: "error",
      details: data,
      message: parsedPanic.message,
    })

    track("PANIC_ERROR_REACHED", {
      id: data.id,
    })

    process.exit(1)
  }

  /**
   * Determines if the logger should log at a given level.
   * @param {string} level - the level to check if logger is configured for
   * @return {boolean} whether we should log
   */
  shouldLog = (level: string) => {
    const levelValue = this.loggerInstance_.levels[level]
    const logLevel = this.loggerInstance_.levels[this.loggerInstance_.level]
    return levelValue <= logLevel
  }

  /**
   * Sets the log level of the logger.
   * @param {string} level - the level to set the logger to
   */
  setLogLevel(level: string) {
    this.loggerInstance_.level = level
  }

  /**
   * Resets the logger to the value specified by the LOG_LEVEL env var. If no
   * LOG_LEVEL is set it defaults to "silly".
   */
  unsetLogLevel() {
    this.loggerInstance_.level = LOG_LEVEL
  }

  /**
   * Begin an activity. In development an activity is displayed as a spinner;
   * in other environments it will log the activity at the info level.
   * @param {string} message - the message to log the activity under
   * @param {any} config
   * @returns {string} the id of the activity; this should be passed to do
   *   further operations on the activity such as success, failure, progress.
   */
  activity(message: string, config: any = {}) {
    const id = ulid()
    if (IS_DEV && this.shouldLog("info")) {
      const activity = this.ora_(message).start()

      this.activities_[id] = {
        activity,
        config,
        start: Date.now(),
      }

      return id
    } else {
      this.activities_[id] = {
        start: Date.now(),
        config,
      }
      this.loggerInstance_.log({
        activity_id: id,
        level: "info",
        config,
        message,
      })

      return id
    }
  }

  /**
   * Reports progress on an activity. In development this will update the
   * activity log message, in other environments a log message will be issued
   * at the info level. Logging will include the activityId.
   * @param {string} activityId - the id of the activity as returned by activity
   * @param {string} message - the message to log
   */
  progress(activityId: string, message: string) {
    const toLog = {
      level: "info",
      message,
    }

    if (this.activities_[activityId]) {
      const activity = this.activities_[activityId]
      if (activity.activity) {
        activity.text = message
      } else {
        toLog["activity_id"] = activityId
        this.loggerInstance_.log(toLog)
      }
    } else {
      this.loggerInstance_.log(toLog)
    }
  }

  /**
   * Logs an error. If an error object is provided the stack trace for the error
   * will also be logged.
   * @param {String | Error} messageOrError - can either be a string with a
   *   message to log the error under; or an error object.
   * @param {Error?} error - an error object to log message with
   */
  error(messageOrError: string | Error, error?: Error) {
    let message = messageOrError as string

    if (typeof messageOrError === "object") {
      message = messageOrError.message
      error = messageOrError
    }

    const toLog = {
      level: "error",
      message,
    }

    if (error) {
      toLog["stack"] = stackTrace.parse(error)
    }

    this.loggerInstance_.log(toLog)

    // Give stack traces and details in dev
    if (error && IS_DEV) {
      console.log(error)
    }
  }

  /**
   * Reports failure of an activity. In development the activity will be udpated
   * with the failure message in other environments the failure will be logged
   * at the error level.
   * @param {string} activityId - the id of the activity as returned by activity
   * @param {string} message - the message to log
   * @returns {object} data about the activity
   */
  failure(activityId: string, message: string) {
    const time = Date.now()
    const toLog = {
      level: "error",
      message,
    }

    if (this.activities_[activityId]) {
      const activity = this.activities_[activityId]
      if (activity.activity) {
        activity.activity.fail(`${message} – ${time - activity.start}`)
      } else {
        toLog["duration"] = time - activity.start
        toLog["activity_id"] = activityId
        this.loggerInstance_.log(toLog)
      }
    } else {
      this.loggerInstance_.log(toLog)
    }

    if (this.activities_[activityId]) {
      const activity = this.activities_[activityId]
      return {
        ...activity,
        duration: time - activity.start,
      }
    }

    return null
  }

  /**
   * Reports success of an activity. In development the activity will be udpated
   * with the failure message in other environments the failure will be logged
   * at the info level.
   * @param {string} activityId - the id of the activity as returned by activity
   * @param {string} message - the message to log
   * @returns {Record<string, any>} data about the activity
   */
  success(activityId: string, message: string) {
    const time = Date.now()
    const toLog = {
      level: "info",
      message,
    }

    if (this.activities_[activityId]) {
      const activity = this.activities_[activityId]
      if (activity.activity) {
        activity.activity.succeed(`${message} – ${time - activity.start}ms`)
      } else {
        toLog["duration"] = time - activity.start
        toLog["activity_id"] = activityId
        this.loggerInstance_.log(toLog)
      }
    } else {
      this.loggerInstance_.log(toLog)
    }

    if (this.activities_[activityId]) {
      const activity = this.activities_[activityId]
      return {
        ...activity,
        duration: time - activity.start,
      }
    }

    return null
  }

  /**
   * Logs a message at the info level.
   * @param {string} message - the message to log
   */
  debug(message: string) {
    this.loggerInstance_.log({
      level: "debug",
      message,
    })
  }

  /**
   * Logs a message at the info level.
   * @param {string} message - the message to log
   */
  info(message: string) {
    this.loggerInstance_.log({
      level: "info",
      message,
    })
  }

  /**
   * Logs a message at the warn level.
   * @param {string} message - the message to log
   */
  warn = (message: string) => {
    this.loggerInstance_.warn({
      level: "warn",
      message,
    })
  }

  /**
   * A wrapper around winston's log method.
   */
  log(...args) {
    if (args.length > 1) {
      // @ts-ignore
      this.loggerInstance_.log(...args)
    } else {
      let message = args[0]
      this.loggerInstance_.log({
        level: "info",
        message,
      })
    }
  }
}

const logger = new Reporter({
  logger: loggerInstance,
  activityLogger: ora,
})

export default logger
