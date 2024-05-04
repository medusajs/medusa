"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../node_modules/is-retry-allowed/index.js
var require_is_retry_allowed = __commonJS({
  "../../../node_modules/is-retry-allowed/index.js"(exports, module2) {
    "use strict";
    var denyList = /* @__PURE__ */ new Set([
      "ENOTFOUND",
      "ENETUNREACH",
      // SSL errors from https://github.com/nodejs/node/blob/fc8e3e2cdc521978351de257030db0076d79e0ab/src/crypto/crypto_common.cc#L301-L328
      "UNABLE_TO_GET_ISSUER_CERT",
      "UNABLE_TO_GET_CRL",
      "UNABLE_TO_DECRYPT_CERT_SIGNATURE",
      "UNABLE_TO_DECRYPT_CRL_SIGNATURE",
      "UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY",
      "CERT_SIGNATURE_FAILURE",
      "CRL_SIGNATURE_FAILURE",
      "CERT_NOT_YET_VALID",
      "CERT_HAS_EXPIRED",
      "CRL_NOT_YET_VALID",
      "CRL_HAS_EXPIRED",
      "ERROR_IN_CERT_NOT_BEFORE_FIELD",
      "ERROR_IN_CERT_NOT_AFTER_FIELD",
      "ERROR_IN_CRL_LAST_UPDATE_FIELD",
      "ERROR_IN_CRL_NEXT_UPDATE_FIELD",
      "OUT_OF_MEM",
      "DEPTH_ZERO_SELF_SIGNED_CERT",
      "SELF_SIGNED_CERT_IN_CHAIN",
      "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
      "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
      "CERT_CHAIN_TOO_LONG",
      "CERT_REVOKED",
      "INVALID_CA",
      "PATH_LENGTH_EXCEEDED",
      "INVALID_PURPOSE",
      "CERT_UNTRUSTED",
      "CERT_REJECTED",
      "HOSTNAME_MISMATCH"
    ]);
    module2.exports = (error) => !denyList.has(error && error.code);
  }
});

// src/figma-client.ts
var import_dotenv = __toESM(require("dotenv"));
var import_path = require("path");

// src/figma/index.ts
var import_axios2 = __toESM(require("axios"));

// src/figma/client.ts
var import_axios = __toESM(require("axios"));

