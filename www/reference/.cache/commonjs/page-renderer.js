"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _apiRunnerBrowser = require("./api-runner-browser");

var _findPath = require("./find-path");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Renders page
class PageRenderer extends _react.default.Component {
  render() {
    const props = { ...this.props,
      params: { ...(0, _findPath.grabMatchParams)(this.props.location.pathname),
        ...this.props.pageResources.json.pageContext.__params
      }
    };
    const pageElement = /*#__PURE__*/(0, _react.createElement)(this.props.pageResources.component, { ...props,
      key: this.props.path || this.props.pageResources.page.path
    });
    const wrappedPage = (0, _apiRunnerBrowser.apiRunner)(`wrapPageElement`, {
      element: pageElement,
      props
    }, pageElement, ({
      result
    }) => {
      return {
        element: result,
        props
      };
    }).pop();
    return wrappedPage;
  }

}

PageRenderer.propTypes = {
  location: _propTypes.default.object.isRequired,
  pageResources: _propTypes.default.object.isRequired,
  data: _propTypes.default.object,
  pageContext: _propTypes.default.object.isRequired
};
var _default = PageRenderer;
exports.default = _default;