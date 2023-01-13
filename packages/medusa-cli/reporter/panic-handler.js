"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.panicHandler = void 0;

var panicHandler = function panicHandler() {
  var panicData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var id = panicData.id,
      context = panicData.context;

  switch (id) {
    case "10000":
      return {
        message: "Looks like you provided a URL as your project name. Try \"medusa new my-medusa-store ".concat(context.rootPath, "\" instead.")
      };

    case "10001":
      return {
        message: "Looks like you provided a URL as your project name. Try \"medusa new my-medusa-store ".concat(context.rootPath, "\" instead.")
      };

    case "10002":
      return {
        message: "Could not create project because ".concat(context.path, " is not a valid path.")
      };

    case "10003":
      return {
        message: "Directory ".concat(context.rootPath, " is already a Node project.")
      };

    default:
      return {
        message: "Unknown error"
      };
  }
};

exports.panicHandler = panicHandler;