// ../../../node_modules/axios-retry/lib/esm/index.js
var import_is_retry_allowed = __toESM(require_is_retry_allowed(), 1);
function asyncGeneratorStep(gen, resolve4, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve4(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve4, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve4, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve4, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) {
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var namespace = "axios-retry";
function isNetworkError(error) {
  return !error.response && Boolean(error.code) && // Prevents retrying cancelled requests
  error.code !== "ECONNABORTED" && // Prevents retrying timed out requests
  (0, import_is_retry_allowed.default)(error);
}
var SAFE_HTTP_METHODS = ["get", "head", "options"];
var IDEMPOTENT_HTTP_METHODS = SAFE_HTTP_METHODS.concat(["put", "delete"]);
function isRetryableError(error) {
  return error.code !== "ECONNABORTED" && (!error.response || error.response.status >= 500 && error.response.status <= 599);
}
function isSafeRequestError(error) {
  if (!error.config) {
    return false;
  }
  return isRetryableError(error) && SAFE_HTTP_METHODS.indexOf(error.config.method) !== -1;
}
function isIdempotentRequestError(error) {
  if (!error.config) {
    return false;
  }
  return isRetryableError(error) && IDEMPOTENT_HTTP_METHODS.indexOf(error.config.method) !== -1;
}
function isNetworkOrIdempotentRequestError(error) {
  return isNetworkError(error) || isIdempotentRequestError(error);
}
function noDelay() {
  return 0;
}
function exponentialDelay() {
  var retryNumber = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
  var error = arguments.length > 1 ? arguments[1] : void 0;
  var delayFactor = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 100;
  var delay = Math.pow(2, retryNumber) * delayFactor;
  var randomSum = delay * 0.2 * Math.random();
  return delay + randomSum;
}
function getCurrentState(config) {
  var currentState = config[namespace] || {};
  currentState.retryCount = currentState.retryCount || 0;
  config[namespace] = currentState;
  return currentState;
}
function getRequestOptions(config, defaultOptions) {
  return _objectSpread(_objectSpread({}, defaultOptions), config[namespace]);
}
function fixConfig(axios3, config) {
  if (axios3.defaults.agent === config.agent) {
    delete config.agent;
  }
  if (axios3.defaults.httpAgent === config.httpAgent) {
    delete config.httpAgent;
  }
  if (axios3.defaults.httpsAgent === config.httpsAgent) {
    delete config.httpsAgent;
  }
}
function shouldRetry(_x, _x2, _x3, _x4) {
  return _shouldRetry.apply(this, arguments);
}
function _shouldRetry() {
  _shouldRetry = _asyncToGenerator(function* (retries, retryCondition, currentState, error) {
    var shouldRetryOrPromise = currentState.retryCount < retries && retryCondition(error);
    if (typeof shouldRetryOrPromise === "object") {
      try {
        var shouldRetryPromiseResult = yield shouldRetryOrPromise;
        return shouldRetryPromiseResult !== false;
      } catch (_err) {
        return false;
      }
    }
    return shouldRetryOrPromise;
  });
  return _shouldRetry.apply(this, arguments);
}
function axiosRetry(axios3, defaultOptions) {
  axios3.interceptors.request.use((config) => {
    var currentState = getCurrentState(config);
    currentState.lastRequestTime = Date.now();
    return config;
  });
  axios3.interceptors.response.use(null, /* @__PURE__ */ function() {
    var _ref = _asyncToGenerator(function* (error) {
      var {
        config
      } = error;
      if (!config) {
        return Promise.reject(error);
      }
      var {
        retries = 3,
        retryCondition = isNetworkOrIdempotentRequestError,
        retryDelay = noDelay,
        shouldResetTimeout = false,
        onRetry = () => {
        }
      } = getRequestOptions(config, defaultOptions);
      var currentState = getCurrentState(config);
      if (yield shouldRetry(retries, retryCondition, currentState, error)) {
        currentState.retryCount += 1;
        var delay = retryDelay(currentState.retryCount, error);
        fixConfig(axios3, config);
        if (!shouldResetTimeout && config.timeout && currentState.lastRequestTime) {
          var lastRequestDuration = Date.now() - currentState.lastRequestTime;
          var timeout = config.timeout - lastRequestDuration - delay;
          if (timeout <= 0) {
            return Promise.reject(error);
          }
          config.timeout = timeout;
        }
        config.transformRequest = [(data) => data];
        onRetry(currentState.retryCount, error, config);
        return new Promise((resolve4) => setTimeout(() => resolve4(axios3(config)), delay));
      }
      return Promise.reject(error);
    });
    return function(_x5) {
      return _ref.apply(this, arguments);
    };
  }());
}
axiosRetry.isNetworkError = isNetworkError;
axiosRetry.isSafeRequestError = isSafeRequestError;
axiosRetry.isIdempotentRequestError = isIdempotentRequestError;
axiosRetry.isNetworkOrIdempotentRequestError = isNetworkOrIdempotentRequestError;
axiosRetry.exponentialDelay = exponentialDelay;
axiosRetry.isRetryableError = isRetryableError;

// src/figma/client.ts
var Client = class {
  _axios;
  constructor({ accessToken: accessToken2, baseURL, maxRetries = 3 }) {
    const instance = import_axios.default.create({
      baseURL,
      headers: {
        "X-FIGMA-TOKEN": accessToken2
      }
    });
    axiosRetry(instance, {
      retries: maxRetries,
      retryDelay: axiosRetry.exponentialDelay
    });
    this._axios = instance;
  }
  async request(method, url, payload = {}, config) {
    const requestConfig = {
      method,
      url,
      ...config
    };
    if (["POST", "DELETE"].includes(method)) {
      requestConfig.data = payload;
    }
    const response = await this._axios.request(requestConfig);
    if (Math.floor(response.status / 100) !== 2) {
      throw response.statusText;
    }
    return response.data;
  }
};
var client_default = Client;

// src/figma/utils.ts
function encodeQuery(obj) {
  if (!obj) {
    return "";
  }
  return Object.entries(obj).map(([k, v]) => k && v && `${k}=${encodeURIComponent(v)}`).filter(Boolean).join("&");
}

// src/figma/index.ts
var FIGMA_BASE_URL = "https://api.figma.com/v1/";
var Figma = class {
  _api;
  constructor({ accessToken: accessToken2, maxRetries = 3 }) {
    this._api = new client_default({
      accessToken: accessToken2,
      baseURL: FIGMA_BASE_URL,
      maxRetries
    });
  }
  /**
   * Get a resource by its URL.
   */
  async getResource(url) {
    const response = await import_axios2.default.get(url);
    if (Math.floor(response.status / 100) !== 2) {
      throw response.statusText;
    }
    return response.data;
  }
  async getFile(file_key, options) {
    const queryString = options ? `?${encodeQuery({
      ...options,
      ids: options.ids && options.ids.join(",")
    })}` : "";
    return this._api.request("GET", `files/${file_key}${queryString}`);
  }
  async getFileNodes(file_key, options) {
    const queryString = `?${encodeQuery({
      ...options,
      ids: options.ids.join(",")
    })}`;
    return this._api.request("GET", `files/${file_key}/nodes${queryString}`);
  }
  async getImage(file_key, options) {
    const queryString = options ? `?${encodeQuery({
      ...options,
      ids: options.ids && options.ids.join(",")
    })}` : "";
    return this._api.request("GET", `images/${file_key}${queryString}`);
  }
  async getImageFills(file_key) {
    return this._api.request("GET", `files/${file_key}/images`);
  }
  async getComments(file_key) {
    return this._api.request("GET", `files/${file_key}/comments`);
  }
  async postComment(file_key, message, client_meta, comment_id) {
    return this._api.request("POST", `files/${file_key}/comments`, {
      message,
      client_meta,
      comment_id
    });
  }
  async deleteComment(file_key, comment_id) {
    return this._api.request(
      "DELETE",
      `files/${file_key}/comments/${comment_id}`
    );
  }
  async getVersions(file_key) {
    return this._api.request("GET", `files/${file_key}/versions`);
  }
  async getTeamProjects(teamId) {
    return this._api.request("GET", `teams/${teamId}/projects`);
  }
  async getProjectFiles(project_id, options) {
    const queryString = options ? `?${encodeQuery({
      ...options
    })}` : "";
    return this._api.request(
      "GET",
      `projects/${project_id}/files${queryString}`
    );
  }
  /**
   * Get a paginated list of published components within a team library
   */
  async getTeamComponents(team_id, options) {
    const queryString = options ? `?${encodeQuery(options)}` : "";
    return this._api.request("GET", `teams/${team_id}/components${queryString}`);
  }
  /**
   * Get a list of published components within a file library
   */
  async getFileComponents(file_key) {
    return this._api.request("GET", `files/${file_key}/components`);
  }
  /**
   * Get metadata on a component by key.
   */
  async getComponent(component_key) {
    return this._api.request("GET", `components/${component_key}`);
  }
  /**
   * Get a paginated list of published component_sets within a team library
   */
  async getTeamComponentSets(team_id, options) {
    const queryString = options ? `?${encodeQuery(options)}` : "";
    return this._api.request(
      "GET",
      `teams/${team_id}/component_sets${queryString}`
    );
  }
  async getFileComponentSets(file_key) {
    return this._api.request("GET", `files/${file_key}/component_sets`);
  }
  /**
   * Get metadata on a component_set by key.
   */
  async getComponentSet(key) {
    return this._api.request("GET", `component_sets/${key}`);
  }
  /**
   * Get a paginated list of published styles within a team library
   */
  async getTeamStyles(team_id, options) {
    const queryString = options ? `?${encodeQuery(options)}` : "";
    return this._api.request("GET", `teams/${team_id}/styles${queryString}`);
  }
  /**
   * Get a list of published styles within a file library
   */
  async getFileStyles(file_key) {
    return this._api.request("GET", `files/${file_key}/styles`);
  }
  /**
   * Get metadata on a style by key.
   */
  async getStyle(key) {
    return this._api.request("GET", `styles/${key}`);
  }
  // Variables - Beta API (TODO)
  // Webhooks - Beta API (TODO)
  // Activity Logs - Beta API (TODO)
  // Payments - Beta API (TODO)
  // Dev Resources - Beta API (TODO)
};
var figma_default = Figma;

// src/figma-client.ts
import_dotenv.default.config({ path: (0, import_path.resolve)(process.cwd(), ".env") });
var accessToken = process.env.FIGMA_TOKEN || "";
if (!accessToken) {
  throw new Error("FIGMA_TOKEN is not defined");
}
var client = new figma_default({
  accessToken,
  maxRetries: 3
});

// src/commands/icons/command.ts
var import_fs_extra2 = __toESM(require("fs-extra"));
var import_path3 = require("path");
var import_ts_dedent2 = __toESM(require("ts-dedent"));

// src/commands/icons/utils/generate-index.ts
var import_fs_extra = __toESM(require("fs-extra"));
var import_os = __toESM(require("os"));
var import_path2 = require("path");
var import_ts_dedent = __toESM(require("ts-dedent"));
var BANNER = import_ts_dedent.default`
    // This file is generated automatically.
` + import_os.default.EOL;
async function generateIndex(path2) {
  let index = BANNER;
  const entries = await import_fs_extra.default.readdir(path2);
  for (const entry of entries) {
    if (entry === "index.ts" || entry === "__tests__") {
      continue;
    }
    const name = entry.replace(/\.tsx?$/, "");
    const exportName = getComponentName(name);
    index += `export { default as ${exportName} } from "./${name}"${import_os.default.EOL}`;
  }
  await import_fs_extra.default.writeFile((0, import_path2.resolve)(path2, "index.ts"), index);
}

// src/commands/icons/utils/get-icon-data.ts
function getComponentName(name) {
  return name.replace(/[-_]+/g, " ").replace(/[^\w\s]/g, "").replace(
    /\s+(.)(\w*)/g,
    (_$1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
  ).replace(/\w/, (s) => s.toUpperCase());
}
function getFileName(name) {
  return `${name.replace("$", "").replace("/", "-")}.tsx`;
}
function getTestName(name) {
  return `${name.replace("$", "").replace("/", "-")}.spec.tsx`;
}
var FIXED_FRAMES = ["Flags", "Brands"];
function isFixedIcon(name, frame_name) {
  if (FIXED_FRAMES.includes(frame_name)) {
    if (frame_name === "Brands" && name.includes("-ex")) {
      return false;
    }
    return true;
  }
  return false;
}
function getIconData(name, frame_name) {
  const componentName = getComponentName(name);
  const fileName = getFileName(name);
  const testName = getTestName(name);
  const fixed = isFixedIcon(name, frame_name);
  return {
    componentName,
    testName,
    fileName,
    fixed
  };
}

// src/transformers/transform-svg.ts
var import_core = require("@svgr/core");
var import_plugin_jsx = __toESM(require("@svgr/plugin-jsx"));
var import_plugin_prettier = __toESM(require("@svgr/plugin-prettier"));
var import_plugin_svgo = __toESM(require("@svgr/plugin-svgo"));

// src/templates/icon-templates.ts
var defaultTemplate = ({ jsx: jsx2, componentName }, { tpl }) => {
  return tpl`
  import * as React from "react"

  import type { IconProps } from "../types"

  const ${componentName} = React.forwardRef<SVGSVGElement, IconProps>(({ color = "currentColor", ...props }, ref) => {
    return (
      ${jsx2}
    )
  })
  ${componentName}.displayName = "${componentName}"

  export default ${componentName}
  `;
};
var fixedTemplate = ({ jsx: jsx2, componentName }, { tpl }) => {
  return tpl`
  import * as React from "react"

  import type { IconProps } from "../types"

  const ${componentName} = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>((props, ref) => {
    return (
      ${jsx2}
    )
  })
  ${componentName}.displayName = "${componentName}"

  export default ${componentName}
  `;
};

// src/transformers/transform-svg.ts
async function transformSvg({
  code,
  componentName,
  fixed = false
}) {
  return await (0, import_core.transform)(
    code,
    {
      typescript: true,
      replaceAttrValues: !fixed ? {
        "#030712": "{color}"
      } : void 0,
      svgProps: {
        ref: "{ref}"
      },
      expandProps: "end",
      plugins: [import_plugin_svgo.default, import_plugin_jsx.default, import_plugin_prettier.default],
      jsxRuntime: "classic",
      prettierConfig: {
        semi: false,
        parser: "typescript"
      },
      svgoConfig: {
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                removeTitle: false
              }
            }
          }
        ]
      },
      template: fixed ? fixedTemplate : defaultTemplate
    },
    {
      componentName
    }
  );
}

