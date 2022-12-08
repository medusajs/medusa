"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.notCalledFunction = notCalledFunction;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _socket = _interopRequireDefault(require("socket.io-client"));

var _socketIo = _interopRequireDefault(require("./socketIo"));

var _emitter = _interopRequireDefault(require("./emitter"));

var _apiRunnerBrowser = require("./api-runner-browser");

var _loader = require("./loader");

var _indicator = require("./loading-indicator/indicator");

var _devLoader = _interopRequireDefault(require("./dev-loader"));

var _asyncRequires = _interopRequireDefault(require("$virtual/async-requires"));

var _matchPaths = _interopRequireDefault(require("$virtual/match-paths.json"));

var _loadingIndicator = require("./loading-indicator");

var _root = _interopRequireDefault(require("./root"));

var _navigation = require("./navigation");

require("./blank.css");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Enable fast-refresh for virtual sync-requires, gatsby-browser & navigation
// To ensure that our <Root /> component can hot reload in case anything below doesn't
// satisfy fast-refresh constraints
module.hot.accept([`$virtual/async-requires`, `./api-runner-browser`, `./navigation`], () => {
  // asyncRequires should be automatically updated here (due to ESM import and webpack HMR spec),
  // but loader doesn't know that and needs to be manually nudged
  loader.updateAsyncRequires(_asyncRequires.default);
});
window.___emitter = _emitter.default;
const loader = new _devLoader.default(_asyncRequires.default, _matchPaths.default);
(0, _loader.setLoader)(loader);
loader.setApiRunner(_apiRunnerBrowser.apiRunner);
window.___loader = _loader.publicLoader; // Do dummy dynamic import so the jsonp __webpack_require__.e is added to the commons.js
// bundle. This ensures hot reloading doesn't break when someone first adds
// a dynamic import.
//
// Without this, the runtime breaks with a
// "TypeError: __webpack_require__.e is not a function"
// error.

function notCalledFunction() {
  return Promise.resolve().then(() => _interopRequireWildcard(require(`./dummy`)));
} // Let the site/plugins run code very early.


