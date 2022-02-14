"use strict";
(() => {
var exports = {};
exports.id = "pages/_document";
exports.ids = ["pages/_document"];
exports.modules = {

/***/ "./node_modules/next/dist/client/head-manager.js":
/*!*******************************************************!*\
  !*** ./node_modules/next/dist/client/head-manager.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = initHeadManager;
exports.DOMAttributeNames = void 0;
const DOMAttributeNames = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
  noModule: 'noModule'
};
exports.DOMAttributeNames = DOMAttributeNames;

function reactElementToDOM({
  type,
  props
}) {
  const el = document.createElement(type);

  for (const p in props) {
    if (!props.hasOwnProperty(p)) continue;
    if (p === 'children' || p === 'dangerouslySetInnerHTML') continue; // we don't render undefined props to the DOM

    if (props[p] === undefined) continue;
    const attr = DOMAttributeNames[p] || p.toLowerCase();

    if (type === 'script' && (attr === 'async' || attr === 'defer' || attr === 'noModule')) {
      el[attr] = !!props[p];
    } else {
      el.setAttribute(attr, props[p]);
    }
  }

  const {
    children,
    dangerouslySetInnerHTML
  } = props;

  if (dangerouslySetInnerHTML) {
    el.innerHTML = dangerouslySetInnerHTML.__html || '';
  } else if (children) {
    el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
  }

  return el;
}

function updateElements(type, components) {
  const headEl = document.getElementsByTagName('head')[0];
  const headCountEl = headEl.querySelector('meta[name=next-head-count]');

  if (true) {
    if (!headCountEl) {
      console.error('Warning: next-head-count is missing. https://nextjs.org/docs/messages/next-head-count-missing');
      return;
    }
  }

  const headCount = Number(headCountEl.content);
  const oldTags = [];

  for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = j.previousElementSibling) {
    if (j.tagName.toLowerCase() === type) {
      oldTags.push(j);
    }
  }

  const newTags = components.map(reactElementToDOM).filter(newTag => {
    for (let k = 0, len = oldTags.length; k < len; k++) {
      const oldTag = oldTags[k];

      if (oldTag.isEqualNode(newTag)) {
        oldTags.splice(k, 1);
        return false;
      }
    }

    return true;
  });
  oldTags.forEach(t => t.parentNode.removeChild(t));
  newTags.forEach(t => headEl.insertBefore(t, headCountEl));
  headCountEl.content = (headCount - oldTags.length + newTags.length).toString();
}

function initHeadManager() {
  let updatePromise = null;
  return {
    mountedInstances: new Set(),
    updateHead: head => {
      const promise = updatePromise = Promise.resolve().then(() => {
        if (promise !== updatePromise) return;
        updatePromise = null;
        const tags = {};
        head.forEach(h => {
          if ( // If the font tag is loaded only on client navigation
          // it won't be inlined. In this case revert to the original behavior
          h.type === 'link' && h.props['data-optimized-fonts'] && !document.querySelector(`style[data-href="${h.props['data-href']}"]`)) {
            h.props.href = h.props['data-href'];
            h.props['data-href'] = undefined;
          }

          const components = tags[h.type] || [];
          components.push(h);
          tags[h.type] = components;
        });
        const titleComponent = tags.title ? tags.title[0] : null;
        let title = '';

        if (titleComponent) {
          const {
            children
          } = titleComponent.props;
          title = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
        }

        if (title !== document.title) document.title = title;
        ['meta', 'base', 'link', 'style', 'script'].forEach(type => {
          updateElements(type, tags[type] || []);
        });
      });
    }
  };
}

/***/ }),

/***/ "./node_modules/next/dist/client/request-idle-callback.js":
/*!****************************************************************!*\
  !*** ./node_modules/next/dist/client/request-idle-callback.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.requestIdleCallback = exports.cancelIdleCallback = void 0;

const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function (cb) {
  let start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

exports.requestIdleCallback = requestIdleCallback;

const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function (id) {
  return clearTimeout(id);
};

exports.cancelIdleCallback = cancelIdleCallback;

/***/ }),

/***/ "./node_modules/next/dist/client/script.js":
/*!*************************************************!*\
  !*** ./node_modules/next/dist/client/script.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.initScriptLoader = initScriptLoader;
exports.default = void 0;

var _react = __webpack_require__(/*! react */ "react");

var _headManagerContext = __webpack_require__(/*! ../shared/lib/head-manager-context */ "../shared/lib/head-manager-context");

var _headManager = __webpack_require__(/*! ./head-manager */ "./node_modules/next/dist/client/head-manager.js");

var _requestIdleCallback = __webpack_require__(/*! ./request-idle-callback */ "./node_modules/next/dist/client/request-idle-callback.js");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === "function") {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

const ScriptCache = new Map();
const LoadCache = new Set();
const ignoreProps = ['onLoad', 'dangerouslySetInnerHTML', 'children', 'onError', 'strategy'];

const loadScript = props => {
  const {
    src,
    id,
    onLoad = () => {},
    dangerouslySetInnerHTML,
    children = '',
    strategy = 'afterInteractive',
    onError
  } = props;
  const cacheKey = id || src; // Script has already loaded

  if (cacheKey && LoadCache.has(cacheKey)) {
    return;
  } // Contents of this script are already loading/loaded


  if (ScriptCache.has(src)) {
    LoadCache.add(cacheKey); // Execute onLoad since the script loading has begun

    ScriptCache.get(src).then(onLoad, onError);
    return;
  }

  const el = document.createElement('script');
  const loadPromise = new Promise((resolve, reject) => {
    el.addEventListener('load', function (e) {
      resolve();

      if (onLoad) {
        onLoad.call(this, e);
      }
    });
    el.addEventListener('error', function (e) {
      reject(e);
    });
  }).catch(function (e) {
    if (onError) {
      onError(e);
    }
  });

  if (src) {
    ScriptCache.set(src, loadPromise);
  }

  LoadCache.add(cacheKey);

  if (dangerouslySetInnerHTML) {
    el.innerHTML = dangerouslySetInnerHTML.__html || '';
  } else if (children) {
    el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
  } else if (src) {
    el.src = src;
  }

  for (const [k, value] of Object.entries(props)) {
    if (value === undefined || ignoreProps.includes(k)) {
      continue;
    }

    const attr = _headManager.DOMAttributeNames[k] || k.toLowerCase();
    el.setAttribute(attr, value);
  }

  el.setAttribute('data-nscript', strategy);
  document.body.appendChild(el);
};

function handleClientScriptLoad(props) {
  const {
    strategy = 'afterInteractive'
  } = props;

  if (strategy === 'afterInteractive') {
    loadScript(props);
  } else if (strategy === 'lazyOnload') {
    window.addEventListener('load', () => {
      (0, _requestIdleCallback).requestIdleCallback(() => loadScript(props));
    });
  }
}

function loadLazyScript(props) {
  if (document.readyState === 'complete') {
    (0, _requestIdleCallback).requestIdleCallback(() => loadScript(props));
  } else {
    window.addEventListener('load', () => {
      (0, _requestIdleCallback).requestIdleCallback(() => loadScript(props));
    });
  }
}

function initScriptLoader(scriptLoaderItems) {
  scriptLoaderItems.forEach(handleClientScriptLoad);
}

function Script(props) {
  const {
    src = '',
    onLoad = () => {},
    dangerouslySetInnerHTML,
    strategy = 'afterInteractive',
    onError
  } = props,
        restProps = _objectWithoutProperties(props, ["src", "onLoad", "dangerouslySetInnerHTML", "strategy", "onError"]); // Context is available only during SSR


  const {
    updateScripts,
    scripts,
    getIsSsr
  } = (0, _react).useContext(_headManagerContext.HeadManagerContext);
  (0, _react).useEffect(() => {
    if (strategy === 'afterInteractive') {
      loadScript(props);
    } else if (strategy === 'lazyOnload') {
      loadLazyScript(props);
    }
  }, [props, strategy]);

  if (strategy === 'beforeInteractive') {
    if (updateScripts) {
      scripts.beforeInteractive = (scripts.beforeInteractive || []).concat([_objectSpread({
        src,
        onLoad,
        onError
      }, restProps)]);
      updateScripts(scripts);
    } else if (getIsSsr && getIsSsr()) {
      // Script has already loaded during SSR
      LoadCache.add(restProps.id || src);
    } else if (getIsSsr && !getIsSsr()) {
      loadScript(props);
    }
  }

  return null;
}

var _default = Script;
exports.default = _default;

/***/ }),

/***/ "./node_modules/next/dist/pages/_document.js":
/*!***************************************************!*\
  !*** ./node_modules/next/dist/pages/_document.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



const _excluded = ["strategy"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "DocumentContext", ({
  enumerable: true,
  get: function () {
    return _utils.DocumentContext;
  }
}));
Object.defineProperty(exports, "DocumentInitialProps", ({
  enumerable: true,
  get: function () {
    return _utils.DocumentInitialProps;
  }
}));
Object.defineProperty(exports, "DocumentProps", ({
  enumerable: true,
  get: function () {
    return _utils.DocumentProps;
  }
}));
exports.Html = Html;
exports.Main = Main;
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "react"));

var _server = _interopRequireDefault(__webpack_require__(/*! styled-jsx/server */ "styled-jsx/server"));

var _constants = __webpack_require__(/*! ../shared/lib/constants */ "../shared/lib/constants");

var _utils = __webpack_require__(/*! ../shared/lib/utils */ "../shared/lib/utils");

var _getPageFiles = __webpack_require__(/*! ../server/get-page-files */ "../server/get-page-files");

var _utils1 = __webpack_require__(/*! ../server/utils */ "../server/utils");

var _htmlescape = __webpack_require__(/*! ../server/htmlescape */ "../server/htmlescape");

var _script = _interopRequireDefault(__webpack_require__(/*! ../client/script */ "./node_modules/next/dist/client/script.js"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }

    newObj.default = obj;
    return newObj;
  }
}

function getDocumentFiles(buildManifest, pathname, inAmpMode) {
  const sharedFiles = (0, _getPageFiles).getPageFiles(buildManifest, '/_app');
  const pageFiles = inAmpMode ? [] : (0, _getPageFiles).getPageFiles(buildManifest, pathname);
  return {
    sharedFiles,
    pageFiles,
    allFiles: [...new Set([...sharedFiles, ...pageFiles])]
  };
}

function getPolyfillScripts(context, props) {
  // polyfills.js has to be rendered as nomodule without async
  // It also has to be the first script to load
  const {
    assetPrefix,
    buildManifest,
    devOnlyCacheBusterQueryString,
    disableOptimizedLoading
  } = context;
  return buildManifest.polyfillFiles.filter(polyfill => polyfill.endsWith('.js') && !polyfill.endsWith('.module.js')).map(polyfill => /*#__PURE__*/_react.default.createElement("script", {
    key: polyfill,
    defer: !disableOptimizedLoading,
    nonce: props.nonce,
    crossOrigin: props.crossOrigin || undefined,
    noModule: true,
    src: `${assetPrefix}/_next/${polyfill}${devOnlyCacheBusterQueryString}`
  }));
}

function getPreNextScripts(context, props) {
  const {
    scriptLoader,
    disableOptimizedLoading
  } = context;
  return (scriptLoader.beforeInteractive || []).map((file, index) => {
    const {
      strategy
    } = file,
          scriptProps = _objectWithoutProperties(file, _excluded);

    return /*#__PURE__*/_react.default.createElement("script", Object.assign({}, scriptProps, {
      key: scriptProps.src || index,
      defer: !disableOptimizedLoading,
      nonce: props.nonce,
      "data-nscript": "beforeInteractive",
      crossOrigin: props.crossOrigin || undefined
    }));
  });
}

function getDynamicChunks(context, props, files) {
  const {
    dynamicImports,
    assetPrefix,
    isDevelopment,
    devOnlyCacheBusterQueryString,
    disableOptimizedLoading
  } = context;
  return dynamicImports.map(file => {
    if (!file.endsWith('.js') || files.allFiles.includes(file)) return null;
    return /*#__PURE__*/_react.default.createElement("script", {
      async: !isDevelopment && disableOptimizedLoading,
      defer: !disableOptimizedLoading,
      key: file,
      src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
      nonce: props.nonce,
      crossOrigin: props.crossOrigin || undefined
    });
  });
}

function getScripts(context, props, files) {
  var ref;
  const {
    assetPrefix,
    buildManifest,
    isDevelopment,
    devOnlyCacheBusterQueryString,
    disableOptimizedLoading
  } = context;
  const normalScripts = files.allFiles.filter(file => file.endsWith('.js'));
  const lowPriorityScripts = (ref = buildManifest.lowPriorityFiles) === null || ref === void 0 ? void 0 : ref.filter(file => file.endsWith('.js'));
  return [...normalScripts, ...lowPriorityScripts].map(file => {
    return /*#__PURE__*/_react.default.createElement("script", {
      key: file,
      src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
      nonce: props.nonce,
      async: !isDevelopment && disableOptimizedLoading,
      defer: !disableOptimizedLoading,
      crossOrigin: props.crossOrigin || undefined
    });
  });
}

class Document1 extends _react.Component {
  /**
  * `getInitialProps` hook returns the context object with the addition of `renderPage`.
  * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
  */
  static async getInitialProps(ctx) {
    const enhanceApp = App => {
      return props => /*#__PURE__*/_react.default.createElement(App, Object.assign({}, props));
    };

    const {
      html,
      head
    } = await ctx.renderPage({
      enhanceApp
    });
    const styles = [...(0, _server).default()];
    return {
      html,
      head,
      styles
    };
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(Html, null, /*#__PURE__*/_react.default.createElement(Head, null), /*#__PURE__*/_react.default.createElement("body", null, /*#__PURE__*/_react.default.createElement(Main, null), /*#__PURE__*/_react.default.createElement(NextScript, null)));
  }

}

exports.default = Document1;

function Html(props) {
  const {
    inAmpMode,
    docComponentsRendered,
    locale
  } = (0, _react).useContext(_utils.HtmlContext);
  docComponentsRendered.Html = true;
  return /*#__PURE__*/_react.default.createElement("html", Object.assign({}, props, {
    lang: props.lang || locale || undefined,
    amp: inAmpMode ? '' : undefined,
    "data-ampdevmode": inAmpMode && true ? '' : undefined
  }));
}

class Head extends _react.Component {
  getCssLinks(files) {
    const {
      assetPrefix,
      devOnlyCacheBusterQueryString,
      dynamicImports
    } = this.context;
    const cssFiles = files.allFiles.filter(f => f.endsWith('.css'));
    const sharedFiles = new Set(files.sharedFiles); // Unmanaged files are CSS files that will be handled directly by the
    // webpack runtime (`mini-css-extract-plugin`).

    let unmangedFiles = new Set([]);
    let dynamicCssFiles = Array.from(new Set(dynamicImports.filter(file => file.endsWith('.css'))));

    if (dynamicCssFiles.length) {
      const existing = new Set(cssFiles);
      dynamicCssFiles = dynamicCssFiles.filter(f => !(existing.has(f) || sharedFiles.has(f)));
      unmangedFiles = new Set(dynamicCssFiles);
      cssFiles.push(...dynamicCssFiles);
    }

    let cssLinkElements = [];
    cssFiles.forEach(file => {
      const isSharedFile = sharedFiles.has(file);

      if (true) {
        cssLinkElements.push( /*#__PURE__*/_react.default.createElement("link", {
          key: `${file}-preload`,
          nonce: this.props.nonce,
          rel: "preload",
          href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
          as: "style",
          crossOrigin: this.props.crossOrigin || undefined
        }));
      }

      const isUnmanagedFile = unmangedFiles.has(file);
      cssLinkElements.push( /*#__PURE__*/_react.default.createElement("link", {
        key: file,
        nonce: this.props.nonce,
        rel: "stylesheet",
        href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
        crossOrigin: this.props.crossOrigin || undefined,
        "data-n-g": isUnmanagedFile ? undefined : isSharedFile ? '' : undefined,
        "data-n-p": isUnmanagedFile ? undefined : isSharedFile ? undefined : ''
      }));
    });

    if (false) {}

    return cssLinkElements.length === 0 ? null : cssLinkElements;
  }

  getPreloadDynamicChunks() {
    const {
      dynamicImports,
      assetPrefix,
      devOnlyCacheBusterQueryString
    } = this.context;
    return dynamicImports.map(file => {
      if (!file.endsWith('.js')) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement("link", {
        rel: "preload",
        key: file,
        href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
        as: "script",
        nonce: this.props.nonce,
        crossOrigin: this.props.crossOrigin || undefined
      });
    }) // Filter out nulled scripts
    .filter(Boolean);
  }