// src/constants.ts
var FIGMA_FILE_ID = "TW0kRpjhpsi3sR1u4a4wF8";
var FIGMA_ICONS_NODE_ID = "109:599";
var FONT_FAMILY_SANS = [
  "Inter",
  "ui-sans-serif",
  "system-ui",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "Arial",
  "Noto Sans",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
  "Noto Color Emoji"
];
var FONT_FAMILY_MONO = [
  "Roboto Mono",
  "ui-monospace",
  "SFMono-Regular",
  "Menlo",
  "Monaco",
  "Consolas",
  "Liberation Mono",
  "Courier New",
  "monospace"
];

// src/logger.ts
var import_picocolors = __toESM(require("picocolors"));
var PREFIX = import_picocolors.default.magenta("[toolbox]");
var logger = {
  info: (message) => {
    console.log(`${PREFIX} ${import_picocolors.default.gray(message)}`);
  },
  success: (message) => {
    console.log(`${PREFIX} ${import_picocolors.default.green(message)}`);
  },
  warn: (message) => {
    console.log(`${PREFIX} ${import_picocolors.default.yellow(message)}`);
  },
  error: (message) => {
    console.log(`${PREFIX} ${import_picocolors.default.red(message)}`);
  }
};

// src/commands/icons/command.ts
var BANNED_FRAMES = ["Flags"];
async function generateIcons({ output }) {
  var _a;
  const skippedIcons = [];
  await import_fs_extra2.default.mkdirp(output);
  logger.info("Fetching components from Figma");
  const fileComponents = await client.getFileComponents(FIGMA_FILE_ID).then((file) => {
    logger.success("Successfully fetched components from Figma");
    return file;
  }).catch((_error) => {
    logger.error("Failed to fetch components from Figma");
    return null;
  });
  if (!fileComponents) {
    return;
  }
  logger.info("Fetching URLs for SVGs");
  const iconNodes = (_a = fileComponents.meta) == null ? void 0 : _a.components.reduce((acc, component) => {
    const frameInfo = component.containing_frame;
    if (!frameInfo) {
      return acc;
    }
    if (BANNED_FRAMES.includes(frameInfo.name)) {
      return acc;
    }
    if (frameInfo.pageId !== FIGMA_ICONS_NODE_ID) {
      return acc;
    }
    acc.push({
      node_id: component.node_id,
      name: component.name,
      frame_name: frameInfo.name
    });
    return acc;
  }, []);
  if (!iconNodes) {
    logger.error(
      "Found no SVGs to export. Make sure that the Figma file is correct."
    );
    return;
  }
  const URLData = await client.getImage(FIGMA_FILE_ID, {
    ids: iconNodes.map((icon) => icon.node_id),
    format: "svg",
    scale: 1
  });
  logger.success("Successfully fetched URLs for SVGs");
  const length = iconNodes.length;
  logger.info("Transforming SVGs");
  for (let i = 0; i < length; i += 20) {
    const slice = iconNodes.slice(i, i + 20);
    const requests = slice.map(async (icon) => {
      const URL = URLData.images[icon.node_id];
      if (!URL) {
        logger.warn(`Failed to fetch icon ${icon.name}. Skipping...`);
        skippedIcons.push(icon.name);
        return;
      }
      let code = null;
      try {
        code = await client.getResource(URL);
      } catch (e) {
        logger.warn(`Failed to fetch icon ${icon.name}. Skipping...`);
        skippedIcons.push(icon.name);
      }
      if (!code) {
        return;
      }
      const { componentName, fileName, testName, fixed } = getIconData(
        icon.name,
        icon.frame_name
      );
      const component = await transformSvg({
        code,
        componentName,
        fixed
      });
      const filePath = (0, import_path3.resolve)(output, fileName);
      await import_fs_extra2.default.outputFile(filePath, component);
      const ext = (0, import_path3.extname)(fileName);
      const fileNameWithoutExt = fileName.replace(ext, "");
      const testFilePath = (0, import_path3.resolve)((0, import_path3.join)(output, "__tests__"), testName);
      const testFile = import_ts_dedent2.default`
        import * as React from "react"
        import { cleanup, render, screen } from "@testing-library/react"

        import ${componentName} from "../${fileNameWithoutExt}"

        describe("${componentName}", () => {
          it("should render the icon without errors", async () => {
            render(<${componentName} data-testid="icon" />)

      
            const svgElement = screen.getByTestId("icon")

            expect(svgElement).toBeInTheDocument()

            cleanup()
          })
        })
      `;
      await import_fs_extra2.default.outputFile(testFilePath, testFile);
    });
    await Promise.all(requests);
  }
  logger.success("Successfully transformed SVGs");
  if (skippedIcons.length) {
    logger.warn(
      `Skipped ${skippedIcons.length} icons. Check the logs for more information.`
    );
  }
  logger.info("Generating index file");
  await generateIndex(output);
  logger.success("Successfully generated index file");
  logger.success(`Successfully generated ${length} icons \u2728`);
}

