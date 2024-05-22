// any reference in this object doesn't use one of the
// helper functions to get its options and use these options
// instead as-is

import { TypeDocOptions } from "typedoc"
import getOptions from "../utils/get-options.js"
import { baseOptions } from "./base-options.js"
import path from "path"
import { rootPathPrefix } from "./general.js"
import { modules } from "./references.js"

const customOptions: Record<string, Partial<TypeDocOptions>> = {
  entities: getOptions({
    entryPointPath: "packages/medusa/src/models/index.ts",
    tsConfigName: "medusa.json",
    name: "entities",
  }),
  file: getOptions({
    entryPointPath: "packages/core/utils/src/file/abstract-file-provider.ts",
    tsConfigName: "utils.json",
    name: "file",
    parentIgnore: true,
  }),
  "fulfillment-service": getOptions({
    entryPointPath: "packages/medusa/src/interfaces/fulfillment-service.ts",
    tsConfigName: "medusa.json",
    name: "fulfillment-service",
    parentIgnore: true,
  }),
  "js-client": getOptions({
    entryPointPath: "packages/medusa-js/src/resources",
    tsConfigName: "js-client.json",
    name: "js-client",
    plugin: ["typedoc-plugin-rename-defaults"],
    exclude: [
      ...(baseOptions.exclude || []),
      path.join(rootPathPrefix, "packages/medusa-js/src/resources/base.ts"),
    ],
    ignoreApi: true,
  }),
  "medusa-config": getOptions({
    entryPointPath: "packages/core/types/src/common/config-module.ts",
    tsConfigName: "types.json",
    name: "medusa-config",
  }),
  "medusa-react": getOptions({
    entryPointPath: "packages/medusa-react/src/index.ts",
    tsConfigName: "medusa-react.json",
    name: "medusa-react",
    generateNamespaces: true,
    ignoreApi: true,
  }),
  medusa: getOptions({
    entryPointPath: "packages/medusa/src/index.js",
    tsConfigName: "medusa.json",
    name: "medusa",
    jsonFileName: "0-medusa",
    enableInternalResolve: true,
    exclude: [
      ...(baseOptions.exclude || []),
      "**/bin/*.ts",
      "**/commands/**",
      "**/controllers/**",
      "**/helpers/*.ts",
      "**/interfaces/*.ts",
      "**/joiner-configs/*.ts",
      "**/loaders/**",
      "**/migrations/**",
      "**/models/*.ts",
      "**/repositories/*.ts",
      "**/scripts/**",
      "**/services/*.ts",
      "**/strategies/**",
      "**/subscribers/*.ts",
      `${path.join(rootPathPrefix, "packages", "medusa", "src", "utils")}/**`,
      "**/joiner-config.ts",
      "**/modules-config.ts",
    ],
  }),
  notification: getOptions({
    entryPointPath:
      "packages/core/utils/src/notification/abstract-notification-provider.ts",
    tsConfigName: "utils.json",
    name: "notification",
    parentIgnore: true,
  }),
  "payment-processor": getOptions({
    entryPointPath: "packages/medusa/src/interfaces/payment-processor.ts",
    tsConfigName: "medusa.json",
    name: "payment-processor",
  }),
  "payment-provider": getOptions({
    entryPointPath:
      "packages/core/utils/src/payment/abstract-payment-provider.ts",
    tsConfigName: "utils.json",
    name: "payment-provider",
  }),
  "price-selection": getOptions({
    entryPointPath:
      "packages/medusa/src/interfaces/price-selection-strategy.ts",
    tsConfigName: "medusa.json",
    name: "price-selection",
    parentIgnore: true,
  }),
  search: getOptions({
    entryPointPath: "packages/core/utils/src/search/abstract-service.ts",
    tsConfigName: "utils.json",
    name: "search",
  }),
  services: getOptions({
    entryPointPath: "packages/medusa/src/services/index.ts",
    tsConfigName: "medusa.json",
    name: "services",
  }),
  "tax-calculation": getOptions({
    entryPointPath:
      "packages/medusa/src/interfaces/tax-calculation-strategy.ts",
    tsConfigName: "medusa.json",
    name: "tax-calculation",
    parentIgnore: true,
  }),
  "tax-provider": getOptions({
    entryPointPath: "packages/core/types/src/tax/provider.ts",
    tsConfigName: "types.json",
    name: "tax-provider",
  }),
  "tax-service": getOptions({
    entryPointPath: "packages/medusa/src/interfaces/tax-service.ts",
    tsConfigName: "medusa.json",
    name: "tax-service",
    parentIgnore: true,
  }),
  types: getOptions({
    entryPointPath: "packages/core/types/src/index.ts",
    tsConfigName: "types.json",
    name: "types",
    jsonFileName: "0-types",
    enableInternalResolve: true,
    exclude: [
      ...(baseOptions.exclude || []),
      ...modules.map((moduleName) => `**/${moduleName}/**/*.ts`),
    ],
  }),
  workflows: getOptions({
    entryPointPath: "packages/core/workflows-sdk/src/utils/composer/index.ts",
    tsConfigName: "workflows.json",
    name: "workflows",
  }),
  utils: getOptions({
    entryPointPath: "packages/core/utils/src/index.ts",
    tsConfigName: "utils.json",
    name: "utils",
    jsonFileName: "0-utils",
    enableInternalResolve: true,
    exclude: [
      ...(baseOptions.exclude || []),
      "**/api-key/**",
      "**/common/**",
      "**/dal/**/**",
      "**/decorators/**",
      "**/defaults/**",
      "**/**provider.ts",
      "**/event-bus/**",
      "**/exceptions/**",
      "**/feature-flags/**",
      "**/modules-sdk/**",
      "**/orchestration/**",
      "**/pricing/builders.ts",
      "**/search/**",
      "**/totals/**",
    ],
  }),
}

export default customOptions
