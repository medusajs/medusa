"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Reporter = void 0;

var _stackTrace = _interopRequireDefault(require("stack-trace"));

var _ulid = require("ulid");

var _winston = _interopRequireDefault(require("winston"));

var _ora = _interopRequireDefault(require("ora"));

var _medusaTelemetry = require("medusa-telemetry");

var _panicHandler = require("./panic-handler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LOG_LEVEL = process.env.LOG_LEVEL || "silly";
var NODE_ENV = process.env.NODE_ENV || "development";
var IS_DEV = NODE_ENV === "development";
var transports = [];

if (!IS_DEV) {
  transports.push(new _winston["default"].transports.Console());
} else {
  transports.push(new _winston["default"].transports.Console({
    format: _winston["default"].format.combine(_winston["default"].format.cli(), _winston["default"].format.splat())
  }));
}

var loggerInstance = _winston["default"].createLogger({
  level: LOG_LEVEL,
  levels: _winston["default"].config.npm.levels,
  format: _winston["default"].format.combine(_winston["default"].format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }), _winston["default"].format.errors({
    stack: true
  }), _winston["default"].format.splat(), _winston["default"].format.json()),
  transports: transports
});

var Reporter = /*#__PURE__*/_createClass(function Reporter(_ref) {
  var _this = this;

  var logger = _ref.logger,
      activityLogger = _ref.activityLogger;

  _classCallCheck(this, Reporter);

  _defineProperty(this, "panic", function (data) {
    var parsedPanic = (0, _panicHandler.panicHandler)(data);

    _this.loggerInstance_.log({
      level: "error",
      details: data,
      message: parsedPanic.message
    });

    (0, _medusaTelemetry.track)("PANIC_ERROR_REACHED", {
      id: data.id
    });
    process.exit(1);
  });

  _defineProperty(this, "shouldLog", function (level) {
    level = _this.loggerInstance_.levels[level];
    var logLevel = _this.loggerInstance_.levels[_this.loggerInstance_.level];
    return level <= logLevel;
  });

  _defineProperty(this, "setLogLevel", function (level) {
    _this.loggerInstance_.level = level;
  });

  _defineProperty(this, "unsetLogLevel", function () {
    _this.loggerInstance_.level = LOG_LEVEL;
  });

  _defineProperty(this, "activity", function (message) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var id = (0, _ulid.ulid)();

    if (IS_DEV && _this.shouldLog("info")) {
      var activity = _this.ora_(message).start();

      _this.activities_[id] = {
        activity: activity,
        config: config,
        start: Date.now()
      };
      return id;
    } else {
      _this.activities_[id] = {
        start: Date.now(),
        config: config
      };

      _this.loggerInstance_.log({
        activity_id: id,
        level: "info",
        config: config,
        message: message
      });

      return id;
    }
  });

  _defineProperty(this, "progress", function (activityId, message) {
    var toLog = {
      level: "info",
      message: message
    };

    if (typeof activityId === "string" && _this.activities_[activityId]) {
      var activity = _this.activities_[activityId];

      if (activity.activity) {
        activity.text = message;
      } else {
        toLog.activity_id = activityId;

        _this.loggerInstance_.log(toLog);
      }
    } else {
      _this.loggerInstance_.log(toLog);
    }
  });

  _defineProperty(this, "error", function (messageOrError, error) {
    var message = messageOrError;

    if (_typeof(messageOrError) === "object") {
      message = messageOrError.message;
      error = messageOrError;
    }

    var toLog = {
      level: "error",
      message: message
    };

    if (error) {
      toLog.stack = _stackTrace["default"].parse(error);
    }

    _this.loggerInstance_.log(toLog); // Give stack traces and details in dev


    if (error && IS_DEV) {
      console.log(error);
    }
  });

  _defineProperty(this, "failure", function (activityId, message) {
    var time = Date.now();
    var toLog = {
      level: "error",
      message: message
    };

    if (typeof activityId === "string" && _this.activities_[activityId]) {
      var activity = _this.activities_[activityId];

      if (activity.activity) {
        activity.activity.fail("".concat(message, " \u2013 ").concat(time - activity.start));
      } else {
        toLog.duration = time - activity.start;
        toLog.activity_id = activityId;

        _this.loggerInstance_.log(toLog);
      }
    } else {
      _this.loggerInstance_.log(toLog);
    }

    if (_this.activities_[activityId]) {
      var _activity = _this.activities_[activityId];
      return _objectSpread(_objectSpread({}, _activity), {}, {
        duration: time - _activity.start
      });
    }

    return null;
  });

  _defineProperty(this, "success", function (activityId, message) {
    var time = Date.now();
    var toLog = {
      level: "info",
      message: message
    };

    if (typeof activityId === "string" && _this.activities_[activityId]) {
      var activity = _this.activities_[activityId];

      if (activity.activity) {
        activity.activity.succeed("".concat(message, " \u2013 ").concat(time - activity.start, "ms"));
      } else {
        toLog.duration = time - activity.start;
        toLog.activity_id = activityId;

        _this.loggerInstance_.log(toLog);
      }
    } else {
      _this.loggerInstance_.log(toLog);
    }

    if (_this.activities_[activityId]) {
      var _activity2 = _this.activities_[activityId];
      return _objectSpread(_objectSpread({}, _activity2), {}, {
        duration: time - _activity2.start
      });
    }

    return null;
  });

  _defineProperty(this, "debug", function (message) {
    _this.loggerInstance_.log({
      level: "debug",
      message: message
    });
  });

  _defineProperty(this, "info", function (message) {
    _this.loggerInstance_.log({
      level: "info",
      message: message
    });
  });

  _defineProperty(this, "warn", function (message) {
    _this.loggerInstance_.warn({
      level: "warn",
      message: message
    });
  });

  _defineProperty(this, "log", function () {
    var _this$loggerInstance_;

    (_this$loggerInstance_ = _this.loggerInstance_).log.apply(_this$loggerInstance_, arguments);
  });

  this.activities_ = [];
  this.loggerInstance_ = logger;
  this.ora_ = activityLogger;
});

exports.Reporter = Reporter;
var logger = new Reporter({
  logger: loggerInstance,
  activityLogger: _ora["default"]
});
var _default = logger;
exports["default"] = _default;