  getPreloadMainLinks(files) {
    const {
      assetPrefix,
      devOnlyCacheBusterQueryString,
      scriptLoader
    } = this.context;
    const preloadFiles = files.allFiles.filter(file => {
      return file.endsWith('.js');
    });
    return [...(scriptLoader.beforeInteractive || []).map(file => /*#__PURE__*/_react.default.createElement("link", {
      key: file.src,
      nonce: this.props.nonce,
      rel: "preload",
      href: file.src,
      as: "script",
      crossOrigin: this.props.crossOrigin || undefined
    })), ...preloadFiles.map(file => /*#__PURE__*/_react.default.createElement("link", {
      key: file,
      nonce: this.props.nonce,
      rel: "preload",
      href: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
      as: "script",
      crossOrigin: this.props.crossOrigin || undefined
    }))];
  }

  getDynamicChunks(files) {
    return getDynamicChunks(this.context, this.props, files);
  }

  getPreNextScripts() {
    return getPreNextScripts(this.context, this.props);
  }

  getScripts(files) {
    return getScripts(this.context, this.props, files);
  }

  getPolyfillScripts() {
    return getPolyfillScripts(this.context, this.props);
  }

  handleDocumentScriptLoaderItems(children) {
    const {
      scriptLoader
    } = this.context;
    const scriptLoaderItems = [];
    const filteredChildren = [];

    _react.default.Children.forEach(children, child => {
      if (child.type === _script.default) {
        if (child.props.strategy === 'beforeInteractive') {
          scriptLoader.beforeInteractive = (scriptLoader.beforeInteractive || []).concat([_objectSpread({}, child.props)]);
          return;
        } else if (['lazyOnload', 'afterInteractive'].includes(child.props.strategy)) {
          scriptLoaderItems.push(child.props);
          return;
        }
      }

      filteredChildren.push(child);
    });

    this.context.__NEXT_DATA__.scriptLoader = scriptLoaderItems;
    return filteredChildren;
  }

  makeStylesheetInert(node) {
    return _react.default.Children.map(node, c => {
      if (c.type === 'link' && c.props['href'] && _constants.OPTIMIZED_FONT_PROVIDERS.some(({
        url
      }) => c.props['href'].startsWith(url))) {
        const newProps = _objectSpread({}, c.props || {});

        newProps['data-href'] = newProps['href'];
        newProps['href'] = undefined;
        return /*#__PURE__*/_react.default.cloneElement(c, newProps);
      } else if (c.props && c.props['children']) {
        c.props['children'] = this.makeStylesheetInert(c.props['children']);
      }

      return c;
    });
  }

  render() {
    const {
      styles,
      ampPath,
      inAmpMode,
      hybridAmp,
      canonicalBase,
      __NEXT_DATA__,
      dangerousAsPath,
      headTags,
      unstable_runtimeJS,
      unstable_JsPreload,
      disableOptimizedLoading
    } = this.context;
    const disableRuntimeJS = unstable_runtimeJS === false;
    const disableJsPreload = unstable_JsPreload === false || !disableOptimizedLoading;
    this.context.docComponentsRendered.Head = true;
    let {
      head
    } = this.context;
    let cssPreloads = [];
    let otherHeadElements = [];

    if (head) {
      head.forEach(c => {
        if (c && c.type === 'link' && c.props['rel'] === 'preload' && c.props['as'] === 'style') {
          cssPreloads.push(c);
        } else {
          c && otherHeadElements.push(c);
        }
      });
      head = cssPreloads.concat(otherHeadElements);
    }

    let children = _react.default.Children.toArray(this.props.children).filter(Boolean); // show a warning if Head contains <title> (only in development)


    if (true) {
      children = _react.default.Children.map(children, child => {
        var ref;
        const isReactHelmet = child === null || child === void 0 ? void 0 : (ref = child.props) === null || ref === void 0 ? void 0 : ref['data-react-helmet'];

        if (!isReactHelmet) {
          var ref1;

          if ((child === null || child === void 0 ? void 0 : child.type) === 'title') {
            console.warn("Warning: <title> should not be used in _document.js's <Head>. https://nextjs.org/docs/messages/no-document-title");
          } else if ((child === null || child === void 0 ? void 0 : child.type) === 'meta' && (child === null || child === void 0 ? void 0 : (ref1 = child.props) === null || ref1 === void 0 ? void 0 : ref1.name) === 'viewport') {
            console.warn("Warning: viewport meta tags should not be used in _document.js's <Head>. https://nextjs.org/docs/messages/no-document-viewport-meta");
          }
        }

        return child;
      });
      if (this.props.crossOrigin) console.warn('Warning: `Head` attribute `crossOrigin` is deprecated. https://nextjs.org/docs/messages/doc-crossorigin-deprecated');
    }

    if (false) {}

    children = this.handleDocumentScriptLoaderItems(children);
    let hasAmphtmlRel = false;
    let hasCanonicalRel = false; // show warning and remove conflicting amp head tags

    head = _react.default.Children.map(head || [], child => {
      if (!child) return child;
      const {
        type,
        props
      } = child;

      if (inAmpMode) {
        let badProp = '';

        if (type === 'meta' && props.name === 'viewport') {
          badProp = 'name="viewport"';
        } else if (type === 'link' && props.rel === 'canonical') {
          hasCanonicalRel = true;
        } else if (type === 'script') {
          // only block if
          // 1. it has a src and isn't pointing to ampproject's CDN
          // 2. it is using dangerouslySetInnerHTML without a type or
          // a type of text/javascript
          if (props.src && props.src.indexOf('ampproject') < -1 || props.dangerouslySetInnerHTML && (!props.type || props.type === 'text/javascript')) {
            badProp = '<script';
            Object.keys(props).forEach(prop => {
              badProp += ` ${prop}="${props[prop]}"`;
            });
            badProp += '/>';
          }
        }

        if (badProp) {
          console.warn(`Found conflicting amp tag "${child.type}" with conflicting prop ${badProp} in ${__NEXT_DATA__.page}. https://nextjs.org/docs/messages/conflicting-amp-tag`);
          return null;
        }
      } else {
        // non-amp mode
        if (type === 'link' && props.rel === 'amphtml') {
          hasAmphtmlRel = true;
        }
      }

      return child;
    }); // try to parse styles from fragment for backwards compat

    const curStyles = Array.isArray(styles) ? styles : [];

    if (inAmpMode && styles && // @ts-ignore Property 'props' does not exist on type ReactElement
    styles.props && // @ts-ignore Property 'props' does not exist on type ReactElement
    Array.isArray(styles.props.children)) {
      const hasStyles = el => {
        var ref2, ref3;
        return el === null || el === void 0 ? void 0 : (ref2 = el.props) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.dangerouslySetInnerHTML) === null || ref3 === void 0 ? void 0 : ref3.__html;
      }; // @ts-ignore Property 'props' does not exist on type ReactElement


      styles.props.children.forEach(child => {
        if (Array.isArray(child)) {
          child.forEach(el => hasStyles(el) && curStyles.push(el));
        } else if (hasStyles(child)) {
          curStyles.push(child);
        }
      });
    }

    const files = getDocumentFiles(this.context.buildManifest, this.context.__NEXT_DATA__.page, inAmpMode);

    var _nonce, _nonce1;

    return /*#__PURE__*/_react.default.createElement("head", Object.assign({}, this.props), this.context.isDevelopment && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("style", {
      "data-next-hide-fouc": true,
      "data-ampdevmode": inAmpMode ? 'true' : undefined,
      dangerouslySetInnerHTML: {
        __html: `body{display:none}`
      }
    }), /*#__PURE__*/_react.default.createElement("noscript", {
      "data-next-hide-fouc": true,
      "data-ampdevmode": inAmpMode ? 'true' : undefined
    }, /*#__PURE__*/_react.default.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: `body{display:block}`
      }
    }))), children,  false && /*#__PURE__*/0, head, /*#__PURE__*/_react.default.createElement("meta", {
      name: "next-head-count",
      content: _react.default.Children.count(head || []).toString()
    }), inAmpMode && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("meta", {
      name: "viewport",
      content: "width=device-width,minimum-scale=1,initial-scale=1"
    }), !hasCanonicalRel && /*#__PURE__*/_react.default.createElement("link", {
      rel: "canonical",
      href: canonicalBase + (0, _utils1).cleanAmpPath(dangerousAsPath)
    }), /*#__PURE__*/_react.default.createElement("link", {
      rel: "preload",
      as: "script",
      href: "https://cdn.ampproject.org/v0.js"
    }), styles && /*#__PURE__*/_react.default.createElement("style", {
      "amp-custom": "",
      dangerouslySetInnerHTML: {
        __html: curStyles.map(style => style.props.dangerouslySetInnerHTML.__html).join('').replace(/\/\*# sourceMappingURL=.*\*\//g, '').replace(/\/\*@ sourceURL=.*?\*\//g, '')
      }
    }), /*#__PURE__*/_react.default.createElement("style", {
      "amp-boilerplate": "",
      dangerouslySetInnerHTML: {
        __html: `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`
      }
    }), /*#__PURE__*/_react.default.createElement("noscript", null, /*#__PURE__*/_react.default.createElement("style", {
      "amp-boilerplate": "",
      dangerouslySetInnerHTML: {
        __html: `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`
      }
    })), /*#__PURE__*/_react.default.createElement("script", {
      async: true,
      src: "https://cdn.ampproject.org/v0.js"
    })), !inAmpMode && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !hasAmphtmlRel && hybridAmp && /*#__PURE__*/_react.default.createElement("link", {
      rel: "amphtml",
      href: canonicalBase + getAmpPath(ampPath, dangerousAsPath)
    }),  true && this.getCssLinks(files),  true && /*#__PURE__*/_react.default.createElement("noscript", {
      "data-n-css": (_nonce = this.props.nonce) !== null && _nonce !== void 0 ? _nonce : ''
    }),  false && /*#__PURE__*/0, !disableRuntimeJS && !disableJsPreload && this.getPreloadDynamicChunks(), !disableRuntimeJS && !disableJsPreload && this.getPreloadMainLinks(files), !disableOptimizedLoading && !disableRuntimeJS && this.getPolyfillScripts(), !disableOptimizedLoading && !disableRuntimeJS && this.getPreNextScripts(), !disableOptimizedLoading && !disableRuntimeJS && this.getDynamicChunks(files), !disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files),  false && 0,  false && /*#__PURE__*/0, this.context.isDevelopment && // this element is used to mount development styles so the
    // ordering matches production
    // (by default, style-loader injects at the bottom of <head />)

    /*#__PURE__*/
    _react.default.createElement("noscript", {
      id: "__next_css__DO_NOT_USE__"
    }), styles || null), /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {}, ...(headTags || [])));
  }

}

exports.Head = Head;
Head.contextType = _utils.HtmlContext;

function Main() {
  const {
    inAmpMode,
    docComponentsRendered
  } = (0, _react).useContext(_utils.HtmlContext);
  docComponentsRendered.Main = true;
  if (inAmpMode) return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, _constants.BODY_RENDER_TARGET);
  return /*#__PURE__*/_react.default.createElement("div", {
    id: "__next"
  }, _constants.BODY_RENDER_TARGET);
}

class NextScript extends _react.Component {
  getDynamicChunks(files) {
    return getDynamicChunks(this.context, this.props, files);
  }

  getPreNextScripts() {
    return getPreNextScripts(this.context, this.props);
  }

  getScripts(files) {
    return getScripts(this.context, this.props, files);
  }

  getPolyfillScripts() {
    return getPolyfillScripts(this.context, this.props);
  }

  static getInlineScriptSource(context) {
    const {
      __NEXT_DATA__
    } = context;

    try {
      const data = JSON.stringify(__NEXT_DATA__);
      return (0, _htmlescape).htmlEscapeJsonString(data);
    } catch (err) {
      if (err.message.indexOf('circular structure')) {
        throw new Error(`Circular structure in "getInitialProps" result of page "${__NEXT_DATA__.page}". https://nextjs.org/docs/messages/circular-structure`);
      }

      throw err;
    }
  }

  render() {
    const {
      assetPrefix,
      inAmpMode,
      buildManifest,
      unstable_runtimeJS,
      docComponentsRendered,
      devOnlyCacheBusterQueryString,
      disableOptimizedLoading
    } = this.context;
    const disableRuntimeJS = unstable_runtimeJS === false;
    docComponentsRendered.NextScript = true;

    if (inAmpMode) {
      if (false) {}

      const ampDevFiles = [...buildManifest.devFiles, ...buildManifest.polyfillFiles, ...buildManifest.ampDevFiles];
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, disableRuntimeJS ? null : /*#__PURE__*/_react.default.createElement("script", {
        id: "__NEXT_DATA__",
        type: "application/json",
        nonce: this.props.nonce,
        crossOrigin: this.props.crossOrigin || undefined,
        dangerouslySetInnerHTML: {
          __html: NextScript.getInlineScriptSource(this.context)
        },
        "data-ampdevmode": true
      }), ampDevFiles.map(file => /*#__PURE__*/_react.default.createElement("script", {
        key: file,
        src: `${assetPrefix}/_next/${file}${devOnlyCacheBusterQueryString}`,
        nonce: this.props.nonce,
        crossOrigin: this.props.crossOrigin || undefined,
        "data-ampdevmode": true
      })));
    }

    if (true) {
      if (this.props.crossOrigin) console.warn('Warning: `NextScript` attribute `crossOrigin` is deprecated. https://nextjs.org/docs/messages/doc-crossorigin-deprecated');
    }

    const files = getDocumentFiles(this.context.buildManifest, this.context.__NEXT_DATA__.page, inAmpMode);
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, !disableRuntimeJS && buildManifest.devFiles ? buildManifest.devFiles.map(file => /*#__PURE__*/_react.default.createElement("script", {
      key: file,
      src: `${assetPrefix}/_next/${encodeURI(file)}${devOnlyCacheBusterQueryString}`,
      nonce: this.props.nonce,
      crossOrigin: this.props.crossOrigin || undefined
    })) : null, disableRuntimeJS ? null : /*#__PURE__*/_react.default.createElement("script", {
      id: "__NEXT_DATA__",
      type: "application/json",
      nonce: this.props.nonce,
      crossOrigin: this.props.crossOrigin || undefined,
      dangerouslySetInnerHTML: {
        __html: NextScript.getInlineScriptSource(this.context)
      }
    }), disableOptimizedLoading && !disableRuntimeJS && this.getPolyfillScripts(), disableOptimizedLoading && !disableRuntimeJS && this.getPreNextScripts(), disableOptimizedLoading && !disableRuntimeJS && this.getDynamicChunks(files), disableOptimizedLoading && !disableRuntimeJS && this.getScripts(files));
  }

}

exports.NextScript = NextScript;
NextScript.contextType = _utils.HtmlContext;
NextScript.safariNomoduleFix = '!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();';

function getAmpPath(ampPath, asPath) {
  return ampPath || `${asPath}${asPath.includes('?') ? '&' : '?'}amp=1`;
}

/***/ }),

/***/ "../server/get-page-files":
/*!*****************************************************!*\
  !*** external "next/dist/server/get-page-files.js" ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/get-page-files.js");

/***/ }),

/***/ "../server/htmlescape":
/*!*************************************************!*\
  !*** external "next/dist/server/htmlescape.js" ***!
  \*************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/htmlescape.js");

/***/ }),

/***/ "../server/utils":
/*!********************************************!*\
  !*** external "next/dist/server/utils.js" ***!
  \********************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/utils.js");

/***/ }),

/***/ "../shared/lib/constants":
/*!****************************************************!*\
  !*** external "next/dist/shared/lib/constants.js" ***!
  \****************************************************/
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/constants.js");

/***/ }),

/***/ "../shared/lib/head-manager-context":
/*!***************************************************************!*\
  !*** external "next/dist/shared/lib/head-manager-context.js" ***!
  \***************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/head-manager-context.js");

/***/ }),