(0, _apiRunnerBrowser.apiRunnerAsync)(`onClientEntry`).then(() => {
  // Hook up the client to socket.io on server
  const socket = (0, _socketIo.default)();

  if (socket) {
    socket.on(`reload`, () => {
      window.location.reload();
    });
  }

  fetch(`/___services`).then(res => res.json()).then(services => {
    if (services.developstatusserver) {
      let isRestarting = false;
      const parentSocket = (0, _socket.default)(`${window.location.protocol}//${window.location.hostname}:${services.developstatusserver.port}`);
      parentSocket.on(`structured-log`, msg => {
        if (!isRestarting && msg.type === `LOG_ACTION` && msg.action.type === `DEVELOP` && msg.action.payload === `RESTART_REQUIRED` && window.confirm(`The develop process needs to be restarted for the changes to ${msg.action.dirtyFile} to be applied.\nDo you want to restart the develop process now?`)) {
          isRestarting = true;
          parentSocket.emit(`develop:restart`, () => {
            window.location.reload();
          });
        }

        if (isRestarting && msg.type === `LOG_ACTION` && msg.action.type === `SET_STATUS` && msg.action.payload === `SUCCESS`) {
          isRestarting = false;
          window.location.reload();
        }
      }); // Prevents certain browsers spamming XHR 'ERR_CONNECTION_REFUSED'
      // errors within the console, such as when exiting the develop process.

      parentSocket.on(`disconnect`, () => {
        console.warn(`[socket.io] Disconnected. Unable to perform health-check.`);
        parentSocket.close();
      });
    }
  });
  /**
   * Service Workers are persistent by nature. They stick around,
   * serving a cached version of the site if they aren't removed.
   * This is especially frustrating when you need to test the
   * production build on your local machine.
   *
   * Let's warn if we find service workers in development.
   */

  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      if (registrations.length > 0) console.warn(`Warning: found one or more service workers present.`, `If your site isn't behaving as expected, you might want to remove these.`, registrations);
    });
  }

  const rootElement = document.getElementById(`___gatsby`);
  const focusEl = document.getElementById(`gatsby-focus-wrapper`); // Client only pages have any empty body so we just do a normal
  // render to avoid React complaining about hydration mis-matches.

  let defaultRenderer = _reactDom.default.render;

  if (focusEl && focusEl.children.length) {
    if (_reactDom.default.hydrateRoot) {
      defaultRenderer = _reactDom.default.hydrateRoot;
    } else {
      defaultRenderer = _reactDom.default.hydrate;
    }
  }

  const renderer = (0, _apiRunnerBrowser.apiRunner)(`replaceHydrateFunction`, undefined, defaultRenderer)[0];
  let dismissLoadingIndicator;

  if (process.env.GATSBY_EXPERIMENTAL_QUERY_ON_DEMAND && process.env.GATSBY_QUERY_ON_DEMAND_LOADING_INDICATOR === `true`) {
    let indicatorMountElement;
    const showIndicatorTimeout = setTimeout(() => {
      indicatorMountElement = document.createElement(`first-render-loading-indicator`);
      document.body.append(indicatorMountElement);

      _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_indicator.Indicator, null), indicatorMountElement);
    }, 1000);

    dismissLoadingIndicator = () => {
      clearTimeout(showIndicatorTimeout);

      if (indicatorMountElement) {
        _reactDom.default.unmountComponentAtNode(indicatorMountElement);

        indicatorMountElement.remove();
      }
    };
  }

  Promise.all([loader.loadPage(`/dev-404-page/`), loader.loadPage(`/404.html`), loader.loadPage(window.location.pathname)]).then(() => {
    (0, _navigation.init)();

    function onHydrated() {
      (0, _apiRunnerBrowser.apiRunner)(`onInitialClientRender`); // Render query on demand overlay

      if (process.env.GATSBY_QUERY_ON_DEMAND_LOADING_INDICATOR && process.env.GATSBY_QUERY_ON_DEMAND_LOADING_INDICATOR === `true`) {
        const indicatorMountElement = document.createElement(`div`);
        indicatorMountElement.setAttribute(`id`, `query-on-demand-indicator-element`);
        document.body.append(indicatorMountElement);

        if (renderer === _reactDom.default.hydrateRoot) {
          _reactDom.default.createRoot(indicatorMountElement).render( /*#__PURE__*/_react.default.createElement(_loadingIndicator.LoadingIndicatorEventHandler, null));
        } else {
          _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_loadingIndicator.LoadingIndicatorEventHandler, null), indicatorMountElement);
        }
      }
    }

    function App() {
      const onClientEntryRanRef = _react.default.useRef(false);

      _react.default.useEffect(() => {
        if (!onClientEntryRanRef.current) {
          onClientEntryRanRef.current = true;
          onHydrated();
        }
      }, []);

      return /*#__PURE__*/_react.default.createElement(_root.default, null);
    }

    function runRender() {
      if (dismissLoadingIndicator) {
        dismissLoadingIndicator();
      }

      if (renderer === _reactDom.default.hydrateRoot) {
        renderer(rootElement, /*#__PURE__*/_react.default.createElement(App, null));
      } else {
        renderer( /*#__PURE__*/_react.default.createElement(App, null), rootElement);
      }
    } // https://github.com/madrobby/zepto/blob/b5ed8d607f67724788ec9ff492be297f64d47dfc/src/zepto.js#L439-L450
    // TODO remove IE 10 support


    const doc = document;

    if (doc.readyState === `complete` || doc.readyState !== `loading` && !doc.documentElement.doScroll) {
      setTimeout(function () {
        runRender();
      }, 0);
    } else {
      const handler = function () {
        doc.removeEventListener(`DOMContentLoaded`, handler, false);
        window.removeEventListener(`load`, handler, false);
        runRender();
      };

      doc.addEventListener(`DOMContentLoaded`, handler, false);
      window.addEventListener(`load`, handler, false);
    }
  });
});