// src/create-cli.ts
var import_commander = require("commander");

// src/commands/tokens/command.ts
var import_fs_extra3 = __toESM(require("fs-extra"));
var import_path4 = __toESM(require("path"));

// src/commands/tokens/utils/colors.ts
function normalizeOpacity(opacity) {
  opacity = opacity !== void 0 ? opacity : 1;
  return Math.round(opacity * 100) / 100;
}
function normalizeChannelValue(value) {
  return Math.round(value * 255);
}
function colorToRGBA(color, opacity) {
  const red = normalizeChannelValue(color.r);
  const green = normalizeChannelValue(color.g);
  const blue = normalizeChannelValue(color.b);
  const alpha = opacity !== void 0 ? normalizeOpacity(opacity) : Math.round(color.a * 100) / 100;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
function calculateGradientDegree(handlebarPositions) {
  const startPoint = handlebarPositions[0];
  const endPoint = handlebarPositions[1];
  const angleRadians = Math.atan2(
    endPoint.y - startPoint.y,
    endPoint.x - startPoint.x
  );
  const angleDegrees = angleRadians * 180 / Math.PI;
  const normalizedAngleDegrees = (angleDegrees + 360) % 360;
  const rotatedAngleDegrees = normalizedAngleDegrees + 90;
  return rotatedAngleDegrees;
}
function linearGradientValues(gradient) {
  const opacity = normalizeOpacity(gradient.opacity) * 100;
  const degree = calculateGradientDegree(gradient.gradientHandlePositions);
  const from = colorToRGBA(gradient.gradientStops[0].color);
  const to = colorToRGBA(gradient.gradientStops[1].color);
  return {
    type: gradient.type,
    opacity,
    degree,
    from,
    to
  };
}
function createLinearGradientComponent({
  degree,
  from,
  to,
  opacity
}) {
  return {
    backgroundImage: `linear-gradient(${degree}deg, var(${from}), var(${to}))`,
    opacity: `${opacity}%`
  };
}
function gradientValues(gradient) {
  if (gradient.type === "GRADIENT_LINEAR" /* GRADIENT_LINEAR */) {
    return linearGradientValues(gradient);
  }
  logger.warn(`The gradient type "${gradient.type}" is not supported.`);
  return null;
}

// src/commands/tokens/utils/effects.ts
var SPECIAL_IDENTIFIERS = [
  "--buttons-colored",
  "--buttons-neutral",
  "--buttons-neutral-focus",
  "--buttons-colored-focus"
];
function createDropShadowVariable(effects, identifier) {
  const shadows = effects.filter(
    (effect) => effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW"
  );
  if (shadows.length === 0) {
    return null;
  }
  const value = shadows.map((shadow) => {
    const { color, offset, radius, spread, type } = shadow;
    const x = (offset == null ? void 0 : offset.x) ?? 0;
    let y = (offset == null ? void 0 : offset.y) ?? 0;
    if (SPECIAL_IDENTIFIERS.includes(identifier) && type === "INNER_SHADOW" && y > 0) {
      y = y - 1;
    }
    const b = radius;
    const s = spread ?? 0;
    const c = color ? colorToRGBA(color) : "";
    const t = type === "INNER_SHADOW" ? "inset" : "";
    return `${x}px ${y}px ${b}px ${s}px ${c} ${t}`.trim();
  }).join(", ");
  if (value.length === 0) {
    return null;
  }
  return value;
}

// src/commands/tokens/command.ts
async function generateTokens({ output }) {
  var _a;
  logger.info("Fetching file styles");
  const res = await client.getFileStyles(FIGMA_FILE_ID).catch((err) => {
    logger.error(`Failed to fetch file styles: ${err.message}`);
    process.exit(1);
  });
  logger.success("Fetched file styles successfully");
  const colorNodeIds = [];
  const textNodeIds = [];
  const effectNodeIds = [];
  (_a = res.meta) == null ? void 0 : _a.styles.forEach((style) => {
    if (style.style_type === "FILL") {
      colorNodeIds.push(style.node_id);
    }
    if (style.style_type === "TEXT") {
      textNodeIds.push(style.node_id);
    }
    if (style.style_type === "EFFECT") {
      effectNodeIds.push(style.node_id);
    }
  });
  logger.info("Fetching file nodes");
  const [colorStyles, textStyles, effectStyles] = await Promise.all([
    client.getFileNodes(FIGMA_FILE_ID, {
      ids: colorNodeIds
    }),
    client.getFileNodes(FIGMA_FILE_ID, {
      ids: textNodeIds
    }),
    client.getFileNodes(FIGMA_FILE_ID, {
      ids: effectNodeIds
    })
  ]).catch((err) => {
    logger.error(`Failed to fetch file nodes: ${err.message}`);
    process.exit(1);
  }).finally(() => {
    logger.success("Fetched file nodes successfully");
  });
  const themeNode = {
    colors: {
      dark: {},
      light: {}
    },
    effects: {
      dark: {},
      light: {}
    },
    components: {
      dark: {},
      light: {}
    }
  };
  const typo = Object.values(textStyles.nodes).reduce((acc, curr) => {
    if (!curr) {
      return acc;
    }
    const node = curr.document;
    const isText = node.name.startsWith("Text");
    if (isText) {
      const [_parent, identifier] = node.name.split("/");
      const { lineHeightPx, fontWeight, fontSize } = node.style;
      const name = "." + identifier.toLowerCase().replace("text", "txt");
      const style = {
        fontSize: `${fontSize / 16}rem`,
        lineHeight: `${lineHeightPx / 16}rem`,
        fontWeight: `${fontWeight}`,
        fontFamily: FONT_FAMILY_SANS.join(", ")
      };
      acc[name] = style;
      return acc;
    }
    const isHeader = node.name.startsWith("Headers");
    if (isHeader) {
      const [theme, identifier] = node.name.split("/");
      const formattedTheme = theme.toLowerCase().replace("headers ", "");
      const formattedIdentifier = identifier.toLowerCase();
      const name = `.${formattedIdentifier}-${formattedTheme}`;
      const { lineHeightPx, fontSize, fontWeight } = node.style;
      const style = {
        fontSize: `${fontSize / 16}rem`,
        lineHeight: `${lineHeightPx / 16}rem`,
        fontWeight: `${fontWeight}`,
        fontFamily: FONT_FAMILY_SANS.join(", ")
      };
      acc[name] = style;
      return acc;
    }
    const isCodeBlock = node.name.startsWith("Code Block");
    if (isCodeBlock) {
      const [_parent, identifier] = node.name.split("/");
      const formattedIdentifier = ".code-" + identifier.toLowerCase();
      const { lineHeightPx, fontSize, fontWeight } = node.style;
      const style = {
        fontSize: `${fontSize / 16}rem`,
        lineHeight: `${lineHeightPx / 16}rem`,
        fontWeight: `${fontWeight}`,
        fontFamily: FONT_FAMILY_MONO.join(", ")
      };
      acc[formattedIdentifier] = style;
      return acc;
    }
    return acc;
  }, {});
  const typoPath = import_path4.default.join(output, "tokens", "typography.ts");
  logger.info(`Writing typography tokens to file`);
  await import_fs_extra3.default.outputFile(
    typoPath,
    `export const typography = ${JSON.stringify(typo, null, 2)}`
  ).then(() => {
    logger.success(`Typography tokens written to file successfully`);
  }).catch((err) => {
    logger.error(`Failed to write typography tokens to file: ${err.message}`);
    process.exit(1);
  });
  Object.values(colorStyles.nodes).reduce((acc, curr) => {
    if (!curr) {
      return acc;
    }
    const [theme, _, variable] = curr.document.name.split("/");
    const lowerCaseTheme = theme.toLowerCase();
    if (lowerCaseTheme !== "light" && lowerCaseTheme !== "dark") {
      return acc;
    }
    const fills = curr.document.fills;
    const solid = fills.find((fill) => fill.type === "SOLID");
    const gradient = fills.find((fill) => fill.type === "GRADIENT_LINEAR");
    if (!solid && !gradient) {
      return acc;
    }
    const solidVariable = `--${variable}`;
    const gradientIdentifier = `${variable}-gradient`;
    if (solid && solid.color) {
      acc["colors"][lowerCaseTheme][solidVariable] = colorToRGBA(
        solid.color,
        solid.opacity
      );
    }
    if (gradient) {
      const values = gradientValues(gradient);
      if (values) {
        if (values.type === "GRADIENT_LINEAR" /* GRADIENT_LINEAR */) {
          const toVariable = `--${gradientIdentifier}-to`;
          const fromVariable = `--${gradientIdentifier}-from`;
          const component = createLinearGradientComponent({
            ...values,
            to: toVariable,
            from: fromVariable
          });
          if (component) {
            acc["colors"][lowerCaseTheme][fromVariable] = values.from;
            acc["colors"][lowerCaseTheme][toVariable] = values.to;
            acc["components"][lowerCaseTheme][`.${gradientIdentifier}`] = component;
          }
        } else {
          logger.warn(`Unsupported gradient type: ${values.type}`);
        }
      }
    }
    return acc;
  }, themeNode);
  Object.values(effectStyles.nodes).reduce((acc, curr) => {
    if (!curr) {
      return acc;
    }
    const [theme, type, variable] = curr.document.name.split("/");
    if (!type || !variable) {
      return acc;
    }
    const lowerCaseTheme = theme.toLowerCase();
    const lowerCaseType = type.toLowerCase();
    if (lowerCaseTheme !== "light" && lowerCaseTheme !== "dark") {
      return acc;
    }
    const effects = curr.document.effects;
    if (!effects) {
      return acc;
    }
    const identifier = `--${lowerCaseType}-${variable}`;
    const reversedEffects = effects.reverse();
    const value = createDropShadowVariable(reversedEffects, identifier);
    if (!value) {
      return acc;
    }
    acc["effects"][lowerCaseTheme][identifier] = value;
    return acc;
  }, themeNode);
  logger.info("Writing tokens to files");
  logger.info("Writing colors to file");
  const colorTokensPath = import_path4.default.join(output, "tokens", "colors.ts");
  await import_fs_extra3.default.outputFile(
    colorTokensPath,
    `export const colors = ${JSON.stringify(themeNode.colors, null, 2)}`
  ).then(() => {
    logger.success("Wrote colors to file successfully");
  }).catch((err) => {
    logger.error(`Failed to write colors to file: ${err.message}`);
    process.exit(1);
  });
  logger.info("Writing effects to file");
  const effectTokensPath = import_path4.default.join(output, "tokens", "effects.ts");
  await import_fs_extra3.default.outputFile(
    effectTokensPath,
    `export const effects = ${JSON.stringify(themeNode.effects, null, 2)}`
  ).then(() => {
    logger.success("Wrote effects to file successfully");
  }).catch((err) => {
    logger.error(`Failed to write effects to file: ${err.message}`);
    process.exit(1);
  });
  logger.info("Writing components to file");
  const componentTokensPath = import_path4.default.join(output, "tokens", "components.ts");
  await import_fs_extra3.default.outputFile(
    componentTokensPath,
    `export const components = ${JSON.stringify(
      themeNode.components,
      null,
      2
    )}`
  ).then(() => {
    logger.success("Wrote components to file successfully");
  }).catch((err) => {
    logger.error(`Failed to write components to file: ${err.message}`);
    process.exit(1);
  });
  logger.success("Wrote tokens to files successfully");
  logger.info("Extending Tailwind config");
  const colorsExtension = {};
  Object.keys(themeNode.colors.light).reduce((acc, curr) => {
    const [prefix, style, state, context, ...others] = curr.split(/(?<=\w)-(?=\w)/);
    if (state === "gradient" || context === "gradient" || others.length > 0 && others.includes("gradient")) {
      return acc;
    }
    const fixedPrefix = prefix.replace("--", "");
    if (!acc[fixedPrefix]) {
      acc[fixedPrefix] = {};
    }
    if (!acc[fixedPrefix][style]) {
      acc[fixedPrefix][style] = {};
    }
    if (!state) {
      acc[fixedPrefix][style] = {
        ...acc[fixedPrefix][style],
        DEFAULT: `var(${curr})`
      };
      return acc;
    }
    if (!acc[fixedPrefix][style][state]) {
      acc[fixedPrefix][style][state] = {};
    }
    if (!context) {
      acc[fixedPrefix][style][state] = {
        ...acc[fixedPrefix][style][state],
        DEFAULT: `var(${curr})`
      };
      return acc;
    }
    if (context === "gradient") {
      return acc;
    }
    if (!acc[fixedPrefix][style][state][context]) {
      acc[fixedPrefix][style][state][context] = {};
    }
    acc[fixedPrefix][style][state][context] = {
      ...acc[fixedPrefix][style][state][context],
      DEFAULT: `var(${curr})`
    };
    return acc;
  }, colorsExtension);
  const boxShadowExtension = {};
  Object.keys(themeNode.effects.light).reduce((acc, curr) => {
    const key = `${curr.replace("--", "")}`;
    acc[key] = `var(${curr})`;
    return acc;
  }, boxShadowExtension);
  const themeExtension = {
    extend: {
      colors: {
        ui: colorsExtension
      },
      boxShadow: boxShadowExtension
    }
  };
  const tailwindConfigPath = import_path4.default.join(output, "extension", "theme.ts");
  await import_fs_extra3.default.outputFile(
    tailwindConfigPath,
    `export const theme = ${JSON.stringify(themeExtension, null, 2)}`
  ).then(() => {
    logger.success("Wrote Tailwind config extension successfully");
  }).catch((err) => {
    logger.error(`Failed to write Tailwind config extension: ${err.message}`);
    process.exit(1);
  });
  logger.success("Extended Tailwind config successfully");
}

// package.json
var package_default = {
  name: "@medusajs/toolbox",
  private: true,
  version: "0.0.1",
  description: "CLI tool for importing Figma designs for Medusa UI",
  license: "MIT",
  author: "Kasper Kristensen <kasper@medusajs.com>",
  bin: "./bin/toolbox.js",
  scripts: {
    build: "tsup"
  },
  dependencies: {
    "@svgr/core": "8.0.0",
    "@svgr/plugin-jsx": "8.0.1",
    "@svgr/plugin-prettier": "8.0.1",
    "@svgr/plugin-svgo": "8.0.1",
    axios: "^0.24.0",
    commander: "11.0.0",
    dotenv: "^16.4.5",
    "fs-extra": "11.1.1",
    picocolors: "^1.0.0",
    "retry-axios": "^2.6.0",
    "ts-dedent": "2.2.0"
  },
  devDependencies: {
    "@types/fs-extra": "11.0.1",
    "@types/react": "^18.2.14",
    eslint: "7.32.0",
    react: "^18.2.0",
    tsup: "7.1.0",
    typescript: "5.1.6"
  }
};

// src/create-cli.ts
async function createCli() {
  const program = new import_commander.Command();
  program.name("toolbox").version(package_default.version);
  const generateIconsCommand = program.command("icons");
  generateIconsCommand.description("Generate icons from Figma");
  generateIconsCommand.option("-o, --output <path>", "Output directory");
  generateIconsCommand.action(generateIcons);
  const generateTokensCommand = program.command("tokens");
  generateTokensCommand.description("Generate tokens from Figma");
  generateTokensCommand.option("-o, --output <path>", "Output directory");
  generateTokensCommand.action(generateTokens);
  return program;
}

// src/index.ts
createCli().then(async (cli) => cli.parseAsync(process.argv)).catch((err) => {
  console.error(err);
  process.exit(1);
});
//# sourceMappingURL=index.js.map