/***/ "../shared/lib/utils":
/*!************************************************!*\
  !*** external "next/dist/shared/lib/utils.js" ***!
  \************************************************/
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "styled-jsx/server":
/*!************************************!*\
  !*** external "styled-jsx/server" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("styled-jsx/server");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./node_modules/next/dist/pages/_document.js"));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QixJQUFnRCxLQUFLbkUsZ0JBQUwsQ0FBc0JDLEtBQXRCLENBZHBMLEVBY2tOakIsdUJBQXVCLElBQUksQ0FBQ21GLGdCQUE1QixJQUFnRCxLQUFLN0QsVUFBTCxDQUFnQkwsS0FBaEIsQ0FkbFEsQ0FBckI7QUFlSDs7QUEzRXFDOztBQTZFMUMvTSxrQkFBQSxHQUFxQm9PLFVBQXJCO0FBQ0FBLFVBQVUsQ0FBQ3dFLFdBQVgsR0FBeUIzSSxNQUFNLENBQUNzRSxXQUFoQztBQUNBSCxVQUFVLENBQUNvRixpQkFBWCxHQUErQiwwVEFBL0I7O0FBQ0EsU0FBU2QsVUFBVCxDQUFvQmhDLE9BQXBCLEVBQTZCK0MsTUFBN0IsRUFBcUM7QUFDakMsU0FBTy9DLE9BQU8sSUFBSyxHQUFFK0MsTUFBTyxHQUFFQSxNQUFNLENBQUN6SyxRQUFQLENBQWdCLEdBQWhCLElBQXVCLEdBQXZCLEdBQTZCLEdBQUksT0FBL0Q7QUFDSDs7Ozs7Ozs7OztBQ2prQkQ7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQSIsInNvdXJjZXMiOlsid2VicGFjazovL21lZHVzYS1uZXh0anMtc3RhcnRlci8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvY2xpZW50L2hlYWQtbWFuYWdlci5qcyIsIndlYnBhY2s6Ly9tZWR1c2EtbmV4dGpzLXN0YXJ0ZXIvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2NsaWVudC9yZXF1ZXN0LWlkbGUtY2FsbGJhY2suanMiLCJ3ZWJwYWNrOi8vbWVkdXNhLW5leHRqcy1zdGFydGVyLy4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9jbGllbnQvc2NyaXB0LmpzIiwid2VicGFjazovL21lZHVzYS1uZXh0anMtc3RhcnRlci8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvcGFnZXMvX2RvY3VtZW50LmpzIiwid2VicGFjazovL21lZHVzYS1uZXh0anMtc3RhcnRlci9leHRlcm5hbCBcIm5leHQvZGlzdC9zZXJ2ZXIvZ2V0LXBhZ2UtZmlsZXMuanNcIiIsIndlYnBhY2s6Ly9tZWR1c2EtbmV4dGpzLXN0YXJ0ZXIvZXh0ZXJuYWwgXCJuZXh0L2Rpc3Qvc2VydmVyL2h0bWxlc2NhcGUuanNcIiIsIndlYnBhY2s6Ly9tZWR1c2EtbmV4dGpzLXN0YXJ0ZXIvZXh0ZXJuYWwgXCJuZXh0L2Rpc3Qvc2VydmVyL3V0aWxzLmpzXCIiLCJ3ZWJwYWNrOi8vbWVkdXNhLW5leHRqcy1zdGFydGVyL2V4dGVybmFsIFwibmV4dC9kaXN0L3NoYXJlZC9saWIvY29uc3RhbnRzLmpzXCIiLCJ3ZWJwYWNrOi8vbWVkdXNhLW5leHRqcy1zdGFydGVyL2V4dGVybmFsIFwibmV4dC9kaXN0L3NoYXJlZC9saWIvaGVhZC1tYW5hZ2VyLWNvbnRleHQuanNcIiIsIndlYnBhY2s6Ly9tZWR1c2EtbmV4dGpzLXN0YXJ0ZXIvZXh0ZXJuYWwgXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi91dGlscy5qc1wiIiwid2VicGFjazovL21lZHVzYS1uZXh0anMtc3RhcnRlci9leHRlcm5hbCBcInJlYWN0XCIiLCJ3ZWJwYWNrOi8vbWVkdXNhLW5leHRqcy1zdGFydGVyL2V4dGVybmFsIFwic3R5bGVkLWpzeC9zZXJ2ZXJcIiJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGVmYXVsdCA9IGluaXRIZWFkTWFuYWdlcjtcbmV4cG9ydHMuRE9NQXR0cmlidXRlTmFtZXMgPSB2b2lkIDA7XG5jb25zdCBET01BdHRyaWJ1dGVOYW1lcyA9IHtcbiAgICBhY2NlcHRDaGFyc2V0OiAnYWNjZXB0LWNoYXJzZXQnLFxuICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICBodG1sRm9yOiAnZm9yJyxcbiAgICBodHRwRXF1aXY6ICdodHRwLWVxdWl2JyxcbiAgICBub01vZHVsZTogJ25vTW9kdWxlJ1xufTtcbmV4cG9ydHMuRE9NQXR0cmlidXRlTmFtZXMgPSBET01BdHRyaWJ1dGVOYW1lcztcbmZ1bmN0aW9uIHJlYWN0RWxlbWVudFRvRE9NKHsgdHlwZSAsIHByb3BzICB9KSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuICAgIGZvcihjb25zdCBwIGluIHByb3BzKXtcbiAgICAgICAgaWYgKCFwcm9wcy5oYXNPd25Qcm9wZXJ0eShwKSkgY29udGludWU7XG4gICAgICAgIGlmIChwID09PSAnY2hpbGRyZW4nIHx8IHAgPT09ICdkYW5nZXJvdXNseVNldElubmVySFRNTCcpIGNvbnRpbnVlO1xuICAgICAgICAvLyB3ZSBkb24ndCByZW5kZXIgdW5kZWZpbmVkIHByb3BzIHRvIHRoZSBET01cbiAgICAgICAgaWYgKHByb3BzW3BdID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBhdHRyID0gRE9NQXR0cmlidXRlTmFtZXNbcF0gfHwgcC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ3NjcmlwdCcgJiYgKGF0dHIgPT09ICdhc3luYycgfHwgYXR0ciA9PT0gJ2RlZmVyJyB8fCBhdHRyID09PSAnbm9Nb2R1bGUnKSkge1xuICAgICAgICAgICAgZWxbYXR0cl0gPSAhIXByb3BzW3BdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHIsIHByb3BzW3BdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCB7IGNoaWxkcmVuICwgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwgIH0gPSBwcm9wcztcbiAgICBpZiAoZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwpIHtcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwuX19odG1sIHx8ICcnO1xuICAgIH0gZWxzZSBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSB0eXBlb2YgY2hpbGRyZW4gPT09ICdzdHJpbmcnID8gY2hpbGRyZW4gOiBBcnJheS5pc0FycmF5KGNoaWxkcmVuKSA/IGNoaWxkcmVuLmpvaW4oJycpIDogJyc7XG4gICAgfVxuICAgIHJldHVybiBlbDtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUVsZW1lbnRzKHR5cGUsIGNvbXBvbmVudHMpIHtcbiAgICBjb25zdCBoZWFkRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgIGNvbnN0IGhlYWRDb3VudEVsID0gaGVhZEVsLnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1uZXh0LWhlYWQtY291bnRdJyk7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgaWYgKCFoZWFkQ291bnRFbCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignV2FybmluZzogbmV4dC1oZWFkLWNvdW50IGlzIG1pc3NpbmcuIGh0dHBzOi8vbmV4dGpzLm9yZy9kb2NzL21lc3NhZ2VzL25leHQtaGVhZC1jb3VudC1taXNzaW5nJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgaGVhZENvdW50ID0gTnVtYmVyKGhlYWRDb3VudEVsLmNvbnRlbnQpO1xuICAgIGNvbnN0IG9sZFRhZ3MgPSBbXTtcbiAgICBmb3IobGV0IGkgPSAwLCBqID0gaGVhZENvdW50RWwucHJldmlvdXNFbGVtZW50U2libGluZzsgaSA8IGhlYWRDb3VudDsgaSsrLCBqID0gai5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKXtcbiAgICAgICAgaWYgKGoudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSB0eXBlKSB7XG4gICAgICAgICAgICBvbGRUYWdzLnB1c2goaik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbmV3VGFncyA9IGNvbXBvbmVudHMubWFwKHJlYWN0RWxlbWVudFRvRE9NKS5maWx0ZXIoKG5ld1RhZyk9PntcbiAgICAgICAgZm9yKGxldCBrID0gMCwgbGVuID0gb2xkVGFncy5sZW5ndGg7IGsgPCBsZW47IGsrKyl7XG4gICAgICAgICAgICBjb25zdCBvbGRUYWcgPSBvbGRUYWdzW2tdO1xuICAgICAgICAgICAgaWYgKG9sZFRhZy5pc0VxdWFsTm9kZShuZXdUYWcpKSB7XG4gICAgICAgICAgICAgICAgb2xkVGFncy5zcGxpY2UoaywgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIG9sZFRhZ3MuZm9yRWFjaCgodCk9PnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0KVxuICAgICk7XG4gICAgbmV3VGFncy5mb3JFYWNoKCh0KT0+aGVhZEVsLmluc2VydEJlZm9yZSh0LCBoZWFkQ291bnRFbClcbiAgICApO1xuICAgIGhlYWRDb3VudEVsLmNvbnRlbnQgPSAoaGVhZENvdW50IC0gb2xkVGFncy5sZW5ndGggKyBuZXdUYWdzLmxlbmd0aCkudG9TdHJpbmcoKTtcbn1cbmZ1bmN0aW9uIGluaXRIZWFkTWFuYWdlcigpIHtcbiAgICBsZXQgdXBkYXRlUHJvbWlzZSA9IG51bGw7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbW91bnRlZEluc3RhbmNlczogbmV3IFNldCgpLFxuICAgICAgICB1cGRhdGVIZWFkOiAoaGVhZCk9PntcbiAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSB1cGRhdGVQcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgIGlmIChwcm9taXNlICE9PSB1cGRhdGVQcm9taXNlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdXBkYXRlUHJvbWlzZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFncyA9IHtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGhlYWQuZm9yRWFjaCgoaCk9PntcbiAgICAgICAgICAgICAgICAgICAgaWYgKC8vIElmIHRoZSBmb250IHRhZyBpcyBsb2FkZWQgb25seSBvbiBjbGllbnQgbmF2aWdhdGlvblxuICAgICAgICAgICAgICAgICAgICAvLyBpdCB3b24ndCBiZSBpbmxpbmVkLiBJbiB0aGlzIGNhc2UgcmV2ZXJ0IHRvIHRoZSBvcmlnaW5hbCBiZWhhdmlvclxuICAgICAgICAgICAgICAgICAgICBoLnR5cGUgPT09ICdsaW5rJyAmJiBoLnByb3BzWydkYXRhLW9wdGltaXplZC1mb250cyddICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzdHlsZVtkYXRhLWhyZWY9XCIke2gucHJvcHNbJ2RhdGEtaHJlZiddfVwiXWApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoLnByb3BzLmhyZWYgPSBoLnByb3BzWydkYXRhLWhyZWYnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGgucHJvcHNbJ2RhdGEtaHJlZiddID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSB0YWdzW2gudHlwZV0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHMucHVzaChoKTtcbiAgICAgICAgICAgICAgICAgICAgdGFnc1toLnR5cGVdID0gY29tcG9uZW50cztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZUNvbXBvbmVudCA9IHRhZ3MudGl0bGUgPyB0YWdzLnRpdGxlWzBdIDogbnVsbDtcbiAgICAgICAgICAgICAgICBsZXQgdGl0bGUgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAodGl0bGVDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBjaGlsZHJlbiAgfSA9IHRpdGxlQ29tcG9uZW50LnByb3BzO1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IHR5cGVvZiBjaGlsZHJlbiA9PT0gJ3N0cmluZycgPyBjaGlsZHJlbiA6IEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pID8gY2hpbGRyZW4uam9pbignJykgOiAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRpdGxlICE9PSBkb2N1bWVudC50aXRsZSkgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdtZXRhJyxcbiAgICAgICAgICAgICAgICAgICAgJ2Jhc2UnLFxuICAgICAgICAgICAgICAgICAgICAnbGluaycsXG4gICAgICAgICAgICAgICAgICAgICdzdHlsZScsXG4gICAgICAgICAgICAgICAgICAgICdzY3JpcHQnXG4gICAgICAgICAgICAgICAgXS5mb3JFYWNoKCh0eXBlKT0+e1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVFbGVtZW50cyh0eXBlLCB0YWdzW3R5cGVdIHx8IFtdKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGVhZC1tYW5hZ2VyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5yZXF1ZXN0SWRsZUNhbGxiYWNrID0gZXhwb3J0cy5jYW5jZWxJZGxlQ2FsbGJhY2sgPSB2b2lkIDA7XG5jb25zdCByZXF1ZXN0SWRsZUNhbGxiYWNrID0gdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmIHNlbGYucmVxdWVzdElkbGVDYWxsYmFjayAmJiBzZWxmLnJlcXVlc3RJZGxlQ2FsbGJhY2suYmluZCh3aW5kb3cpIHx8IGZ1bmN0aW9uKGNiKSB7XG4gICAgbGV0IHN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgY2Ioe1xuICAgICAgICAgICAgZGlkVGltZW91dDogZmFsc2UsXG4gICAgICAgICAgICB0aW1lUmVtYWluaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5tYXgoMCwgNTAgLSAoRGF0ZS5ub3coKSAtIHN0YXJ0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIDEpO1xufTtcbmV4cG9ydHMucmVxdWVzdElkbGVDYWxsYmFjayA9IHJlcXVlc3RJZGxlQ2FsbGJhY2s7XG5jb25zdCBjYW5jZWxJZGxlQ2FsbGJhY2sgPSB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5jYW5jZWxJZGxlQ2FsbGJhY2sgJiYgc2VsZi5jYW5jZWxJZGxlQ2FsbGJhY2suYmluZCh3aW5kb3cpIHx8IGZ1bmN0aW9uKGlkKSB7XG4gICAgcmV0dXJuIGNsZWFyVGltZW91dChpZCk7XG59O1xuZXhwb3J0cy5jYW5jZWxJZGxlQ2FsbGJhY2sgPSBjYW5jZWxJZGxlQ2FsbGJhY2s7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlcXVlc3QtaWRsZS1jYWxsYmFjay5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuaW5pdFNjcmlwdExvYWRlciA9IGluaXRTY3JpcHRMb2FkZXI7XG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG52YXIgX3JlYWN0ID0gcmVxdWlyZShcInJlYWN0XCIpO1xudmFyIF9oZWFkTWFuYWdlckNvbnRleHQgPSByZXF1aXJlKFwiLi4vc2hhcmVkL2xpYi9oZWFkLW1hbmFnZXItY29udGV4dFwiKTtcbnZhciBfaGVhZE1hbmFnZXIgPSByZXF1aXJlKFwiLi9oZWFkLW1hbmFnZXJcIik7XG52YXIgX3JlcXVlc3RJZGxlQ2FsbGJhY2sgPSByZXF1aXJlKFwiLi9yZXF1ZXN0LWlkbGUtY2FsbGJhY2tcIik7XG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKGtleSBpbiBvYmopIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbn1cbmZ1bmN0aW9uIF9vYmplY3RTcHJlYWQodGFyZ2V0KSB7XG4gICAgZm9yKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0gIT0gbnVsbCA/IGFyZ3VtZW50c1tpXSA6IHtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG93bktleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpO1xuICAgICAgICBpZiAodHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgb3duS2V5cyA9IG93bktleXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlKS5maWx0ZXIoZnVuY3Rpb24oc3ltKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBzeW0pLmVudW1lcmFibGU7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgb3duS2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgX2RlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBzb3VyY2Vba2V5XSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuZnVuY3Rpb24gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKHNvdXJjZSwgZXhjbHVkZWQpIHtcbiAgICBpZiAoc291cmNlID09IG51bGwpIHJldHVybiB7XG4gICAgfTtcbiAgICB2YXIgdGFyZ2V0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2Uoc291cmNlLCBleGNsdWRlZCk7XG4gICAgdmFyIGtleSwgaTtcbiAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgICAgICB2YXIgc291cmNlU3ltYm9sS2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlKTtcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgc291cmNlU3ltYm9sS2V5cy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBrZXkgPSBzb3VyY2VTeW1ib2xLZXlzW2ldO1xuICAgICAgICAgICAgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHNvdXJjZSwga2V5KSkgY29udGludWU7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7XG4gICAgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge1xuICAgIH07XG4gICAgdmFyIHRhcmdldCA9IHtcbiAgICB9O1xuICAgIHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcbiAgICB2YXIga2V5LCBpO1xuICAgIGZvcihpID0gMDsgaSA8IHNvdXJjZUtleXMubGVuZ3RoOyBpKyspe1xuICAgICAgICBrZXkgPSBzb3VyY2VLZXlzW2ldO1xuICAgICAgICBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlO1xuICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuY29uc3QgU2NyaXB0Q2FjaGUgPSBuZXcgTWFwKCk7XG5jb25zdCBMb2FkQ2FjaGUgPSBuZXcgU2V0KCk7XG5jb25zdCBpZ25vcmVQcm9wcyA9IFtcbiAgICAnb25Mb2FkJyxcbiAgICAnZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwnLFxuICAgICdjaGlsZHJlbicsXG4gICAgJ29uRXJyb3InLFxuICAgICdzdHJhdGVneScsIFxuXTtcbmNvbnN0IGxvYWRTY3JpcHQgPSAocHJvcHMpPT57XG4gICAgY29uc3QgeyBzcmMgLCBpZCAsIG9uTG9hZCA9KCk9PntcbiAgICB9ICwgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwgLCBjaGlsZHJlbiA9JycgLCBzdHJhdGVneSA9J2FmdGVySW50ZXJhY3RpdmUnICwgb25FcnJvciAsICB9ID0gcHJvcHM7XG4gICAgY29uc3QgY2FjaGVLZXkgPSBpZCB8fCBzcmM7XG4gICAgLy8gU2NyaXB0IGhhcyBhbHJlYWR5IGxvYWRlZFxuICAgIGlmIChjYWNoZUtleSAmJiBMb2FkQ2FjaGUuaGFzKGNhY2hlS2V5KSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIENvbnRlbnRzIG9mIHRoaXMgc2NyaXB0IGFyZSBhbHJlYWR5IGxvYWRpbmcvbG9hZGVkXG4gICAgaWYgKFNjcmlwdENhY2hlLmhhcyhzcmMpKSB7XG4gICAgICAgIExvYWRDYWNoZS5hZGQoY2FjaGVLZXkpO1xuICAgICAgICAvLyBFeGVjdXRlIG9uTG9hZCBzaW5jZSB0aGUgc2NyaXB0IGxvYWRpbmcgaGFzIGJlZ3VuXG4gICAgICAgIFNjcmlwdENhY2hlLmdldChzcmMpLnRoZW4ob25Mb2FkLCBvbkVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIGNvbnN0IGxvYWRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIGlmIChvbkxvYWQpIHtcbiAgICAgICAgICAgICAgICBvbkxvYWQuY2FsbCh0aGlzLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICB9KTtcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChvbkVycm9yKSB7XG4gICAgICAgICAgICBvbkVycm9yKGUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHNyYykge1xuICAgICAgICBTY3JpcHRDYWNoZS5zZXQoc3JjLCBsb2FkUHJvbWlzZSk7XG4gICAgfVxuICAgIExvYWRDYWNoZS5hZGQoY2FjaGVLZXkpO1xuICAgIGlmIChkYW5nZXJvdXNseVNldElubmVySFRNTCkge1xuICAgICAgICBlbC5pbm5lckhUTUwgPSBkYW5nZXJvdXNseVNldElubmVySFRNTC5fX2h0bWwgfHwgJyc7XG4gICAgfSBlbHNlIGlmIChjaGlsZHJlbikge1xuICAgICAgICBlbC50ZXh0Q29udGVudCA9IHR5cGVvZiBjaGlsZHJlbiA9PT0gJ3N0cmluZycgPyBjaGlsZHJlbiA6IEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pID8gY2hpbGRyZW4uam9pbignJykgOiAnJztcbiAgICB9IGVsc2UgaWYgKHNyYykge1xuICAgICAgICBlbC5zcmMgPSBzcmM7XG4gICAgfVxuICAgIGZvciAoY29uc3QgW2ssIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwcm9wcykpe1xuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCBpZ25vcmVQcm9wcy5pbmNsdWRlcyhrKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXR0ciA9IF9oZWFkTWFuYWdlci5ET01BdHRyaWJ1dGVOYW1lc1trXSB8fCBrLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShhdHRyLCB2YWx1ZSk7XG4gICAgfVxuICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1uc2NyaXB0Jywgc3RyYXRlZ3kpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xufTtcbmZ1bmN0aW9uIGhhbmRsZUNsaWVudFNjcmlwdExvYWQocHJvcHMpIHtcbiAgICBjb25zdCB7IHN0cmF0ZWd5ID0nYWZ0ZXJJbnRlcmFjdGl2ZScgIH0gPSBwcm9wcztcbiAgICBpZiAoc3RyYXRlZ3kgPT09ICdhZnRlckludGVyYWN0aXZlJykge1xuICAgICAgICBsb2FkU2NyaXB0KHByb3BzKTtcbiAgICB9IGVsc2UgaWYgKHN0cmF0ZWd5ID09PSAnbGF6eU9ubG9hZCcpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKT0+e1xuICAgICAgICAgICAgKDAsIF9yZXF1ZXN0SWRsZUNhbGxiYWNrKS5yZXF1ZXN0SWRsZUNhbGxiYWNrKCgpPT5sb2FkU2NyaXB0KHByb3BzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gbG9hZExhenlTY3JpcHQocHJvcHMpIHtcbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAoMCwgX3JlcXVlc3RJZGxlQ2FsbGJhY2spLnJlcXVlc3RJZGxlQ2FsbGJhY2soKCk9PmxvYWRTY3JpcHQocHJvcHMpXG4gICAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKT0+e1xuICAgICAgICAgICAgKDAsIF9yZXF1ZXN0SWRsZUNhbGxiYWNrKS5yZXF1ZXN0SWRsZUNhbGxiYWNrKCgpPT5sb2FkU2NyaXB0KHByb3BzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gaW5pdFNjcmlwdExvYWRlcihzY3JpcHRMb2FkZXJJdGVtcykge1xuICAgIHNjcmlwdExvYWRlckl0ZW1zLmZvckVhY2goaGFuZGxlQ2xpZW50U2NyaXB0TG9hZCk7XG59XG5mdW5jdGlvbiBTY3JpcHQocHJvcHMpIHtcbiAgICBjb25zdCB7IHNyYyA9JycgLCBvbkxvYWQgPSgpPT57XG4gICAgfSAsIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MICwgc3RyYXRlZ3kgPSdhZnRlckludGVyYWN0aXZlJyAsIG9uRXJyb3IgIH0gPSBwcm9wcywgcmVzdFByb3BzID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzKHByb3BzLCBbXCJzcmNcIiwgXCJvbkxvYWRcIiwgXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiLCBcInN0cmF0ZWd5XCIsIFwib25FcnJvclwiXSk7XG4gICAgLy8gQ29udGV4dCBpcyBhdmFpbGFibGUgb25seSBkdXJpbmcgU1NSXG4gICAgY29uc3QgeyB1cGRhdGVTY3JpcHRzICwgc2NyaXB0cyAsIGdldElzU3NyICB9ID0gKDAsIF9yZWFjdCkudXNlQ29udGV4dChfaGVhZE1hbmFnZXJDb250ZXh0LkhlYWRNYW5hZ2VyQ29udGV4dCk7XG4gICAgKDAsIF9yZWFjdCkudXNlRWZmZWN0KCgpPT57XG4gICAgICAgIGlmIChzdHJhdGVneSA9PT0gJ2FmdGVySW50ZXJhY3RpdmUnKSB7XG4gICAgICAgICAgICBsb2FkU2NyaXB0KHByb3BzKTtcbiAgICAgICAgfSBlbHNlIGlmIChzdHJhdGVneSA9PT0gJ2xhenlPbmxvYWQnKSB7XG4gICAgICAgICAgICBsb2FkTGF6eVNjcmlwdChwcm9wcyk7XG4gICAgICAgIH1cbiAgICB9LCBbXG4gICAgICAgIHByb3BzLFxuICAgICAgICBzdHJhdGVneVxuICAgIF0pO1xuICAgIGlmIChzdHJhdGVneSA9PT0gJ2JlZm9yZUludGVyYWN0aXZlJykge1xuICAgICAgICBpZiAodXBkYXRlU2NyaXB0cykge1xuICAgICAgICAgICAgc2NyaXB0cy5iZWZvcmVJbnRlcmFjdGl2ZSA9IChzY3JpcHRzLmJlZm9yZUludGVyYWN0aXZlIHx8IFtdKS5jb25jYXQoW1xuICAgICAgICAgICAgICAgIF9vYmplY3RTcHJlYWQoe1xuICAgICAgICAgICAgICAgICAgICBzcmMsXG4gICAgICAgICAgICAgICAgICAgIG9uTG9hZCxcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvclxuICAgICAgICAgICAgICAgIH0sIHJlc3RQcm9wcyksIFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB1cGRhdGVTY3JpcHRzKHNjcmlwdHMpO1xuICAgICAgICB9IGVsc2UgaWYgKGdldElzU3NyICYmIGdldElzU3NyKCkpIHtcbiAgICAgICAgICAgIC8vIFNjcmlwdCBoYXMgYWxyZWFkeSBsb2FkZWQgZHVyaW5nIFNTUlxuICAgICAgICAgICAgTG9hZENhY2hlLmFkZChyZXN0UHJvcHMuaWQgfHwgc3JjKTtcbiAgICAgICAgfSBlbHNlIGlmIChnZXRJc1NzciAmJiAhZ2V0SXNTc3IoKSkge1xuICAgICAgICAgICAgbG9hZFNjcmlwdChwcm9wcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG52YXIgX2RlZmF1bHQgPSBTY3JpcHQ7XG5leHBvcnRzLmRlZmF1bHQgPSBfZGVmYXVsdDtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NyaXB0LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiRG9jdW1lbnRDb250ZXh0XCIsIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfdXRpbHMuRG9jdW1lbnRDb250ZXh0O1xuICAgIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiRG9jdW1lbnRJbml0aWFsUHJvcHNcIiwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF91dGlscy5Eb2N1bWVudEluaXRpYWxQcm9wcztcbiAgICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIkRvY3VtZW50UHJvcHNcIiwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF91dGlscy5Eb2N1bWVudFByb3BzO1xuICAgIH1cbn0pO1xuZXhwb3J0cy5IdG1sID0gSHRtbDtcbmV4cG9ydHMuTWFpbiA9IE1haW47XG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XG52YXIgX3JlYWN0ID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcInJlYWN0XCIpKTtcbnZhciBfc2VydmVyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwic3R5bGVkLWpzeC9zZXJ2ZXJcIikpO1xudmFyIF9jb25zdGFudHMgPSByZXF1aXJlKFwiLi4vc2hhcmVkL2xpYi9jb25zdGFudHNcIik7XG52YXIgX3V0aWxzID0gcmVxdWlyZShcIi4uL3NoYXJlZC9saWIvdXRpbHNcIik7XG52YXIgX2dldFBhZ2VGaWxlcyA9IHJlcXVpcmUoXCIuLi9zZXJ2ZXIvZ2V0LXBhZ2UtZmlsZXNcIik7XG52YXIgX3V0aWxzMSA9IHJlcXVpcmUoXCIuLi9zZXJ2ZXIvdXRpbHNcIik7XG52YXIgX2h0bWxlc2NhcGUgPSByZXF1aXJlKFwiLi4vc2VydmVyL2h0bWxlc2NhcGVcIik7XG52YXIgX3NjcmlwdCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL2NsaWVudC9zY3JpcHRcIikpO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgICByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDoge1xuICAgICAgICBkZWZhdWx0OiBvYmpcbiAgICB9O1xufVxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQob2JqKSB7XG4gICAgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdPYmogPSB7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChvYmogIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqKXtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSkgOiB7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld09iaiwga2V5LCBkZXNjKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09ialtrZXldID0gb2JqW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbmV3T2JqLmRlZmF1bHQgPSBvYmo7XG4gICAgICAgIHJldHVybiBuZXdPYmo7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0RG9jdW1lbnRGaWxlcyhidWlsZE1hbmlmZXN0LCBwYXRobmFtZSwgaW5BbXBNb2RlKSB7XG4gICAgY29uc3Qgc2hhcmVkRmlsZXMgPSAoMCwgX2dldFBhZ2VGaWxlcykuZ2V0UGFnZUZpbGVzKGJ1aWxkTWFuaWZlc3QsICcvX2FwcCcpO1xuICAgIGNvbnN0IHBhZ2VGaWxlcyA9IGluQW1wTW9kZSA/IFtdIDogKDAsIF9nZXRQYWdlRmlsZXMpLmdldFBhZ2VGaWxlcyhidWlsZE1hbmlmZXN0LCBwYXRobmFtZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2hhcmVkRmlsZXMsXG4gICAgICAgIHBhZ2VGaWxlcyxcbiAgICAgICAgYWxsRmlsZXM6IFtcbiAgICAgICAgICAgIC4uLm5ldyBTZXQoW1xuICAgICAgICAgICAgICAgIC4uLnNoYXJlZEZpbGVzLFxuICAgICAgICAgICAgICAgIC4uLnBhZ2VGaWxlc1xuICAgICAgICAgICAgXSlcbiAgICAgICAgXVxuICAgIH07XG59XG5mdW5jdGlvbiBnZXRQb2x5ZmlsbFNjcmlwdHMoY29udGV4dCwgcHJvcHMpIHtcbiAgICAvLyBwb2x5ZmlsbHMuanMgaGFzIHRvIGJlIHJlbmRlcmVkIGFzIG5vbW9kdWxlIHdpdGhvdXQgYXN5bmNcbiAgICAvLyBJdCBhbHNvIGhhcyB0byBiZSB0aGUgZmlyc3Qgc2NyaXB0IHRvIGxvYWRcbiAgICBjb25zdCB7IGFzc2V0UHJlZml4ICwgYnVpbGRNYW5pZmVzdCAsIGRldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nICwgZGlzYWJsZU9wdGltaXplZExvYWRpbmcgLCAgfSA9IGNvbnRleHQ7XG4gICAgcmV0dXJuIGJ1aWxkTWFuaWZlc3QucG9seWZpbGxGaWxlcy5maWx0ZXIoKHBvbHlmaWxsKT0+cG9seWZpbGwuZW5kc1dpdGgoJy5qcycpICYmICFwb2x5ZmlsbC5lbmRzV2l0aCgnLm1vZHVsZS5qcycpXG4gICAgKS5tYXAoKHBvbHlmaWxsKT0+LyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIsIHtcbiAgICAgICAgICAgIGtleTogcG9seWZpbGwsXG4gICAgICAgICAgICBkZWZlcjogIWRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nLFxuICAgICAgICAgICAgbm9uY2U6IHByb3BzLm5vbmNlLFxuICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHByb3BzLmNyb3NzT3JpZ2luIHx8IHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU4sXG4gICAgICAgICAgICBub01vZHVsZTogdHJ1ZSxcbiAgICAgICAgICAgIHNyYzogYCR7YXNzZXRQcmVmaXh9L19uZXh0LyR7cG9seWZpbGx9JHtkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZ31gXG4gICAgICAgIH0pXG4gICAgKTtcbn1cbmZ1bmN0aW9uIGdldFByZU5leHRTY3JpcHRzKGNvbnRleHQsIHByb3BzKSB7XG4gICAgY29uc3QgeyBzY3JpcHRMb2FkZXIgLCBkaXNhYmxlT3B0aW1pemVkTG9hZGluZyAgfSA9IGNvbnRleHQ7XG4gICAgcmV0dXJuIChzY3JpcHRMb2FkZXIuYmVmb3JlSW50ZXJhY3RpdmUgfHwgW10pLm1hcCgoZmlsZSwgaW5kZXgpPT57XG4gICAgICAgIGNvbnN0IHsgc3RyYXRlZ3kgLCAuLi5zY3JpcHRQcm9wcyB9ID0gZmlsZTtcbiAgICAgICAgcmV0dXJuKC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiLCBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgfSwgc2NyaXB0UHJvcHMsIHtcbiAgICAgICAgICAgIGtleTogc2NyaXB0UHJvcHMuc3JjIHx8IGluZGV4LFxuICAgICAgICAgICAgZGVmZXI6ICFkaXNhYmxlT3B0aW1pemVkTG9hZGluZyxcbiAgICAgICAgICAgIG5vbmNlOiBwcm9wcy5ub25jZSxcbiAgICAgICAgICAgIFwiZGF0YS1uc2NyaXB0XCI6IFwiYmVmb3JlSW50ZXJhY3RpdmVcIixcbiAgICAgICAgICAgIGNyb3NzT3JpZ2luOiBwcm9wcy5jcm9zc09yaWdpbiB8fCBwcm9jZXNzLmVudi5fX05FWFRfQ1JPU1NfT1JJR0lOXG4gICAgICAgIH0pKSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXREeW5hbWljQ2h1bmtzKGNvbnRleHQsIHByb3BzLCBmaWxlcykge1xuICAgIGNvbnN0IHsgZHluYW1pY0ltcG9ydHMgLCBhc3NldFByZWZpeCAsIGlzRGV2ZWxvcG1lbnQgLCBkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZyAsIGRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nICwgIH0gPSBjb250ZXh0O1xuICAgIHJldHVybiBkeW5hbWljSW1wb3J0cy5tYXAoKGZpbGUpPT57XG4gICAgICAgIGlmICghZmlsZS5lbmRzV2l0aCgnLmpzJykgfHwgZmlsZXMuYWxsRmlsZXMuaW5jbHVkZXMoZmlsZSkpIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4oLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIsIHtcbiAgICAgICAgICAgIGFzeW5jOiAhaXNEZXZlbG9wbWVudCAmJiBkaXNhYmxlT3B0aW1pemVkTG9hZGluZyxcbiAgICAgICAgICAgIGRlZmVyOiAhZGlzYWJsZU9wdGltaXplZExvYWRpbmcsXG4gICAgICAgICAgICBrZXk6IGZpbGUsXG4gICAgICAgICAgICBzcmM6IGAke2Fzc2V0UHJlZml4fS9fbmV4dC8ke2VuY29kZVVSSShmaWxlKX0ke2Rldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nfWAsXG4gICAgICAgICAgICBub25jZTogcHJvcHMubm9uY2UsXG4gICAgICAgICAgICBjcm9zc09yaWdpbjogcHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTlxuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRTY3JpcHRzKGNvbnRleHQsIHByb3BzLCBmaWxlcykge1xuICAgIHZhciByZWY7XG4gICAgY29uc3QgeyBhc3NldFByZWZpeCAsIGJ1aWxkTWFuaWZlc3QgLCBpc0RldmVsb3BtZW50ICwgZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmcgLCBkaXNhYmxlT3B0aW1pemVkTG9hZGluZyAsICB9ID0gY29udGV4dDtcbiAgICBjb25zdCBub3JtYWxTY3JpcHRzID0gZmlsZXMuYWxsRmlsZXMuZmlsdGVyKChmaWxlKT0+ZmlsZS5lbmRzV2l0aCgnLmpzJylcbiAgICApO1xuICAgIGNvbnN0IGxvd1ByaW9yaXR5U2NyaXB0cyA9IChyZWYgPSBidWlsZE1hbmlmZXN0Lmxvd1ByaW9yaXR5RmlsZXMpID09PSBudWxsIHx8IHJlZiA9PT0gdm9pZCAwID8gdm9pZCAwIDogcmVmLmZpbHRlcigoZmlsZSk9PmZpbGUuZW5kc1dpdGgoJy5qcycpXG4gICAgKTtcbiAgICByZXR1cm4gW1xuICAgICAgICAuLi5ub3JtYWxTY3JpcHRzLFxuICAgICAgICAuLi5sb3dQcmlvcml0eVNjcmlwdHNcbiAgICBdLm1hcCgoZmlsZSk9PntcbiAgICAgICAgcmV0dXJuKC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiLCB7XG4gICAgICAgICAgICBrZXk6IGZpbGUsXG4gICAgICAgICAgICBzcmM6IGAke2Fzc2V0UHJlZml4fS9fbmV4dC8ke2VuY29kZVVSSShmaWxlKX0ke2Rldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nfWAsXG4gICAgICAgICAgICBub25jZTogcHJvcHMubm9uY2UsXG4gICAgICAgICAgICBhc3luYzogIWlzRGV2ZWxvcG1lbnQgJiYgZGlzYWJsZU9wdGltaXplZExvYWRpbmcsXG4gICAgICAgICAgICBkZWZlcjogIWRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nLFxuICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHByb3BzLmNyb3NzT3JpZ2luIHx8IHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU5cbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuY2xhc3MgRG9jdW1lbnQxIGV4dGVuZHMgX3JlYWN0LkNvbXBvbmVudCB7XG4gICAgLyoqXG4gICAqIGBnZXRJbml0aWFsUHJvcHNgIGhvb2sgcmV0dXJucyB0aGUgY29udGV4dCBvYmplY3Qgd2l0aCB0aGUgYWRkaXRpb24gb2YgYHJlbmRlclBhZ2VgLlxuICAgKiBgcmVuZGVyUGFnZWAgY2FsbGJhY2sgZXhlY3V0ZXMgYFJlYWN0YCByZW5kZXJpbmcgbG9naWMgc3luY2hyb25vdXNseSB0byBzdXBwb3J0IHNlcnZlci1yZW5kZXJpbmcgd3JhcHBlcnNcbiAgICovIHN0YXRpYyBhc3luYyBnZXRJbml0aWFsUHJvcHMoY3R4KSB7XG4gICAgICAgIGNvbnN0IGVuaGFuY2VBcHAgPSAoQXBwKT0+e1xuICAgICAgICAgICAgcmV0dXJuIChwcm9wcyk9Pi8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChBcHAsIE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgICAgIH0sIHByb3BzKSlcbiAgICAgICAgICAgIDtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgeyBodG1sICwgaGVhZCAgfSA9IGF3YWl0IGN0eC5yZW5kZXJQYWdlKHtcbiAgICAgICAgICAgIGVuaGFuY2VBcHBcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHN0eWxlcyA9IFtcbiAgICAgICAgICAgIC4uLigwLCBfc2VydmVyKS5kZWZhdWx0KClcbiAgICAgICAgXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGh0bWwsXG4gICAgICAgICAgICBoZWFkLFxuICAgICAgICAgICAgc3R5bGVzXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuKC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChIdG1sLCBudWxsLCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoSGVhZCwgbnVsbCksIC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImJvZHlcIiwgbnVsbCwgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KE1haW4sIG51bGwpLCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoTmV4dFNjcmlwdCwgbnVsbCkpKSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gRG9jdW1lbnQxO1xuZnVuY3Rpb24gSHRtbChwcm9wcykge1xuICAgIGNvbnN0IHsgaW5BbXBNb2RlICwgZG9jQ29tcG9uZW50c1JlbmRlcmVkICwgbG9jYWxlICB9ID0gKDAsIF9yZWFjdCkudXNlQ29udGV4dChfdXRpbHMuSHRtbENvbnRleHQpO1xuICAgIGRvY0NvbXBvbmVudHNSZW5kZXJlZC5IdG1sID0gdHJ1ZTtcbiAgICByZXR1cm4oLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaHRtbFwiLCBPYmplY3QuYXNzaWduKHtcbiAgICB9LCBwcm9wcywge1xuICAgICAgICBsYW5nOiBwcm9wcy5sYW5nIHx8IGxvY2FsZSB8fCB1bmRlZmluZWQsXG4gICAgICAgIGFtcDogaW5BbXBNb2RlID8gJycgOiB1bmRlZmluZWQsXG4gICAgICAgIFwiZGF0YS1hbXBkZXZtb2RlXCI6IGluQW1wTW9kZSAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gJycgOiB1bmRlZmluZWRcbiAgICB9KSkpO1xufVxuY2xhc3MgSGVhZCBleHRlbmRzIF9yZWFjdC5Db21wb25lbnQge1xuICAgIGdldENzc0xpbmtzKGZpbGVzKSB7XG4gICAgICAgIGNvbnN0IHsgYXNzZXRQcmVmaXggLCBkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZyAsIGR5bmFtaWNJbXBvcnRzICB9ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICBjb25zdCBjc3NGaWxlcyA9IGZpbGVzLmFsbEZpbGVzLmZpbHRlcigoZik9PmYuZW5kc1dpdGgoJy5jc3MnKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBzaGFyZWRGaWxlcyA9IG5ldyBTZXQoZmlsZXMuc2hhcmVkRmlsZXMpO1xuICAgICAgICAvLyBVbm1hbmFnZWQgZmlsZXMgYXJlIENTUyBmaWxlcyB0aGF0IHdpbGwgYmUgaGFuZGxlZCBkaXJlY3RseSBieSB0aGVcbiAgICAgICAgLy8gd2VicGFjayBydW50aW1lIChgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5gKS5cbiAgICAgICAgbGV0IHVubWFuZ2VkRmlsZXMgPSBuZXcgU2V0KFtdKTtcbiAgICAgICAgbGV0IGR5bmFtaWNDc3NGaWxlcyA9IEFycmF5LmZyb20obmV3IFNldChkeW5hbWljSW1wb3J0cy5maWx0ZXIoKGZpbGUpPT5maWxlLmVuZHNXaXRoKCcuY3NzJylcbiAgICAgICAgKSkpO1xuICAgICAgICBpZiAoZHluYW1pY0Nzc0ZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBuZXcgU2V0KGNzc0ZpbGVzKTtcbiAgICAgICAgICAgIGR5bmFtaWNDc3NGaWxlcyA9IGR5bmFtaWNDc3NGaWxlcy5maWx0ZXIoKGYpPT4hKGV4aXN0aW5nLmhhcyhmKSB8fCBzaGFyZWRGaWxlcy5oYXMoZikpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdW5tYW5nZWRGaWxlcyA9IG5ldyBTZXQoZHluYW1pY0Nzc0ZpbGVzKTtcbiAgICAgICAgICAgIGNzc0ZpbGVzLnB1c2goLi4uZHluYW1pY0Nzc0ZpbGVzKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3NzTGlua0VsZW1lbnRzID0gW107XG4gICAgICAgIGNzc0ZpbGVzLmZvckVhY2goKGZpbGUpPT57XG4gICAgICAgICAgICBjb25zdCBpc1NoYXJlZEZpbGUgPSBzaGFyZWRGaWxlcy5oYXMoZmlsZSk7XG4gICAgICAgICAgICBpZiAoIXByb2Nlc3MuZW52Ll9fTkVYVF9PUFRJTUlaRV9DU1MpIHtcbiAgICAgICAgICAgICAgICBjc3NMaW5rRWxlbWVudHMucHVzaCgvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIsIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBgJHtmaWxlfS1wcmVsb2FkYCxcbiAgICAgICAgICAgICAgICAgICAgbm9uY2U6IHRoaXMucHJvcHMubm9uY2UsXG4gICAgICAgICAgICAgICAgICAgIHJlbDogXCJwcmVsb2FkXCIsXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IGAke2Fzc2V0UHJlZml4fS9fbmV4dC8ke2VuY29kZVVSSShmaWxlKX0ke2Rldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nfWAsXG4gICAgICAgICAgICAgICAgICAgIGFzOiBcInN0eWxlXCIsXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiB0aGlzLnByb3BzLmNyb3NzT3JpZ2luIHx8IHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU5cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpc1VubWFuYWdlZEZpbGUgPSB1bm1hbmdlZEZpbGVzLmhhcyhmaWxlKTtcbiAgICAgICAgICAgIGNzc0xpbmtFbGVtZW50cy5wdXNoKC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImxpbmtcIiwge1xuICAgICAgICAgICAgICAgIGtleTogZmlsZSxcbiAgICAgICAgICAgICAgICBub25jZTogdGhpcy5wcm9wcy5ub25jZSxcbiAgICAgICAgICAgICAgICByZWw6IFwic3R5bGVzaGVldFwiLFxuICAgICAgICAgICAgICAgIGhyZWY6IGAke2Fzc2V0UHJlZml4fS9fbmV4dC8ke2VuY29kZVVSSShmaWxlKX0ke2Rldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nfWAsXG4gICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTixcbiAgICAgICAgICAgICAgICBcImRhdGEtbi1nXCI6IGlzVW5tYW5hZ2VkRmlsZSA/IHVuZGVmaW5lZCA6IGlzU2hhcmVkRmlsZSA/ICcnIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIFwiZGF0YS1uLXBcIjogaXNVbm1hbmFnZWRGaWxlID8gdW5kZWZpbmVkIDogaXNTaGFyZWRGaWxlID8gdW5kZWZpbmVkIDogJydcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ2RldmVsb3BtZW50JyAmJiBwcm9jZXNzLmVudi5fX05FWFRfT1BUSU1JWkVfRk9OVFMpIHtcbiAgICAgICAgICAgIGNzc0xpbmtFbGVtZW50cyA9IHRoaXMubWFrZVN0eWxlc2hlZXRJbmVydChjc3NMaW5rRWxlbWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjc3NMaW5rRWxlbWVudHMubGVuZ3RoID09PSAwID8gbnVsbCA6IGNzc0xpbmtFbGVtZW50cztcbiAgICB9XG4gICAgZ2V0UHJlbG9hZER5bmFtaWNDaHVua3MoKSB7XG4gICAgICAgIGNvbnN0IHsgZHluYW1pY0ltcG9ydHMgLCBhc3NldFByZWZpeCAsIGRldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nICB9ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICByZXR1cm4gZHluYW1pY0ltcG9ydHMubWFwKChmaWxlKT0+e1xuICAgICAgICAgICAgaWYgKCFmaWxlLmVuZHNXaXRoKCcuanMnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuKC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImxpbmtcIiwge1xuICAgICAgICAgICAgICAgIHJlbDogXCJwcmVsb2FkXCIsXG4gICAgICAgICAgICAgICAga2V5OiBmaWxlLFxuICAgICAgICAgICAgICAgIGhyZWY6IGAke2Fzc2V0UHJlZml4fS9fbmV4dC8ke2VuY29kZVVSSShmaWxlKX0ke2Rldk9ubHlDYWNoZUJ1c3RlclF1ZXJ5U3RyaW5nfWAsXG4gICAgICAgICAgICAgICAgYXM6IFwic2NyaXB0XCIsXG4gICAgICAgICAgICAgICAgbm9uY2U6IHRoaXMucHJvcHMubm9uY2UsXG4gICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTlxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KS8vIEZpbHRlciBvdXQgbnVsbGVkIHNjcmlwdHNcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcbiAgICB9XG4gICAgZ2V0UHJlbG9hZE1haW5MaW5rcyhmaWxlcykge1xuICAgICAgICBjb25zdCB7IGFzc2V0UHJlZml4ICwgZGV2T25seUNhY2hlQnVzdGVyUXVlcnlTdHJpbmcgLCBzY3JpcHRMb2FkZXIgIH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIGNvbnN0IHByZWxvYWRGaWxlcyA9IGZpbGVzLmFsbEZpbGVzLmZpbHRlcigoZmlsZSk9PntcbiAgICAgICAgICAgIHJldHVybiBmaWxlLmVuZHNXaXRoKCcuanMnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAuLi4oc2NyaXB0TG9hZGVyLmJlZm9yZUludGVyYWN0aXZlIHx8IFtdKS5tYXAoKGZpbGUpPT4vKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIsIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBmaWxlLnNyYyxcbiAgICAgICAgICAgICAgICAgICAgbm9uY2U6IHRoaXMucHJvcHMubm9uY2UsXG4gICAgICAgICAgICAgICAgICAgIHJlbDogXCJwcmVsb2FkXCIsXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IGZpbGUuc3JjLFxuICAgICAgICAgICAgICAgICAgICBhczogXCJzY3JpcHRcIixcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTlxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgLi4ucHJlbG9hZEZpbGVzLm1hcCgoZmlsZSk9Pi8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImxpbmtcIiwge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGZpbGUsXG4gICAgICAgICAgICAgICAgICAgIG5vbmNlOiB0aGlzLnByb3BzLm5vbmNlLFxuICAgICAgICAgICAgICAgICAgICByZWw6IFwicHJlbG9hZFwiLFxuICAgICAgICAgICAgICAgICAgICBocmVmOiBgJHthc3NldFByZWZpeH0vX25leHQvJHtlbmNvZGVVUkkoZmlsZSl9JHtkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZ31gLFxuICAgICAgICAgICAgICAgICAgICBhczogXCJzY3JpcHRcIixcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTlxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApLCBcbiAgICAgICAgXTtcbiAgICB9XG4gICAgZ2V0RHluYW1pY0NodW5rcyhmaWxlcykge1xuICAgICAgICByZXR1cm4gZ2V0RHluYW1pY0NodW5rcyh0aGlzLmNvbnRleHQsIHRoaXMucHJvcHMsIGZpbGVzKTtcbiAgICB9XG4gICAgZ2V0UHJlTmV4dFNjcmlwdHMoKSB7XG4gICAgICAgIHJldHVybiBnZXRQcmVOZXh0U2NyaXB0cyh0aGlzLmNvbnRleHQsIHRoaXMucHJvcHMpO1xuICAgIH1cbiAgICBnZXRTY3JpcHRzKGZpbGVzKSB7XG4gICAgICAgIHJldHVybiBnZXRTY3JpcHRzKHRoaXMuY29udGV4dCwgdGhpcy5wcm9wcywgZmlsZXMpO1xuICAgIH1cbiAgICBnZXRQb2x5ZmlsbFNjcmlwdHMoKSB7XG4gICAgICAgIHJldHVybiBnZXRQb2x5ZmlsbFNjcmlwdHModGhpcy5jb250ZXh0LCB0aGlzLnByb3BzKTtcbiAgICB9XG4gICAgaGFuZGxlRG9jdW1lbnRTY3JpcHRMb2FkZXJJdGVtcyhjaGlsZHJlbikge1xuICAgICAgICBjb25zdCB7IHNjcmlwdExvYWRlciAgfSA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgY29uc3Qgc2NyaXB0TG9hZGVySXRlbXMgPSBbXTtcbiAgICAgICAgY29uc3QgZmlsdGVyZWRDaGlsZHJlbiA9IFtdO1xuICAgICAgICBfcmVhY3QuZGVmYXVsdC5DaGlsZHJlbi5mb3JFYWNoKGNoaWxkcmVuLCAoY2hpbGQpPT57XG4gICAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gX3NjcmlwdC5kZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnByb3BzLnN0cmF0ZWd5ID09PSAnYmVmb3JlSW50ZXJhY3RpdmUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdExvYWRlci5iZWZvcmVJbnRlcmFjdGl2ZSA9IChzY3JpcHRMb2FkZXIuYmVmb3JlSW50ZXJhY3RpdmUgfHwgW10pLmNvbmNhdChbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uY2hpbGQucHJvcHNcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoW1xuICAgICAgICAgICAgICAgICAgICAnbGF6eU9ubG9hZCcsXG4gICAgICAgICAgICAgICAgICAgICdhZnRlckludGVyYWN0aXZlJ1xuICAgICAgICAgICAgICAgIF0uaW5jbHVkZXMoY2hpbGQucHJvcHMuc3RyYXRlZ3kpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcmlwdExvYWRlckl0ZW1zLnB1c2goY2hpbGQucHJvcHMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsdGVyZWRDaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5fX05FWFRfREFUQV9fLnNjcmlwdExvYWRlciA9IHNjcmlwdExvYWRlckl0ZW1zO1xuICAgICAgICByZXR1cm4gZmlsdGVyZWRDaGlsZHJlbjtcbiAgICB9XG4gICAgbWFrZVN0eWxlc2hlZXRJbmVydChub2RlKSB7XG4gICAgICAgIHJldHVybiBfcmVhY3QuZGVmYXVsdC5DaGlsZHJlbi5tYXAobm9kZSwgKGMpPT57XG4gICAgICAgICAgICBpZiAoYy50eXBlID09PSAnbGluaycgJiYgYy5wcm9wc1snaHJlZiddICYmIF9jb25zdGFudHMuT1BUSU1JWkVEX0ZPTlRfUFJPVklERVJTLnNvbWUoKHsgdXJsICB9KT0+Yy5wcm9wc1snaHJlZiddLnN0YXJ0c1dpdGgodXJsKVxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Byb3BzID0ge1xuICAgICAgICAgICAgICAgICAgICAuLi5jLnByb3BzIHx8IHtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbmV3UHJvcHNbJ2RhdGEtaHJlZiddID0gbmV3UHJvcHNbJ2hyZWYnXTtcbiAgICAgICAgICAgICAgICBuZXdQcm9wc1snaHJlZiddID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHJldHVybigvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNsb25lRWxlbWVudChjLCBuZXdQcm9wcykpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjLnByb3BzICYmIGMucHJvcHNbJ2NoaWxkcmVuJ10pIHtcbiAgICAgICAgICAgICAgICBjLnByb3BzWydjaGlsZHJlbiddID0gdGhpcy5tYWtlU3R5bGVzaGVldEluZXJ0KGMucHJvcHNbJ2NoaWxkcmVuJ10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgc3R5bGVzICwgYW1wUGF0aCAsIGluQW1wTW9kZSAsIGh5YnJpZEFtcCAsIGNhbm9uaWNhbEJhc2UgLCBfX05FWFRfREFUQV9fICwgZGFuZ2Vyb3VzQXNQYXRoICwgaGVhZFRhZ3MgLCB1bnN0YWJsZV9ydW50aW1lSlMgLCB1bnN0YWJsZV9Kc1ByZWxvYWQgLCBkaXNhYmxlT3B0aW1pemVkTG9hZGluZyAsICB9ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICBjb25zdCBkaXNhYmxlUnVudGltZUpTID0gdW5zdGFibGVfcnVudGltZUpTID09PSBmYWxzZTtcbiAgICAgICAgY29uc3QgZGlzYWJsZUpzUHJlbG9hZCA9IHVuc3RhYmxlX0pzUHJlbG9hZCA9PT0gZmFsc2UgfHwgIWRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nO1xuICAgICAgICB0aGlzLmNvbnRleHQuZG9jQ29tcG9uZW50c1JlbmRlcmVkLkhlYWQgPSB0cnVlO1xuICAgICAgICBsZXQgeyBoZWFkICB9ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICBsZXQgY3NzUHJlbG9hZHMgPSBbXTtcbiAgICAgICAgbGV0IG90aGVySGVhZEVsZW1lbnRzID0gW107XG4gICAgICAgIGlmIChoZWFkKSB7XG4gICAgICAgICAgICBoZWFkLmZvckVhY2goKGMpPT57XG4gICAgICAgICAgICAgICAgaWYgKGMgJiYgYy50eXBlID09PSAnbGluaycgJiYgYy5wcm9wc1sncmVsJ10gPT09ICdwcmVsb2FkJyAmJiBjLnByb3BzWydhcyddID09PSAnc3R5bGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNzc1ByZWxvYWRzLnB1c2goYyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYyAmJiBvdGhlckhlYWRFbGVtZW50cy5wdXNoKGMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaGVhZCA9IGNzc1ByZWxvYWRzLmNvbmNhdChvdGhlckhlYWRFbGVtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNoaWxkcmVuID0gX3JlYWN0LmRlZmF1bHQuQ2hpbGRyZW4udG9BcnJheSh0aGlzLnByb3BzLmNoaWxkcmVuKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgICAgIC8vIHNob3cgYSB3YXJuaW5nIGlmIEhlYWQgY29udGFpbnMgPHRpdGxlPiAob25seSBpbiBkZXZlbG9wbWVudClcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGNoaWxkcmVuID0gX3JlYWN0LmRlZmF1bHQuQ2hpbGRyZW4ubWFwKGNoaWxkcmVuLCAoY2hpbGQpPT57XG4gICAgICAgICAgICAgICAgdmFyIHJlZjtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1JlYWN0SGVsbWV0ID0gY2hpbGQgPT09IG51bGwgfHwgY2hpbGQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChyZWYgPSBjaGlsZC5wcm9wcykgPT09IG51bGwgfHwgcmVmID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZWZbJ2RhdGEtcmVhY3QtaGVsbWV0J107XG4gICAgICAgICAgICAgICAgaWYgKCFpc1JlYWN0SGVsbWV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWYxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGNoaWxkID09PSBudWxsIHx8IGNoaWxkID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjaGlsZC50eXBlKSA9PT0gJ3RpdGxlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogPHRpdGxlPiBzaG91bGQgbm90IGJlIHVzZWQgaW4gX2RvY3VtZW50LmpzJ3MgPEhlYWQ+LiBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9uby1kb2N1bWVudC10aXRsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoY2hpbGQgPT09IG51bGwgfHwgY2hpbGQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNoaWxkLnR5cGUpID09PSAnbWV0YScgJiYgKGNoaWxkID09PSBudWxsIHx8IGNoaWxkID09PSB2b2lkIDAgPyB2b2lkIDAgOiAocmVmMSA9IGNoaWxkLnByb3BzKSA9PT0gbnVsbCB8fCByZWYxID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZWYxLm5hbWUpID09PSAndmlld3BvcnQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiB2aWV3cG9ydCBtZXRhIHRhZ3Mgc2hvdWxkIG5vdCBiZSB1c2VkIGluIF9kb2N1bWVudC5qcydzIDxIZWFkPi4gaHR0cHM6Ly9uZXh0anMub3JnL2RvY3MvbWVzc2FnZXMvbm8tZG9jdW1lbnQtdmlld3BvcnQtbWV0YVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmNyb3NzT3JpZ2luKSBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IGBIZWFkYCBhdHRyaWJ1dGUgYGNyb3NzT3JpZ2luYCBpcyBkZXByZWNhdGVkLiBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9kb2MtY3Jvc3NvcmlnaW4tZGVwcmVjYXRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ2RldmVsb3BtZW50JyAmJiBwcm9jZXNzLmVudi5fX05FWFRfT1BUSU1JWkVfRk9OVFMgJiYgIWluQW1wTW9kZSkge1xuICAgICAgICAgICAgY2hpbGRyZW4gPSB0aGlzLm1ha2VTdHlsZXNoZWV0SW5lcnQoY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICAgIGNoaWxkcmVuID0gdGhpcy5oYW5kbGVEb2N1bWVudFNjcmlwdExvYWRlckl0ZW1zKGNoaWxkcmVuKTtcbiAgICAgICAgbGV0IGhhc0FtcGh0bWxSZWwgPSBmYWxzZTtcbiAgICAgICAgbGV0IGhhc0Nhbm9uaWNhbFJlbCA9IGZhbHNlO1xuICAgICAgICAvLyBzaG93IHdhcm5pbmcgYW5kIHJlbW92ZSBjb25mbGljdGluZyBhbXAgaGVhZCB0YWdzXG4gICAgICAgIGhlYWQgPSBfcmVhY3QuZGVmYXVsdC5DaGlsZHJlbi5tYXAoaGVhZCB8fCBbXSwgKGNoaWxkKT0+e1xuICAgICAgICAgICAgaWYgKCFjaGlsZCkgcmV0dXJuIGNoaWxkO1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlICwgcHJvcHMgIH0gPSBjaGlsZDtcbiAgICAgICAgICAgIGlmIChpbkFtcE1vZGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmFkUHJvcCA9ICcnO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnbWV0YScgJiYgcHJvcHMubmFtZSA9PT0gJ3ZpZXdwb3J0Jykge1xuICAgICAgICAgICAgICAgICAgICBiYWRQcm9wID0gJ25hbWU9XCJ2aWV3cG9ydFwiJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdsaW5rJyAmJiBwcm9wcy5yZWwgPT09ICdjYW5vbmljYWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc0Nhbm9uaWNhbFJlbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnc2NyaXB0Jykge1xuICAgICAgICAgICAgICAgICAgICAvLyBvbmx5IGJsb2NrIGlmXG4gICAgICAgICAgICAgICAgICAgIC8vIDEuIGl0IGhhcyBhIHNyYyBhbmQgaXNuJ3QgcG9pbnRpbmcgdG8gYW1wcHJvamVjdCdzIENETlxuICAgICAgICAgICAgICAgICAgICAvLyAyLiBpdCBpcyB1c2luZyBkYW5nZXJvdXNseVNldElubmVySFRNTCB3aXRob3V0IGEgdHlwZSBvclxuICAgICAgICAgICAgICAgICAgICAvLyBhIHR5cGUgb2YgdGV4dC9qYXZhc2NyaXB0XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wcy5zcmMgJiYgcHJvcHMuc3JjLmluZGV4T2YoJ2FtcHByb2plY3QnKSA8IC0xIHx8IHByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MICYmICghcHJvcHMudHlwZSB8fCBwcm9wcy50eXBlID09PSAndGV4dC9qYXZhc2NyaXB0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhZFByb3AgPSAnPHNjcmlwdCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhwcm9wcykuZm9yRWFjaCgocHJvcCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRQcm9wICs9IGAgJHtwcm9wfT1cIiR7cHJvcHNbcHJvcF19XCJgO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWRQcm9wICs9ICcvPic7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJhZFByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBGb3VuZCBjb25mbGljdGluZyBhbXAgdGFnIFwiJHtjaGlsZC50eXBlfVwiIHdpdGggY29uZmxpY3RpbmcgcHJvcCAke2JhZFByb3B9IGluICR7X19ORVhUX0RBVEFfXy5wYWdlfS4gaHR0cHM6Ly9uZXh0anMub3JnL2RvY3MvbWVzc2FnZXMvY29uZmxpY3RpbmctYW1wLXRhZ2ApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vbi1hbXAgbW9kZVxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnbGluaycgJiYgcHJvcHMucmVsID09PSAnYW1waHRtbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFzQW1waHRtbFJlbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gdHJ5IHRvIHBhcnNlIHN0eWxlcyBmcm9tIGZyYWdtZW50IGZvciBiYWNrd2FyZHMgY29tcGF0XG4gICAgICAgIGNvbnN0IGN1clN0eWxlcyA9IEFycmF5LmlzQXJyYXkoc3R5bGVzKSA/IHN0eWxlcyA6IFtdO1xuICAgICAgICBpZiAoaW5BbXBNb2RlICYmIHN0eWxlcyAmJiAvLyBAdHMtaWdub3JlIFByb3BlcnR5ICdwcm9wcycgZG9lcyBub3QgZXhpc3Qgb24gdHlwZSBSZWFjdEVsZW1lbnRcbiAgICAgICAgc3R5bGVzLnByb3BzICYmIC8vIEB0cy1pZ25vcmUgUHJvcGVydHkgJ3Byb3BzJyBkb2VzIG5vdCBleGlzdCBvbiB0eXBlIFJlYWN0RWxlbWVudFxuICAgICAgICBBcnJheS5pc0FycmF5KHN0eWxlcy5wcm9wcy5jaGlsZHJlbikpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc1N0eWxlcyA9IChlbCk9PntcbiAgICAgICAgICAgICAgICB2YXIgcmVmMiwgcmVmMztcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwgPT09IG51bGwgfHwgZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChyZWYyID0gZWwucHJvcHMpID09PSBudWxsIHx8IHJlZjIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChyZWYzID0gcmVmMi5kYW5nZXJvdXNseVNldElubmVySFRNTCkgPT09IG51bGwgfHwgcmVmMyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcmVmMy5fX2h0bWw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBQcm9wZXJ0eSAncHJvcHMnIGRvZXMgbm90IGV4aXN0IG9uIHR5cGUgUmVhY3RFbGVtZW50XG4gICAgICAgICAgICBzdHlsZXMucHJvcHMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpPT57XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLmZvckVhY2goKGVsKT0+aGFzU3R5bGVzKGVsKSAmJiBjdXJTdHlsZXMucHVzaChlbClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhc1N0eWxlcyhjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyU3R5bGVzLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZpbGVzID0gZ2V0RG9jdW1lbnRGaWxlcyh0aGlzLmNvbnRleHQuYnVpbGRNYW5pZmVzdCwgdGhpcy5jb250ZXh0Ll9fTkVYVF9EQVRBX18ucGFnZSwgaW5BbXBNb2RlKTtcbiAgICAgICAgdmFyIF9ub25jZSwgX25vbmNlMTtcbiAgICAgICAgcmV0dXJuKC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImhlYWRcIiwgT2JqZWN0LmFzc2lnbih7XG4gICAgICAgIH0sIHRoaXMucHJvcHMpLCB0aGlzLmNvbnRleHQuaXNEZXZlbG9wbWVudCAmJiAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0LmRlZmF1bHQuRnJhZ21lbnQsIG51bGwsIC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIsIHtcbiAgICAgICAgICAgIFwiZGF0YS1uZXh0LWhpZGUtZm91Y1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJkYXRhLWFtcGRldm1vZGVcIjogaW5BbXBNb2RlID8gJ3RydWUnIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHtcbiAgICAgICAgICAgICAgICBfX2h0bWw6IGBib2R5e2Rpc3BsYXk6bm9uZX1gXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJub3NjcmlwdFwiLCB7XG4gICAgICAgICAgICBcImRhdGEtbmV4dC1oaWRlLWZvdWNcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiZGF0YS1hbXBkZXZtb2RlXCI6IGluQW1wTW9kZSA/ICd0cnVlJyA6IHVuZGVmaW5lZFxuICAgICAgICB9LCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiLCB7XG4gICAgICAgICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTDoge1xuICAgICAgICAgICAgICAgIF9faHRtbDogYGJvZHl7ZGlzcGxheTpibG9ja31gXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKSksIGNoaWxkcmVuLCBwcm9jZXNzLmVudi5fX05FWFRfT1BUSU1JWkVfRk9OVFMgJiYgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibWV0YVwiLCB7XG4gICAgICAgICAgICBuYW1lOiBcIm5leHQtZm9udC1wcmVjb25uZWN0XCJcbiAgICAgICAgfSksIGhlYWQsIC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcIm1ldGFcIiwge1xuICAgICAgICAgICAgbmFtZTogXCJuZXh0LWhlYWQtY291bnRcIixcbiAgICAgICAgICAgIGNvbnRlbnQ6IF9yZWFjdC5kZWZhdWx0LkNoaWxkcmVuLmNvdW50KGhlYWQgfHwgW10pLnRvU3RyaW5nKClcbiAgICAgICAgfSksIGluQW1wTW9kZSAmJiAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0LmRlZmF1bHQuRnJhZ21lbnQsIG51bGwsIC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcIm1ldGFcIiwge1xuICAgICAgICAgICAgbmFtZTogXCJ2aWV3cG9ydFwiLFxuICAgICAgICAgICAgY29udGVudDogXCJ3aWR0aD1kZXZpY2Utd2lkdGgsbWluaW11bS1zY2FsZT0xLGluaXRpYWwtc2NhbGU9MVwiXG4gICAgICAgIH0pLCAhaGFzQ2Fub25pY2FsUmVsICYmIC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImxpbmtcIiwge1xuICAgICAgICAgICAgcmVsOiBcImNhbm9uaWNhbFwiLFxuICAgICAgICAgICAgaHJlZjogY2Fub25pY2FsQmFzZSArICgwLCBfdXRpbHMxKS5jbGVhbkFtcFBhdGgoZGFuZ2Vyb3VzQXNQYXRoKVxuICAgICAgICB9KSwgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibGlua1wiLCB7XG4gICAgICAgICAgICByZWw6IFwicHJlbG9hZFwiLFxuICAgICAgICAgICAgYXM6IFwic2NyaXB0XCIsXG4gICAgICAgICAgICBocmVmOiBcImh0dHBzOi8vY2RuLmFtcHByb2plY3Qub3JnL3YwLmpzXCJcbiAgICAgICAgfSksIHN0eWxlcyAmJiAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiLCB7XG4gICAgICAgICAgICBcImFtcC1jdXN0b21cIjogXCJcIixcbiAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7XG4gICAgICAgICAgICAgICAgX19odG1sOiBjdXJTdHlsZXMubWFwKChzdHlsZSk9PnN0eWxlLnByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MLl9faHRtbFxuICAgICAgICAgICAgICAgICkuam9pbignJykucmVwbGFjZSgvXFwvXFwqIyBzb3VyY2VNYXBwaW5nVVJMPS4qXFwqXFwvL2csICcnKS5yZXBsYWNlKC9cXC9cXCpAIHNvdXJjZVVSTD0uKj9cXCpcXC8vZywgJycpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiLCB7XG4gICAgICAgICAgICBcImFtcC1ib2lsZXJwbGF0ZVwiOiBcIlwiLFxuICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHtcbiAgICAgICAgICAgICAgICBfX2h0bWw6IGBib2R5ey13ZWJraXQtYW5pbWF0aW9uOi1hbXAtc3RhcnQgOHMgc3RlcHMoMSxlbmQpIDBzIDEgbm9ybWFsIGJvdGg7LW1vei1hbmltYXRpb246LWFtcC1zdGFydCA4cyBzdGVwcygxLGVuZCkgMHMgMSBub3JtYWwgYm90aDstbXMtYW5pbWF0aW9uOi1hbXAtc3RhcnQgOHMgc3RlcHMoMSxlbmQpIDBzIDEgbm9ybWFsIGJvdGg7YW5pbWF0aW9uOi1hbXAtc3RhcnQgOHMgc3RlcHMoMSxlbmQpIDBzIDEgbm9ybWFsIGJvdGh9QC13ZWJraXQta2V5ZnJhbWVzIC1hbXAtc3RhcnR7ZnJvbXt2aXNpYmlsaXR5OmhpZGRlbn10b3t2aXNpYmlsaXR5OnZpc2libGV9fUAtbW96LWtleWZyYW1lcyAtYW1wLXN0YXJ0e2Zyb217dmlzaWJpbGl0eTpoaWRkZW59dG97dmlzaWJpbGl0eTp2aXNpYmxlfX1ALW1zLWtleWZyYW1lcyAtYW1wLXN0YXJ0e2Zyb217dmlzaWJpbGl0eTpoaWRkZW59dG97dmlzaWJpbGl0eTp2aXNpYmxlfX1ALW8ta2V5ZnJhbWVzIC1hbXAtc3RhcnR7ZnJvbXt2aXNpYmlsaXR5OmhpZGRlbn10b3t2aXNpYmlsaXR5OnZpc2libGV9fUBrZXlmcmFtZXMgLWFtcC1zdGFydHtmcm9te3Zpc2liaWxpdHk6aGlkZGVufXRve3Zpc2liaWxpdHk6dmlzaWJsZX19YFxuICAgICAgICAgICAgfVxuICAgICAgICB9KSwgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibm9zY3JpcHRcIiwgbnVsbCwgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIiwge1xuICAgICAgICAgICAgXCJhbXAtYm9pbGVycGxhdGVcIjogXCJcIixcbiAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7XG4gICAgICAgICAgICAgICAgX19odG1sOiBgYm9keXstd2Via2l0LWFuaW1hdGlvbjpub25lOy1tb3otYW5pbWF0aW9uOm5vbmU7LW1zLWFuaW1hdGlvbjpub25lO2FuaW1hdGlvbjpub25lfWBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpLCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiwge1xuICAgICAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgICAgICAgICBzcmM6IFwiaHR0cHM6Ly9jZG4uYW1wcHJvamVjdC5vcmcvdjAuanNcIlxuICAgICAgICB9KSksICFpbkFtcE1vZGUgJiYgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9yZWFjdC5kZWZhdWx0LkZyYWdtZW50LCBudWxsLCAhaGFzQW1waHRtbFJlbCAmJiBoeWJyaWRBbXAgJiYgLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwibGlua1wiLCB7XG4gICAgICAgICAgICByZWw6IFwiYW1waHRtbFwiLFxuICAgICAgICAgICAgaHJlZjogY2Fub25pY2FsQmFzZSArIGdldEFtcFBhdGgoYW1wUGF0aCwgZGFuZ2Vyb3VzQXNQYXRoKVxuICAgICAgICB9KSwgIXByb2Nlc3MuZW52Ll9fTkVYVF9PUFRJTUlaRV9DU1MgJiYgdGhpcy5nZXRDc3NMaW5rcyhmaWxlcyksICFwcm9jZXNzLmVudi5fX05FWFRfT1BUSU1JWkVfQ1NTICYmIC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcIm5vc2NyaXB0XCIsIHtcbiAgICAgICAgICAgIFwiZGF0YS1uLWNzc1wiOiAoX25vbmNlID0gdGhpcy5wcm9wcy5ub25jZSkgIT09IG51bGwgJiYgX25vbmNlICE9PSB2b2lkIDAgPyBfbm9uY2UgOiAnJ1xuICAgICAgICB9KSwgcHJvY2Vzcy5lbnYuX19ORVhUX09QVElNSVpFX0lNQUdFUyAmJiAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJtZXRhXCIsIHtcbiAgICAgICAgICAgIG5hbWU6IFwibmV4dC1pbWFnZS1wcmVsb2FkXCJcbiAgICAgICAgfSksICFkaXNhYmxlUnVudGltZUpTICYmICFkaXNhYmxlSnNQcmVsb2FkICYmIHRoaXMuZ2V0UHJlbG9hZER5bmFtaWNDaHVua3MoKSwgIWRpc2FibGVSdW50aW1lSlMgJiYgIWRpc2FibGVKc1ByZWxvYWQgJiYgdGhpcy5nZXRQcmVsb2FkTWFpbkxpbmtzKGZpbGVzKSwgIWRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nICYmICFkaXNhYmxlUnVudGltZUpTICYmIHRoaXMuZ2V0UG9seWZpbGxTY3JpcHRzKCksICFkaXNhYmxlT3B0aW1pemVkTG9hZGluZyAmJiAhZGlzYWJsZVJ1bnRpbWVKUyAmJiB0aGlzLmdldFByZU5leHRTY3JpcHRzKCksICFkaXNhYmxlT3B0aW1pemVkTG9hZGluZyAmJiAhZGlzYWJsZVJ1bnRpbWVKUyAmJiB0aGlzLmdldER5bmFtaWNDaHVua3MoZmlsZXMpLCAhZGlzYWJsZU9wdGltaXplZExvYWRpbmcgJiYgIWRpc2FibGVSdW50aW1lSlMgJiYgdGhpcy5nZXRTY3JpcHRzKGZpbGVzKSwgcHJvY2Vzcy5lbnYuX19ORVhUX09QVElNSVpFX0NTUyAmJiB0aGlzLmdldENzc0xpbmtzKGZpbGVzKSwgcHJvY2Vzcy5lbnYuX19ORVhUX09QVElNSVpFX0NTUyAmJiAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJub3NjcmlwdFwiLCB7XG4gICAgICAgICAgICBcImRhdGEtbi1jc3NcIjogKF9ub25jZTEgPSB0aGlzLnByb3BzLm5vbmNlKSAhPT0gbnVsbCAmJiBfbm9uY2UxICE9PSB2b2lkIDAgPyBfbm9uY2UxIDogJydcbiAgICAgICAgfSksIHRoaXMuY29udGV4dC5pc0RldmVsb3BtZW50ICYmIC8vIHRoaXMgZWxlbWVudCBpcyB1c2VkIHRvIG1vdW50IGRldmVsb3BtZW50IHN0eWxlcyBzbyB0aGVcbiAgICAgICAgLy8gb3JkZXJpbmcgbWF0Y2hlcyBwcm9kdWN0aW9uXG4gICAgICAgIC8vIChieSBkZWZhdWx0LCBzdHlsZS1sb2FkZXIgaW5qZWN0cyBhdCB0aGUgYm90dG9tIG9mIDxoZWFkIC8+KVxuICAgICAgICAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJub3NjcmlwdFwiLCB7XG4gICAgICAgICAgICBpZDogXCJfX25leHRfY3NzX19ET19OT1RfVVNFX19cIlxuICAgICAgICB9KSwgc3R5bGVzIHx8IG51bGwpLCAvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0LmRlZmF1bHQuRnJhZ21lbnQsIHtcbiAgICAgICAgfSwgLi4uaGVhZFRhZ3MgfHwgW10pKSk7XG4gICAgfVxufVxuZXhwb3J0cy5IZWFkID0gSGVhZDtcbkhlYWQuY29udGV4dFR5cGUgPSBfdXRpbHMuSHRtbENvbnRleHQ7XG5mdW5jdGlvbiBNYWluKCkge1xuICAgIGNvbnN0IHsgaW5BbXBNb2RlICwgZG9jQ29tcG9uZW50c1JlbmRlcmVkICB9ID0gKDAsIF9yZWFjdCkudXNlQ29udGV4dChfdXRpbHMuSHRtbENvbnRleHQpO1xuICAgIGRvY0NvbXBvbmVudHNSZW5kZXJlZC5NYWluID0gdHJ1ZTtcbiAgICBpZiAoaW5BbXBNb2RlKSByZXR1cm4oLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9yZWFjdC5kZWZhdWx0LkZyYWdtZW50LCBudWxsLCBfY29uc3RhbnRzLkJPRFlfUkVOREVSX1RBUkdFVCkpO1xuICAgIHJldHVybigvKiNfX1BVUkVfXyovIF9yZWFjdC5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1xuICAgICAgICBpZDogXCJfX25leHRcIlxuICAgIH0sIF9jb25zdGFudHMuQk9EWV9SRU5ERVJfVEFSR0VUKSk7XG59XG5jbGFzcyBOZXh0U2NyaXB0IGV4dGVuZHMgX3JlYWN0LkNvbXBvbmVudCB7XG4gICAgZ2V0RHluYW1pY0NodW5rcyhmaWxlcykge1xuICAgICAgICByZXR1cm4gZ2V0RHluYW1pY0NodW5rcyh0aGlzLmNvbnRleHQsIHRoaXMucHJvcHMsIGZpbGVzKTtcbiAgICB9XG4gICAgZ2V0UHJlTmV4dFNjcmlwdHMoKSB7XG4gICAgICAgIHJldHVybiBnZXRQcmVOZXh0U2NyaXB0cyh0aGlzLmNvbnRleHQsIHRoaXMucHJvcHMpO1xuICAgIH1cbiAgICBnZXRTY3JpcHRzKGZpbGVzKSB7XG4gICAgICAgIHJldHVybiBnZXRTY3JpcHRzKHRoaXMuY29udGV4dCwgdGhpcy5wcm9wcywgZmlsZXMpO1xuICAgIH1cbiAgICBnZXRQb2x5ZmlsbFNjcmlwdHMoKSB7XG4gICAgICAgIHJldHVybiBnZXRQb2x5ZmlsbFNjcmlwdHModGhpcy5jb250ZXh0LCB0aGlzLnByb3BzKTtcbiAgICB9XG4gICAgc3RhdGljIGdldElubGluZVNjcmlwdFNvdXJjZShjb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IHsgX19ORVhUX0RBVEFfXyAgfSA9IGNvbnRleHQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoX19ORVhUX0RBVEFfXyk7XG4gICAgICAgICAgICByZXR1cm4gKDAsIF9odG1sZXNjYXBlKS5odG1sRXNjYXBlSnNvblN0cmluZyhkYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyLm1lc3NhZ2UuaW5kZXhPZignY2lyY3VsYXIgc3RydWN0dXJlJykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENpcmN1bGFyIHN0cnVjdHVyZSBpbiBcImdldEluaXRpYWxQcm9wc1wiIHJlc3VsdCBvZiBwYWdlIFwiJHtfX05FWFRfREFUQV9fLnBhZ2V9XCIuIGh0dHBzOi8vbmV4dGpzLm9yZy9kb2NzL21lc3NhZ2VzL2NpcmN1bGFyLXN0cnVjdHVyZWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBhc3NldFByZWZpeCAsIGluQW1wTW9kZSAsIGJ1aWxkTWFuaWZlc3QgLCB1bnN0YWJsZV9ydW50aW1lSlMgLCBkb2NDb21wb25lbnRzUmVuZGVyZWQgLCBkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZyAsIGRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nICwgIH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIGNvbnN0IGRpc2FibGVSdW50aW1lSlMgPSB1bnN0YWJsZV9ydW50aW1lSlMgPT09IGZhbHNlO1xuICAgICAgICBkb2NDb21wb25lbnRzUmVuZGVyZWQuTmV4dFNjcmlwdCA9IHRydWU7XG4gICAgICAgIGlmIChpbkFtcE1vZGUpIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBhbXBEZXZGaWxlcyA9IFtcbiAgICAgICAgICAgICAgICAuLi5idWlsZE1hbmlmZXN0LmRldkZpbGVzLFxuICAgICAgICAgICAgICAgIC4uLmJ1aWxkTWFuaWZlc3QucG9seWZpbGxGaWxlcyxcbiAgICAgICAgICAgICAgICAuLi5idWlsZE1hbmlmZXN0LmFtcERldkZpbGVzLCBcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICByZXR1cm4oLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9yZWFjdC5kZWZhdWx0LkZyYWdtZW50LCBudWxsLCBkaXNhYmxlUnVudGltZUpTID8gbnVsbCA6IC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiLCB7XG4gICAgICAgICAgICAgICAgaWQ6IFwiX19ORVhUX0RBVEFfX1wiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgIG5vbmNlOiB0aGlzLnByb3BzLm5vbmNlLFxuICAgICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiB0aGlzLnByb3BzLmNyb3NzT3JpZ2luIHx8IHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU4sXG4gICAgICAgICAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHtcbiAgICAgICAgICAgICAgICAgICAgX19odG1sOiBOZXh0U2NyaXB0LmdldElubGluZVNjcmlwdFNvdXJjZSh0aGlzLmNvbnRleHQpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcImRhdGEtYW1wZGV2bW9kZVwiOiB0cnVlXG4gICAgICAgICAgICB9KSwgYW1wRGV2RmlsZXMubWFwKChmaWxlKT0+LyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIsIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBmaWxlLFxuICAgICAgICAgICAgICAgICAgICBzcmM6IGAke2Fzc2V0UHJlZml4fS9fbmV4dC8ke2ZpbGV9JHtkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZ31gLFxuICAgICAgICAgICAgICAgICAgICBub25jZTogdGhpcy5wcm9wcy5ub25jZSxcbiAgICAgICAgICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTixcbiAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWFtcGRldm1vZGVcIjogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLmNyb3NzT3JpZ2luKSBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IGBOZXh0U2NyaXB0YCBhdHRyaWJ1dGUgYGNyb3NzT3JpZ2luYCBpcyBkZXByZWNhdGVkLiBodHRwczovL25leHRqcy5vcmcvZG9jcy9tZXNzYWdlcy9kb2MtY3Jvc3NvcmlnaW4tZGVwcmVjYXRlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZpbGVzID0gZ2V0RG9jdW1lbnRGaWxlcyh0aGlzLmNvbnRleHQuYnVpbGRNYW5pZmVzdCwgdGhpcy5jb250ZXh0Ll9fTkVYVF9EQVRBX18ucGFnZSwgaW5BbXBNb2RlKTtcbiAgICAgICAgcmV0dXJuKC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChfcmVhY3QuZGVmYXVsdC5GcmFnbWVudCwgbnVsbCwgIWRpc2FibGVSdW50aW1lSlMgJiYgYnVpbGRNYW5pZmVzdC5kZXZGaWxlcyA/IGJ1aWxkTWFuaWZlc3QuZGV2RmlsZXMubWFwKChmaWxlKT0+LyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIsIHtcbiAgICAgICAgICAgICAgICBrZXk6IGZpbGUsXG4gICAgICAgICAgICAgICAgc3JjOiBgJHthc3NldFByZWZpeH0vX25leHQvJHtlbmNvZGVVUkkoZmlsZSl9JHtkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZ31gLFxuICAgICAgICAgICAgICAgIG5vbmNlOiB0aGlzLnByb3BzLm5vbmNlLFxuICAgICAgICAgICAgICAgIGNyb3NzT3JpZ2luOiB0aGlzLnByb3BzLmNyb3NzT3JpZ2luIHx8IHByb2Nlc3MuZW52Ll9fTkVYVF9DUk9TU19PUklHSU5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICkgOiBudWxsLCBkaXNhYmxlUnVudGltZUpTID8gbnVsbCA6IC8qI19fUFVSRV9fKi8gX3JlYWN0LmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiLCB7XG4gICAgICAgICAgICBpZDogXCJfX05FWFRfREFUQV9fXCIsXG4gICAgICAgICAgICB0eXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgIG5vbmNlOiB0aGlzLnByb3BzLm5vbmNlLFxuICAgICAgICAgICAgY3Jvc3NPcmlnaW46IHRoaXMucHJvcHMuY3Jvc3NPcmlnaW4gfHwgcHJvY2Vzcy5lbnYuX19ORVhUX0NST1NTX09SSUdJTixcbiAgICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7XG4gICAgICAgICAgICAgICAgX19odG1sOiBOZXh0U2NyaXB0LmdldElubGluZVNjcmlwdFNvdXJjZSh0aGlzLmNvbnRleHQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLCBkaXNhYmxlT3B0aW1pemVkTG9hZGluZyAmJiAhZGlzYWJsZVJ1bnRpbWVKUyAmJiB0aGlzLmdldFBvbHlmaWxsU2NyaXB0cygpLCBkaXNhYmxlT3B0aW1pemVkTG9hZGluZyAmJiAhZGlzYWJsZVJ1bnRpbWVKUyAmJiB0aGlzLmdldFByZU5leHRTY3JpcHRzKCksIGRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nICYmICFkaXNhYmxlUnVudGltZUpTICYmIHRoaXMuZ2V0RHluYW1pY0NodW5rcyhmaWxlcyksIGRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nICYmICFkaXNhYmxlUnVudGltZUpTICYmIHRoaXMuZ2V0U2NyaXB0cyhmaWxlcykpKTtcbiAgICB9XG59XG5leHBvcnRzLk5leHRTY3JpcHQgPSBOZXh0U2NyaXB0O1xuTmV4dFNjcmlwdC5jb250ZXh0VHlwZSA9IF91dGlscy5IdG1sQ29udGV4dDtcbk5leHRTY3JpcHQuc2FmYXJpTm9tb2R1bGVGaXggPSAnIWZ1bmN0aW9uKCl7dmFyIGU9ZG9jdW1lbnQsdD1lLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7aWYoIShcIm5vTW9kdWxlXCJpbiB0KSYmXCJvbmJlZm9yZWxvYWRcImluIHQpe3ZhciBuPSExO2UuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZWxvYWRcIixmdW5jdGlvbihlKXtpZihlLnRhcmdldD09PXQpbj0hMDtlbHNlIGlmKCFlLnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJub21vZHVsZVwiKXx8IW4pcmV0dXJuO2UucHJldmVudERlZmF1bHQoKX0sITApLHQudHlwZT1cIm1vZHVsZVwiLHQuc3JjPVwiLlwiLGUuaGVhZC5hcHBlbmRDaGlsZCh0KSx0LnJlbW92ZSgpfX0oKTsnO1xuZnVuY3Rpb24gZ2V0QW1wUGF0aChhbXBQYXRoLCBhc1BhdGgpIHtcbiAgICByZXR1cm4gYW1wUGF0aCB8fCBgJHthc1BhdGh9JHthc1BhdGguaW5jbHVkZXMoJz8nKSA/ICcmJyA6ICc/J31hbXA9MWA7XG59XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPV9kb2N1bWVudC5qcy5tYXAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0L2Rpc3Qvc2VydmVyL2dldC1wYWdlLWZpbGVzLmpzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9zZXJ2ZXIvaHRtbGVzY2FwZS5qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0L2Rpc3Qvc2VydmVyL3V0aWxzLmpzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm5leHQvZGlzdC9zaGFyZWQvbGliL2NvbnN0YW50cy5qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi9oZWFkLW1hbmFnZXItY29udGV4dC5qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi91dGlscy5qc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdHlsZWQtanN4L3NlcnZlclwiKTsiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJkZWZhdWx0IiwiaW5pdEhlYWRNYW5hZ2VyIiwiRE9NQXR0cmlidXRlTmFtZXMiLCJhY2NlcHRDaGFyc2V0IiwiY2xhc3NOYW1lIiwiaHRtbEZvciIsImh0dHBFcXVpdiIsIm5vTW9kdWxlIiwicmVhY3RFbGVtZW50VG9ET00iLCJ0eXBlIiwicHJvcHMiLCJlbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInAiLCJoYXNPd25Qcm9wZXJ0eSIsInVuZGVmaW5lZCIsImF0dHIiLCJ0b0xvd2VyQ2FzZSIsInNldEF0dHJpYnV0ZSIsImNoaWxkcmVuIiwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwiLCJpbm5lckhUTUwiLCJfX2h0bWwiLCJ0ZXh0Q29udGVudCIsIkFycmF5IiwiaXNBcnJheSIsImpvaW4iLCJ1cGRhdGVFbGVtZW50cyIsImNvbXBvbmVudHMiLCJoZWFkRWwiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImhlYWRDb3VudEVsIiwicXVlcnlTZWxlY3RvciIsImNvbnNvbGUiLCJlcnJvciIsImhlYWRDb3VudCIsIk51bWJlciIsImNvbnRlbnQiLCJvbGRUYWdzIiwiaSIsImoiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwidGFnTmFtZSIsInB1c2giLCJuZXdUYWdzIiwibWFwIiwiZmlsdGVyIiwibmV3VGFnIiwiayIsImxlbiIsImxlbmd0aCIsIm9sZFRhZyIsImlzRXF1YWxOb2RlIiwic3BsaWNlIiwiZm9yRWFjaCIsInQiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJpbnNlcnRCZWZvcmUiLCJ0b1N0cmluZyIsInVwZGF0ZVByb21pc2UiLCJtb3VudGVkSW5zdGFuY2VzIiwiU2V0IiwidXBkYXRlSGVhZCIsImhlYWQiLCJwcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwidGFncyIsImgiLCJocmVmIiwidGl0bGVDb21wb25lbnQiLCJ0aXRsZSIsInJlcXVlc3RJZGxlQ2FsbGJhY2siLCJjYW5jZWxJZGxlQ2FsbGJhY2siLCJzZWxmIiwiYmluZCIsIndpbmRvdyIsImNiIiwic3RhcnQiLCJEYXRlIiwibm93Iiwic2V0VGltZW91dCIsImRpZFRpbWVvdXQiLCJ0aW1lUmVtYWluaW5nIiwiTWF0aCIsIm1heCIsImlkIiwiY2xlYXJUaW1lb3V0IiwiaW5pdFNjcmlwdExvYWRlciIsIl9yZWFjdCIsInJlcXVpcmUiLCJfaGVhZE1hbmFnZXJDb250ZXh0IiwiX2hlYWRNYW5hZ2VyIiwiX3JlcXVlc3RJZGxlQ2FsbGJhY2siLCJfZGVmaW5lUHJvcGVydHkiLCJvYmoiLCJrZXkiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJfb2JqZWN0U3ByZWFkIiwidGFyZ2V0IiwiYXJndW1lbnRzIiwic291cmNlIiwib3duS2V5cyIsImtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJjb25jYXQiLCJzeW0iLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJfb2JqZWN0V2l0aG91dFByb3BlcnRpZXMiLCJleGNsdWRlZCIsIl9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlIiwic291cmNlU3ltYm9sS2V5cyIsImluZGV4T2YiLCJwcm90b3R5cGUiLCJwcm9wZXJ0eUlzRW51bWVyYWJsZSIsImNhbGwiLCJzb3VyY2VLZXlzIiwiU2NyaXB0Q2FjaGUiLCJNYXAiLCJMb2FkQ2FjaGUiLCJpZ25vcmVQcm9wcyIsImxvYWRTY3JpcHQiLCJzcmMiLCJvbkxvYWQiLCJzdHJhdGVneSIsIm9uRXJyb3IiLCJjYWNoZUtleSIsImhhcyIsImFkZCIsImdldCIsImxvYWRQcm9taXNlIiwicmVqZWN0IiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJjYXRjaCIsInNldCIsImVudHJpZXMiLCJpbmNsdWRlcyIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImhhbmRsZUNsaWVudFNjcmlwdExvYWQiLCJsb2FkTGF6eVNjcmlwdCIsInJlYWR5U3RhdGUiLCJzY3JpcHRMb2FkZXJJdGVtcyIsIlNjcmlwdCIsInJlc3RQcm9wcyIsInVwZGF0ZVNjcmlwdHMiLCJzY3JpcHRzIiwiZ2V0SXNTc3IiLCJ1c2VDb250ZXh0IiwiSGVhZE1hbmFnZXJDb250ZXh0IiwidXNlRWZmZWN0IiwiYmVmb3JlSW50ZXJhY3RpdmUiLCJfZGVmYXVsdCIsIl91dGlscyIsIkRvY3VtZW50Q29udGV4dCIsIkRvY3VtZW50SW5pdGlhbFByb3BzIiwiRG9jdW1lbnRQcm9wcyIsIkh0bWwiLCJNYWluIiwiX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQiLCJfc2VydmVyIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9jb25zdGFudHMiLCJfZ2V0UGFnZUZpbGVzIiwiX3V0aWxzMSIsIl9odG1sZXNjYXBlIiwiX3NjcmlwdCIsIl9fZXNNb2R1bGUiLCJuZXdPYmoiLCJkZXNjIiwiZ2V0RG9jdW1lbnRGaWxlcyIsImJ1aWxkTWFuaWZlc3QiLCJwYXRobmFtZSIsImluQW1wTW9kZSIsInNoYXJlZEZpbGVzIiwiZ2V0UGFnZUZpbGVzIiwicGFnZUZpbGVzIiwiYWxsRmlsZXMiLCJnZXRQb2x5ZmlsbFNjcmlwdHMiLCJjb250ZXh0IiwiYXNzZXRQcmVmaXgiLCJkZXZPbmx5Q2FjaGVCdXN0ZXJRdWVyeVN0cmluZyIsImRpc2FibGVPcHRpbWl6ZWRMb2FkaW5nIiwicG9seWZpbGxGaWxlcyIsInBvbHlmaWxsIiwiZW5kc1dpdGgiLCJkZWZlciIsIm5vbmNlIiwiY3Jvc3NPcmlnaW4iLCJwcm9jZXNzIiwiZW52IiwiX19ORVhUX0NST1NTX09SSUdJTiIsImdldFByZU5leHRTY3JpcHRzIiwic2NyaXB0TG9hZGVyIiwiZmlsZSIsImluZGV4Iiwic2NyaXB0UHJvcHMiLCJhc3NpZ24iLCJnZXREeW5hbWljQ2h1bmtzIiwiZmlsZXMiLCJkeW5hbWljSW1wb3J0cyIsImlzRGV2ZWxvcG1lbnQiLCJhc3luYyIsImVuY29kZVVSSSIsImdldFNjcmlwdHMiLCJyZWYiLCJub3JtYWxTY3JpcHRzIiwibG93UHJpb3JpdHlTY3JpcHRzIiwibG93UHJpb3JpdHlGaWxlcyIsIkRvY3VtZW50MSIsIkNvbXBvbmVudCIsImdldEluaXRpYWxQcm9wcyIsImN0eCIsImVuaGFuY2VBcHAiLCJBcHAiLCJodG1sIiwicmVuZGVyUGFnZSIsInN0eWxlcyIsInJlbmRlciIsIkhlYWQiLCJOZXh0U2NyaXB0IiwiZG9jQ29tcG9uZW50c1JlbmRlcmVkIiwibG9jYWxlIiwiSHRtbENvbnRleHQiLCJsYW5nIiwiYW1wIiwiZ2V0Q3NzTGlua3MiLCJjc3NGaWxlcyIsImYiLCJ1bm1hbmdlZEZpbGVzIiwiZHluYW1pY0Nzc0ZpbGVzIiwiZnJvbSIsImV4aXN0aW5nIiwiY3NzTGlua0VsZW1lbnRzIiwiaXNTaGFyZWRGaWxlIiwiX19ORVhUX09QVElNSVpFX0NTUyIsInJlbCIsImFzIiwiaXNVbm1hbmFnZWRGaWxlIiwiX19ORVhUX09QVElNSVpFX0ZPTlRTIiwibWFrZVN0eWxlc2hlZXRJbmVydCIsImdldFByZWxvYWREeW5hbWljQ2h1bmtzIiwiQm9vbGVhbiIsImdldFByZWxvYWRNYWluTGlua3MiLCJwcmVsb2FkRmlsZXMiLCJoYW5kbGVEb2N1bWVudFNjcmlwdExvYWRlckl0ZW1zIiwiZmlsdGVyZWRDaGlsZHJlbiIsIkNoaWxkcmVuIiwiY2hpbGQiLCJfX05FWFRfREFUQV9fIiwibm9kZSIsImMiLCJPUFRJTUlaRURfRk9OVF9QUk9WSURFUlMiLCJzb21lIiwidXJsIiwic3RhcnRzV2l0aCIsIm5ld1Byb3BzIiwiY2xvbmVFbGVtZW50IiwiYW1wUGF0aCIsImh5YnJpZEFtcCIsImNhbm9uaWNhbEJhc2UiLCJkYW5nZXJvdXNBc1BhdGgiLCJoZWFkVGFncyIsInVuc3RhYmxlX3J1bnRpbWVKUyIsInVuc3RhYmxlX0pzUHJlbG9hZCIsImRpc2FibGVSdW50aW1lSlMiLCJkaXNhYmxlSnNQcmVsb2FkIiwiY3NzUHJlbG9hZHMiLCJvdGhlckhlYWRFbGVtZW50cyIsInRvQXJyYXkiLCJpc1JlYWN0SGVsbWV0IiwicmVmMSIsIndhcm4iLCJuYW1lIiwiaGFzQW1waHRtbFJlbCIsImhhc0Nhbm9uaWNhbFJlbCIsImJhZFByb3AiLCJwcm9wIiwicGFnZSIsImN1clN0eWxlcyIsImhhc1N0eWxlcyIsInJlZjIiLCJyZWYzIiwiX25vbmNlIiwiX25vbmNlMSIsIkZyYWdtZW50IiwiY291bnQiLCJjbGVhbkFtcFBhdGgiLCJzdHlsZSIsInJlcGxhY2UiLCJnZXRBbXBQYXRoIiwiX19ORVhUX09QVElNSVpFX0lNQUdFUyIsImNvbnRleHRUeXBlIiwiQk9EWV9SRU5ERVJfVEFSR0VUIiwiZ2V0SW5saW5lU2NyaXB0U291cmNlIiwiZGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJodG1sRXNjYXBlSnNvblN0cmluZyIsImVyciIsIm1lc3NhZ2UiLCJFcnJvciIsImFtcERldkZpbGVzIiwiZGV2RmlsZXMiLCJzYWZhcmlOb21vZHVsZUZpeCIsImFzUGF0aCJdLCJzb3VyY2VSb290IjoiIn0=