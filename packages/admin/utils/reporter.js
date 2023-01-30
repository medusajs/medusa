"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.reporter = void 0;
var ora_1 = __importDefault(require("ora"));
var picocolors_1 = __importDefault(require("picocolors"));
var PREFIX = picocolors_1["default"].cyan("[@medusajs/admin]");
exports.reporter = {
    spinner: function (promise, _a) {
        var message = _a.message, errorMessage = _a.errorMessage, successMessage = _a.successMessage;
        var spinner = (0, ora_1["default"])("".concat(PREFIX, " ").concat(picocolors_1["default"].green(message))).start();
        return promise.then(function (result) {
            spinner.succeed(successMessage
                ? "".concat(PREFIX, " ").concat(picocolors_1["default"].green(successMessage))
                : undefined);
            return result;
        }, function (error) {
            spinner.fail(errorMessage ? "".concat(PREFIX, " ").concat(picocolors_1["default"].red(errorMessage)) : undefined);
            throw error;
        });
    },
    error: function (message) {
        console.error("".concat(PREFIX, " ").concat(picocolors_1["default"].red(message)));
    },
    info: function (message) {
        console.log("".concat(PREFIX, " ").concat(picocolors_1["default"].blue(message)));
    },
    warn: function (message) {
        console.warn("".concat(PREFIX, " ").concat(picocolors_1["default"].yellow(message)));
    }
};
