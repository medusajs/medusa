"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.spinner = void 0;
var ora_1 = __importDefault(require("ora"));
var spinner = function (promise, _a) {
    var message = _a.message, errorMessage = _a.errorMessage, successMessage = _a.successMessage;
    var spinner = (0, ora_1["default"])(message).start();
    return promise.then(function (result) {
        spinner.succeed(successMessage);
        return result;
    }, function (error) {
        spinner.fail(errorMessage);
        throw error;
    });
};
exports.spinner = spinner;
