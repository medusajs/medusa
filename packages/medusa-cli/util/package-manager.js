"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPackageManager = exports.getPackageManager = void 0;

var _configstore = _interopRequireDefault(require("configstore"));

var _reporter = _interopRequireDefault(require("../reporter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var config;
var packageMangerConfigKey = "cli.packageManager";

var getPackageManager = function getPackageManager() {
  if (!config) {
    config = new _configstore["default"]("medusa", {}, {
      globalConfigPath: true
    });
  }

  return config.get(packageMangerConfigKey);
};

exports.getPackageManager = getPackageManager;

var setPackageManager = function setPackageManager(packageManager) {
  if (!config) {
    config = new _configstore["default"]("medusa", {}, {
      globalConfigPath: true
    });
  }

  config.set(packageMangerConfigKey, packageManager);

  _reporter["default"].info("Preferred package manager set to \"".concat(packageManager, "\""));
};

exports.setPackageManager = setPackageManager;