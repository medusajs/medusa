"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reporter = void 0;
const stack_trace_1 = __importDefault(require("stack-trace"));
const ulid_1 = require("ulid");
const winston_1 = __importDefault(require("winston"));
const ora_1 = __importDefault(require("ora"));
const medusa_telemetry_1 = require("medusa-telemetry");
const panic_handler_1 = require("./panic-handler");
const LOG_LEVEL = process.env.LOG_LEVEL || "silly";
const LOG_FILE = process.env.LOG_FILE || "";
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_DEV = NODE_ENV.startsWith("dev");
let transports = [];
if (!IS_DEV) {
    transports.push(new winston_1.default.transports.Console());
}
else {
    transports.push(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.cli(), winston_1.default.format.splat()),
    }));
}
if (LOG_FILE) {
    transports.push(new winston_1.default.transports.File({
        filename: LOG_FILE
    }));
}
const loggerInstance = winston_1.default.createLogger({
    level: LOG_LEVEL,
    levels: winston_1.default.config.npm.levels,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json()),
    transports,
});
class Reporter {
    constructor({ logger, activityLogger }) {
        this.panic = (data) => {
            const parsedPanic = (0, panic_handler_1.panicHandler)(data);
            this.loggerInstance_.log({
                level: "error",
                details: data,
                message: parsedPanic.message,
            });
            (0, medusa_telemetry_1.track)("PANIC_ERROR_REACHED", {
                id: data.id,
            });
            process.exit(1);
        };
        /**
         * Determines if the logger should log at a given level.
         * @param {string} level - the level to check if logger is configured for
         * @return {boolean} whether we should log
         */
        this.shouldLog = (level) => {
            level = this.loggerInstance_.levels[level];
            const logLevel = this.loggerInstance_.levels[this.loggerInstance_.level];
            return level <= logLevel;
        };
        /**
         * Sets the log level of the logger.
         * @param {string} level - the level to set the logger to
         */
        this.setLogLevel = (level) => {
            this.loggerInstance_.level = level;
        };
        /**
         * Resets the logger to the value specified by the LOG_LEVEL env var. If no
         * LOG_LEVEL is set it defaults to "silly".
         */
        this.unsetLogLevel = () => {
            this.loggerInstance_.level = LOG_LEVEL;
        };
        /**
         * Begin an activity. In development an activity is displayed as a spinner;
         * in other environments it will log the activity at the info level.
         * @param {string} message - the message to log the activity under
         * @param {any} config
         * @returns {string} the id of the activity; this should be passed to do
         *   further operations on the activity such as success, failure, progress.
         */
        this.activity = (message, config = {}) => {
            const id = (0, ulid_1.ulid)();
            if (IS_DEV && this.shouldLog("info")) {
                const activity = this.ora_(message).start();
                this.activities_[id] = {
                    activity,
                    config,
                    start: Date.now(),
                };
                return id;
            }
            else {
                this.activities_[id] = {
                    start: Date.now(),
                    config,
                };
                this.loggerInstance_.log({
                    activity_id: id,
                    level: "info",
                    config,
                    message,
                });
                return id;
            }
        };
        /**
         * Reports progress on an activity. In development this will update the
         * activity log message, in other environments a log message will be issued
         * at the info level. Logging will include the activityId.
         * @param {string} activityId - the id of the activity as returned by activity
         * @param {string} message - the message to log
         */
        this.progress = (activityId, message) => {
            const toLog = {
                level: "info",
                message,
            };
            if (typeof activityId === "string" && this.activities_[activityId]) {
                const activity = this.activities_[activityId];
                if (activity.activity) {
                    activity.text = message;
                }
                else {
                    toLog["activity_id"] = activityId;
                    this.loggerInstance_.log(toLog);
                }
            }
            else {
                this.loggerInstance_.log(toLog);
            }
        };
        /**
         * Logs an error. If an error object is provided the stack trace for the error
         * will also be logged.
         * @param {String | Error} messageOrError - can either be a string with a
         *   message to log the error under; or an error object.
         * @param {Error?} error - an error object to log message with
         */
        this.error = (messageOrError, error = null) => {
            let message = messageOrError;
            if (typeof messageOrError === "object") {
                message = messageOrError.message;
                error = messageOrError;
            }
            const toLog = {
                level: "error",
                message,
            };
            if (error) {
                toLog["stack"] = stack_trace_1.default.parse(error);
            }
            this.loggerInstance_.log(toLog);
            // Give stack traces and details in dev
            if (error && IS_DEV) {
                console.log(error);
            }
        };
        /**
         * Reports failure of an activity. In development the activity will be udpated
         * with the failure message in other environments the failure will be logged
         * at the error level.
         * @param {string} activityId - the id of the activity as returned by activity
         * @param {string} message - the message to log
         * @returns {object} data about the activity
         */
        this.failure = (activityId, message) => {
            const time = Date.now();
            const toLog = {
                level: "error",
                message,
            };
            if (typeof activityId === "string" && this.activities_[activityId]) {
                const activity = this.activities_[activityId];
                if (activity.activity) {
                    activity.activity.fail(`${message} – ${time - activity.start}`);
                }
                else {
                    toLog["duration"] = time - activity.start;
                    toLog["activity_id"] = activityId;
                    this.loggerInstance_.log(toLog);
                }
            }
            else {
                this.loggerInstance_.log(toLog);
            }
            if (this.activities_[activityId]) {
                const activity = this.activities_[activityId];
                return {
                    ...activity,
                    duration: time - activity.start,
                };
            }
            return null;
        };
        /**
         * Reports success of an activity. In development the activity will be udpated
         * with the failure message in other environments the failure will be logged
         * at the info level.
         * @param {string} activityId - the id of the activity as returned by activity
         * @param {string} message - the message to log
         * @returns {Record<string, any>} data about the activity
         */
        this.success = (activityId, message) => {
            const time = Date.now();
            const toLog = {
                level: "info",
                message,
            };
            if (typeof activityId === "string" && this.activities_[activityId]) {
                const activity = this.activities_[activityId];
                if (activity.activity) {
                    activity.activity.succeed(`${message} – ${time - activity.start}ms`);
                }
                else {
                    toLog["duration"] = time - activity.start;
                    toLog["activity_id"] = activityId;
                    this.loggerInstance_.log(toLog);
                }
            }
            else {
                this.loggerInstance_.log(toLog);
            }
            if (this.activities_[activityId]) {
                const activity = this.activities_[activityId];
                return {
                    ...activity,
                    duration: time - activity.start,
                };
            }
            return null;
        };
        /**
         * Logs a message at the info level.
         * @param {string} message - the message to log
         */
        this.debug = (message) => {
            this.loggerInstance_.log({
                level: "debug",
                message,
            });
        };
        /**
         * Logs a message at the info level.
         * @param {string} message - the message to log
         */
        this.info = (message) => {
            this.loggerInstance_.log({
                level: "info",
                message,
            });
        };
        /**
         * Logs a message at the warn level.
         * @param {string} message - the message to log
         */
        this.warn = (message) => {
            this.loggerInstance_.warn({
                level: "warn",
                message,
            });
        };
        /**
         * A wrapper around winston's log method.
         */
        this.log = (...args) => {
            if (args.length > 1) {
                // @ts-ignore
                this.loggerInstance_.log(...args);
            }
            else {
                let message = args[0];
                this.loggerInstance_.log({
                    level: "info",
                    message,
                });
            }
        };
        this.activities_ = {};
        this.loggerInstance_ = logger;
        this.ora_ = activityLogger;
    }
}
exports.Reporter = Reporter;
const logger = new Reporter({
    logger: loggerInstance,
    activityLogger: ora_1.default,
});
exports.default = logger;
//# sourceMappingURL=index.js.map