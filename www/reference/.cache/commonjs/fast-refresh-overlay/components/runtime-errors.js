"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.RuntimeErrors = RuntimeErrors;

var React = _interopRequireWildcard(require("react"));

var _stackTrace = _interopRequireDefault(require("stack-trace"));

var _overlay = require("./overlay");

var _hooks = require("./hooks");

var _codeFrame = require("./code-frame");

var _utils = require("../utils");

var _accordion = require("./accordion");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function WrappedAccordionItem({
  error,
  open
}) {
  var _res$sourcePosition;

  const stacktrace = _stackTrace.default.parse(error);

  const codeFrameInformation = (0, _utils.getCodeFrameInformation)(stacktrace);
  const filePath = codeFrameInformation === null || codeFrameInformation === void 0 ? void 0 : codeFrameInformation.moduleId;
  const lineNumber = codeFrameInformation === null || codeFrameInformation === void 0 ? void 0 : codeFrameInformation.lineNumber;
  const columnNumber = codeFrameInformation === null || codeFrameInformation === void 0 ? void 0 : codeFrameInformation.columnNumber;
  const name = codeFrameInformation === null || codeFrameInformation === void 0 ? void 0 : codeFrameInformation.functionName;
  const res = (0, _hooks.useStackFrame)({
    moduleId: filePath,
    lineNumber,
    columnNumber
  });
  const line = (_res$sourcePosition = res.sourcePosition) === null || _res$sourcePosition === void 0 ? void 0 : _res$sourcePosition.line;

  const Title = () => {
    if (!name) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, "Unknown Runtime Error");
    }

    return /*#__PURE__*/React.createElement(React.Fragment, null, "Error in function", ` `, /*#__PURE__*/React.createElement("span", {
      "data-font-weight": "bold"
    }, name), " in", ` `, /*#__PURE__*/React.createElement("span", {
      "data-font-weight": "bold"
    }, filePath, ":", line));
  };

  return /*#__PURE__*/React.createElement(_accordion.AccordionItem, {
    open: open,
    title: /*#__PURE__*/React.createElement(Title, null)
  }, /*#__PURE__*/React.createElement("p", {
    "data-gatsby-overlay": "body__error-message"
  }, error.message), /*#__PURE__*/React.createElement("div", {
    "data-gatsby-overlay": "codeframe__top"
  }, /*#__PURE__*/React.createElement("div", null, filePath, ":", line), /*#__PURE__*/React.createElement("button", {
    "data-gatsby-overlay": "body__open-in-editor",
    onClick: () => (0, _utils.openInEditor)(filePath, line)
  }, "Open in Editor")), /*#__PURE__*/React.createElement(_codeFrame.CodeFrame, {
    decoded: res.decoded
  }));
}

function RuntimeErrors({
  errors,
  dismiss
}) {
  const deduplicatedErrors = React.useMemo(() => Array.from(new Set(errors)), [errors]);
  const hasMultipleErrors = deduplicatedErrors.length > 1;
  return /*#__PURE__*/React.createElement(_overlay.Overlay, null, /*#__PURE__*/React.createElement(_overlay.Header, {
    "data-gatsby-error-type": "runtime-error"
  }, /*#__PURE__*/React.createElement("div", {
    "data-gatsby-overlay": "header__cause-file"
  }, /*#__PURE__*/React.createElement("h1", {
    id: "gatsby-overlay-labelledby"
  }, hasMultipleErrors ? `${errors.length} Unhandled Runtime Errors` : `Unhandled Runtime Error`)), /*#__PURE__*/React.createElement(_overlay.HeaderOpenClose, {
    dismiss: dismiss
  })), /*#__PURE__*/React.createElement(_overlay.Body, null, /*#__PURE__*/React.createElement("p", {
    "data-gatsby-overlay": "body__describedby",
    id: "gatsby-overlay-describedby"
  }, hasMultipleErrors ? `Multiple` : `One`, " unhandled runtime", ` `, hasMultipleErrors ? `errors` : `error`, " found in your files. See the list below to fix ", hasMultipleErrors ? `them` : `it`, ":"), /*#__PURE__*/React.createElement(_accordion.Accordion, null, deduplicatedErrors.map((error, index) => /*#__PURE__*/React.createElement(WrappedAccordionItem, {
    open: index === 0,
    key: `${error.message}-${index}`,
    error: error
  })))));
}