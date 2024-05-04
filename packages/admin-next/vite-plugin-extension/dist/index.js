"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => inject
});
module.exports = __toCommonJS(src_exports);
var import_parser = require("@babel/parser");
var import_traverse = __toESM(require("@babel/traverse"));
var import_chokidar = __toESM(require("chokidar"));
var import_fdir = require("fdir");
var import_promises = __toESM(require("fs/promises"));
var import_magic_string = __toESM(require("magic-string"));
var import_path = __toESM(require("path"));

// ../admin-shared/dist/constants.js
var injectionZones = [
  // Order injection zones
  "order.details.before",
  "order.details.after",
  "order.list.before",
  "order.list.after",
  // Draft order injection zones
  "draft_order.list.before",
  "draft_order.list.after",
  "draft_order.details.before",
  "draft_order.details.after",
  // Customer injection zones
  "customer.details.before",
  "customer.details.after",
  "customer.list.before",
  "customer.list.after",
  // Customer group injection zones
  "customer_group.details.before",
  "customer_group.details.after",
  "customer_group.list.before",
  "customer_group.list.after",
  // Product injection zones
  "product.details.before",
  "product.details.after",
  "product.list.before",
  "product.list.after",
  "product.details.side.before",
  "product.details.side.after",
  // Product collection injection zones
  "product_collection.details.before",
  "product_collection.details.after",
  "product_collection.list.before",
  "product_collection.list.after",
  // Product category injection zones
  "product_category.details.before",
  "product_category.details.after",
  "product_category.list.before",
  "product_category.list.after",
  // Price list injection zones
  "price_list.details.before",
  "price_list.details.after",
  "price_list.list.before",
  "price_list.list.after",
  // Discount injection zones
  "discount.details.before",
  "discount.details.after",
  "discount.list.before",
  "discount.list.after",
  // Promotion injection zones
  "promotion.details.before",
  "promotion.details.after",
  "promotion.list.before",
  "promotion.list.after",
  // Gift card injection zones
  "gift_card.details.before",
  "gift_card.details.after",
  "gift_card.list.before",
  "gift_card.list.after",
  "custom_gift_card.before",
  "custom_gift_card.after",
  // Login
  "login.before",
  "login.after"
];

// src/index.ts
var traverse = import_traverse.default.default;
var VIRTUAL_PREFIX = "/@virtual/medusajs-vite-plugin-extension/";
var IMPORT_PREFIX = "medusa-admin:";
var WIDGET_MODULE = `${IMPORT_PREFIX}widgets/`;
var WIDGET_MODULES = injectionZones.map((zone) => {
  return `${WIDGET_MODULE}${zone.replace(/\./g, "/")}`;
});
var ROUTE_PAGE_MODULE = `${IMPORT_PREFIX}routes/pages`;
var ROUTE_LINK_MODULE = `${IMPORT_PREFIX}routes/links`;
var ROUTE_MODULES = [ROUTE_PAGE_MODULE, ROUTE_LINK_MODULE];
var SETTING_PAGE_MODULE = `${IMPORT_PREFIX}settings/pages`;
var SETTING_CARD_MODULE = `${IMPORT_PREFIX}settings/cards`;
var SETTING_MODULE = [SETTING_PAGE_MODULE, SETTING_CARD_MODULE];
var MODULES = [...WIDGET_MODULES, ...ROUTE_MODULES, ...SETTING_MODULE];
function inject(args) {
  const _extensionGraph = /* @__PURE__ */ new Map();
  const _sources = /* @__PURE__ */ new Set([...args?.sources || []]);
  let server;
  let watcher;
  let logger;
  async function traverseDirectory(dir, file, depth) {
    const baseDepth = dir.split(import_path.default.sep).length;
    const crawler = new import_fdir.fdir().withBasePath().exclude((dirName) => dirName.startsWith("_")).filter((path2) => path2.endsWith(".tsx") || path2.endsWith(".jsx"));
    if (file) {
      crawler.filter(
        (path2) => path2.endsWith(`${file}.tsx`) || path2.endsWith(`${file}.jsx`)
      );
    }
    if (depth) {
      crawler.filter((file2) => {
        const directoryDepth = file2.split(import_path.default.sep).length - 1;
        if (depth.max && directoryDepth > baseDepth + depth.max) {
          return false;
        }
        if (directoryDepth < baseDepth + depth.min) {
          return false;
        }
        return true;
      });
    }
    return await crawler.crawl(dir).withPromise();
  }
  function generateModule(code) {
    const magicString = new import_magic_string.default(code);
    return {
      code: magicString.toString(),
      map: magicString.generateMap({ hires: true })
    };
  }
  function validateDefaultExport(path2, ast) {
    let hasComponentExport = false;
    const declaration = path2.node.declaration;
    if (declaration && (declaration.type === "Identifier" || declaration.type === "FunctionDeclaration")) {
      const exportName = declaration.type === "Identifier" ? declaration.name : declaration.id && declaration.id.name;
      if (exportName) {
        try {
          traverse(ast, {
            VariableDeclarator({ node, scope }) {
              let isDefaultExport = false;
              if (node.id.type === "Identifier" && node.id.name === exportName) {
                isDefaultExport = true;
              }
              if (!isDefaultExport) {
                return;
              }
              traverse(
                node,
                {
                  ReturnStatement(path3) {
                    if (path3.node.argument?.type === "JSXElement" || path3.node.argument?.type === "JSXFragment") {
                      hasComponentExport = true;
                    }
                  }
                },
                scope
              );
            }
          });
        } catch (e) {
          console.error(
            `An error occured while validating the default export of '${path2}'. The following error must be resolved before continuing:
${e}`
          );
          return false;
        }
      }
    }
    return hasComponentExport;
  }
  function getProperties(path2) {
    const declaration = path2.node.declaration;
    if (declaration && declaration.type === "VariableDeclaration") {
      const configDeclaration = declaration.declarations.find(
        (d) => d.type === "VariableDeclarator" && d.id.type === "Identifier" && d.id.name === "config"
      );
      if (configDeclaration && configDeclaration.init?.type === "ObjectExpression") {
        return configDeclaration.init.properties;
      }
    }
    return null;
  }
  function validateInjectionZone(zone) {
    return injectionZones.includes(zone);
  }
  function validateWidgetConfig(path2, zone) {
    const properties = getProperties(path2);
    if (!properties) {
      return { zoneIsValid: false, zoneValue: void 0 };
    }
    const zoneProperty = properties.find(
      (p) => p.type === "ObjectProperty" && p.key.type === "Identifier" && p.key.name === "zone"
    );
    if (!zoneProperty) {
      return { zoneIsValid: false, zoneValue: void 0 };
    }
    let zoneIsValid = false;
    let zoneValue = void 0;
    if (zoneProperty.value.type === "StringLiteral") {
      zoneIsValid = !zone ? validateInjectionZone(zoneProperty.value.value) : zone === zoneProperty.value.value;
      zoneValue = zoneProperty.value.value;
    } else if (zoneProperty.value.type === "ArrayExpression") {
      zoneIsValid = zoneProperty.value.elements.every((_zone) => {
        if (!_zone || _zone.type !== "StringLiteral") {
          return false;
        }
        const isZoneMatch = !zone ? true : zone === _zone.value;
        return validateInjectionZone(_zone.value) && isZoneMatch;
      });
      zoneValue = zoneProperty.value.elements.map((e) => {
        if (e && e.type === "StringLiteral") {
          return e.value;
        }
      }).filter(Boolean);
    }
    return { zoneIsValid, zoneValue };
  }
  async function validateWidget(file, zone) {
    const content = await import_promises.default.readFile(file, "utf-8");
    const parserOptions = {
      sourceType: "module",
      plugins: ["jsx"]
    };
    if (file.endsWith(".tsx")) {
      parserOptions.plugins?.push("typescript");
    }
    let ast;
    try {
      ast = (0, import_parser.parse)(content, parserOptions);
    } catch (err) {
      logger.error(
        `An error occured while parsing the content of ${file}:
${err}`,
        {
          error: err,
          timestamp: true
        }
      );
      return { isValidWidget: false, zoneValue: void 0 };
    }
    let hasDefaultExport = false;
    let hasNamedExport = false;
    let zoneValue;
    try {
      traverse(ast, {
        ExportDefaultDeclaration(path2) {
          hasDefaultExport = validateDefaultExport(path2, ast);
        },
        ExportNamedDeclaration(path2) {
          const { zoneIsValid, zoneValue: value } = validateWidgetConfig(
            path2,
            zone
          );
          hasNamedExport = zoneIsValid;
          zoneValue = value;
        }
      });
    } catch (err) {
      logger.error(`An error occured while validating the content of ${file}`, {
        error: err,
        timestamp: true
      });
      return { isValidWidget: false, zoneValue: void 0 };
    }
    return { isValidWidget: hasDefaultExport && hasNamedExport, zoneValue };
  }
  async function generateWidgetEntrypoint(zone) {
    const files = (await Promise.all(
      Array.from(_sources).map(
        (source) => traverseDirectory(`${source}/widgets`)
      )
    )).flat();
    const validatedWidgets = (await Promise.all(
      files.map(async (widget) => {
        const { isValidWidget } = await validateWidget(widget, zone);
        return isValidWidget ? widget : null;
      })
    )).filter(Boolean);
    if (!validatedWidgets.length) {
      const code2 = `export default {
        widgets: [],
      }`;
      return { module: generateModule(code2), paths: [] };
    }
    const importString = validatedWidgets.map((path2, index) => `import WidgetExt${index} from "${path2}";`).join("\n");
    const exportString = `export default {
      widgets: [${validatedWidgets.map((_, index) => `{ Component: WidgetExt${index} }`).join(", ")}],
    }`;
    const code = `${importString}
${exportString}`;
    return { module: generateModule(code), paths: validatedWidgets };
  }
  function validateRouteConfig(path2, requireLink) {
    const properties = getProperties(path2);
    if (!properties) {
      return false;
    }
    const linkProperty = properties.find(
      (p) => p.type === "ObjectProperty" && p.key.type === "Identifier" && p.key.name === "link"
    );
    if (!linkProperty && !requireLink) {
      return true;
    }
    const linkValue = linkProperty?.value;
    if (!linkValue) {
      return false;
    }
    let labelIsValid = false;
    if (linkValue.properties.some(
      (p) => p.type === "ObjectProperty" && p.key.type === "Identifier" && p.key.name === "label" && p.value.type === "StringLiteral"
    )) {
      labelIsValid = true;
    }
    return labelIsValid;
  }
  async function validateRoute(file, requireLink) {
    const content = await import_promises.default.readFile(file, "utf-8");
    const parserOptions = {
      sourceType: "module",
      plugins: ["jsx"]
    };
    if (file.endsWith(".tsx")) {
      parserOptions.plugins?.push("typescript");
    }
    let ast;
    try {
      ast = (0, import_parser.parse)(content, parserOptions);
    } catch (err) {
      logger.error("An error occured while validating a route.", {
        error: err,
        timestamp: true
      });
      return false;
    }
    let hasDefaultExport = false;
    let hasNamedExport = false;
    try {
      traverse(ast, {
        ExportDefaultDeclaration(path2) {
          hasDefaultExport = validateDefaultExport(path2, ast);
        },
        ExportNamedDeclaration(path2) {
          hasNamedExport = validateRouteConfig(path2, requireLink);
        }
      });
    } catch (err) {
      logger.error("An error occured while validating a route.", {
        error: err,
        timestamp: true
      });
      return false;
    }
    return hasDefaultExport && hasNamedExport;
  }
  function createPath(file) {
    return file.replace(/.*\/admin\/(routes|settings)/, "").replace(/\[([^\]]+)\]/g, ":$1").replace(/\/page\.(tsx|jsx)/, "");
  }
  async function generateRouteEntrypoint(get) {
    const files = (await Promise.all(
      Array.from(_sources).map(
        (source) => traverseDirectory(`${source}/routes`, "page", { min: 1 })
      )
    )).flat();
    const validatedRoutes = (await Promise.all(
      files.map(async (route) => {
        const isValid = await validateRoute(route, get === "link");
        return isValid ? route : null;
      })
    )).filter(Boolean);
    if (!validatedRoutes.length) {
      const code2 = `export default {
        ${get}s: [],
      }`;
      return { module: generateModule(code2), paths: [] };
    }
    const importString = validatedRoutes.map((path2, index) => {
      return get === "page" ? `import RouteExt${index} from "${path2}";` : `import { config as routeConfig${index} } from "${path2}";`;
    }).join("\n");
    const exportString = `export default {
      ${get}s: [${validatedRoutes.map(
      (file, index) => get === "page" ? `{ path: "${createPath(file)}", file: "${file}" }` : `{ path: "${createPath(file)}", ...routeConfig${index}.link }`
    ).join(", ")}],
    }`;
    const code = `${importString}
${exportString}`;
    return { module: generateModule(code), paths: validatedRoutes };
  }
  async function validateSetting(file) {
    const content = await import_promises.default.readFile(file, "utf-8");
    const parserOptions = {
      sourceType: "module",
      plugins: ["jsx"]
    };
    if (file.endsWith(".tsx")) {
      parserOptions.plugins?.push("typescript");
    }
    let ast;
    try {
      ast = (0, import_parser.parse)(content, parserOptions);
    } catch (err) {
      logger.error("An error occured while validating a setting.", {
        error: err,
        timestamp: true
      });
      return false;
    }
    let hasDefaultExport = false;
    let hasNamedExport = false;
    try {
      traverse(ast, {
        ExportDefaultDeclaration(path2) {
          hasDefaultExport = validateDefaultExport(path2, ast);
        },
        ExportNamedDeclaration(path2) {
          hasNamedExport = validateSettingConfig(path2);
        }
      });
    } catch (err) {
      logger.error("An error occured while validating a setting.", {
        error: err,
        timestamp: true
      });
      return false;
    }
    return hasDefaultExport && hasNamedExport;
  }
  function validateSettingConfig(path2) {
    const properties = getProperties(path2);
    if (!properties) {
      return false;
    }
    const cardProperty = properties.find(
      (p) => p.type === "ObjectProperty" && p.key.type === "Identifier" && p.key.name === "card"
    );
    if (!cardProperty) {
      return false;
    }
    const cardValue = cardProperty.value;
    let hasLabel = false;
    let hasDescription = false;
    if (cardValue.properties.some(
      (p) => p.type === "ObjectProperty" && p.key.type === "Identifier" && p.key.name === "label" && p.value.type === "StringLiteral"
    )) {
      hasLabel = true;
    }
    if (cardValue.properties.some(
      (p) => p.type === "ObjectProperty" && p.key.type === "Identifier" && p.key.name === "description" && p.value.type === "StringLiteral"
    )) {
      hasDescription = true;
    }
    return hasLabel && hasDescription;
  }
  async function generateSettingEntrypoint(get) {
    const files = (await Promise.all(
      Array.from(_sources).map(
        (source) => traverseDirectory(`${source}/settings`, "page", { min: 1, max: 1 })
      )
    )).flat();
    const validatedSettings = (await Promise.all(
      files.map(async (setting) => {
        const isValid = await validateSetting(setting);
        return isValid ? setting : null;
      })
    )).filter(Boolean);
    if (!validatedSettings.length) {
      const code2 = `export default {
        ${get}s: [],
      }`;
      return { module: generateModule(code2), paths: [] };
    }
    const importString = validatedSettings.map((path2, index) => {
      return get === "page" ? `import SettingExt${index} from "${path2}";` : `import { config as settingConfig${index} } from "${path2}";`;
    }).join("\n");
    const exportString = `export default {
      ${get}s: [${validatedSettings.map(
      (file, index) => get === "page" ? `{ path: "${createPath(file)}", file: "${file}" }` : `{ path: "${createPath(file)}", ...settingConfig${index}.card }`
    ).join(", ")}],
    }`;
    const code = `${importString}
${exportString}`;
    return { module: generateModule(code), paths: validatedSettings };
  }
  async function loadModule(options) {
    switch (options.type) {
      case "widget": {
        return await generateWidgetEntrypoint(options.get);
      }
      case "route": {
        return await generateRouteEntrypoint(options.get);
      }
      case "setting": {
        return await generateSettingEntrypoint(options.get);
      }
    }
  }
  function getExtensionType(file) {
    const normalizedPath = import_path.default.normalize(file);
    if (normalizedPath.includes(import_path.default.normalize("/admin/widgets/"))) {
      return "widget";
    } else if (normalizedPath.includes(import_path.default.normalize("/admin/routes/"))) {
      return "route";
    } else if (normalizedPath.includes(import_path.default.normalize("/admin/settings/"))) {
      return "setting";
    } else {
      return "none";
    }
  }
  async function handleWidgetChange(file) {
    const { isValidWidget, zoneValue } = await validateWidget(file);
    if (!isValidWidget || !zoneValue) {
      _extensionGraph.delete(file);
      return;
    }
    const zoneValues = Array.isArray(zoneValue) ? zoneValue : [zoneValue];
    for (const zone of zoneValues) {
      const zonePath = zone.replace(/\./g, "/");
      const moduleId = `${VIRTUAL_PREFIX}${WIDGET_MODULE}${zonePath}`;
      const module2 = server.moduleGraph.getModuleById(moduleId);
      if (module2) {
        server.reloadModule(module2);
      }
    }
  }
  async function handleRouteChange(file) {
    const isValidRoute = await validateRoute(file, false);
    if (!isValidRoute) {
      _extensionGraph.delete(file);
      return;
    }
    for (const moduleId of ROUTE_MODULES) {
      const fullModuleId = `${VIRTUAL_PREFIX}${moduleId}`;
      const module2 = server.moduleGraph.getModuleById(fullModuleId);
      if (module2) {
        server.reloadModule(module2);
      }
    }
  }
  async function handleSettingChange(file) {
    const isValidSetting = await validateSetting(file);
    if (!isValidSetting) {
      _extensionGraph.delete(file);
      return;
    }
    for (const moduleId of SETTING_MODULE) {
      const fullModuleId = `${VIRTUAL_PREFIX}${moduleId}`;
      const module2 = server.moduleGraph.getModuleById(fullModuleId);
      if (module2) {
        server.reloadModule(module2);
      }
    }
  }
  async function handleExtensionUnlink(file) {
    const moduleIds = _extensionGraph.get(file);
    if (!moduleIds) {
      return;
    }
    for (const moduleId of moduleIds) {
      const module2 = server.moduleGraph.getModuleById(moduleId);
      if (module2) {
        _extensionGraph.delete(file);
        server.reloadModule(module2);
      }
    }
  }
  async function loadModuleAndUpdateGraph(id, options) {
    const { module: module2, paths } = await loadModule(options);
    for (const path2 of paths) {
      const ids = _extensionGraph.get(path2) || /* @__PURE__ */ new Set();
      ids.add(id);
      _extensionGraph.set(path2, ids);
    }
    return module2;
  }
  return {
    name: "@medusajs/vite-plugin-extension",
    configureServer(s) {
      server = s;
      logger = s.config.logger;
      watcher = import_chokidar.default.watch(Array.from(_sources), {
        persistent: true,
        ignoreInitial: true
      });
      watcher.on("add", async (file) => {
        const type = getExtensionType(file);
        if (type === "none") {
          return;
        }
        if (type === "widget") {
          await handleWidgetChange(file);
          return;
        }
        if (type === "route") {
          await handleRouteChange(file);
          return;
        }
        if (type === "setting") {
          await handleSettingChange(file);
          return;
        }
        return;
      });
      watcher.on("change", async (file) => {
        const type = getExtensionType(file);
        if (type === "none") {
          return;
        }
        if (type === "widget") {
          await handleWidgetChange(file);
          return;
        }
        if (type === "route") {
          await handleRouteChange(file);
          return;
        }
        if (type === "setting") {
          await handleSettingChange(file);
          return;
        }
        return;
      });
      watcher.on("unlink", (file) => {
        handleExtensionUnlink(file);
        return;
      });
    },
    resolveId(id) {
      if (MODULES.includes(id)) {
        return VIRTUAL_PREFIX + id;
      }
      return null;
    },
    async load(id) {
      if (!id.startsWith(VIRTUAL_PREFIX)) {
        return null;
      }
      const idNoPrefix = id.slice(VIRTUAL_PREFIX.length);
      const moduleMap = {
        [ROUTE_PAGE_MODULE]: { type: "route", get: "page" },
        [ROUTE_LINK_MODULE]: { type: "route", get: "link" },
        [SETTING_PAGE_MODULE]: { type: "setting", get: "page" },
        [SETTING_CARD_MODULE]: { type: "setting", get: "card" }
      };
      if (WIDGET_MODULES.includes(idNoPrefix)) {
        const zone = idNoPrefix.replace(WIDGET_MODULE, "").replace(/\//g, ".");
        return loadModuleAndUpdateGraph(id, { type: "widget", get: zone });
      }
      const moduleOptions = moduleMap[idNoPrefix];
      if (moduleOptions) {
        return loadModuleAndUpdateGraph(id, moduleOptions);
      }
      return null;
    },
    closeBundle() {
      if (watcher) {
        watcher.close();
      }
    }
  };
}
