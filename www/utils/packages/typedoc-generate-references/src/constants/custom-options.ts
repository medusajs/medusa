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
  "auth-provider": getOptions({
    entryPointPath: "packages/core/utils/src/auth/abstract-auth-provider.ts",
    tsConfigName: "utils.json",
    name: "auth-provider",
    parentIgnore: true,
  }),
  dml: getOptions({
    entryPointPath: [
      "packages/core/utils/src/dml/entity-builder.ts",
      "packages/core/utils/src/dml/entity.ts",
      "packages/core/utils/src/dml/properties/base.ts",
    ],
    tsConfigName: "utils.json",
    name: "dml",
    generateNamespaces: true,
  }),
  file: getOptions({
    entryPointPath: "packages/core/utils/src/file/abstract-file-provider.ts",
    tsConfigName: "utils.json",
    name: "file",
    parentIgnore: true,
  }),
  "fulfillment-provider": getOptions({
    entryPointPath: "packages/core/utils/src/fulfillment/provider.ts",
    tsConfigName: "utils.json",
    name: "fulfillment-provider",
    parentIgnore: true,
  }),
  "helper-steps": getOptions({
    entryPointPath: "packages/core/core-flows/src/common/index.ts",
    tsConfigName: "core-flows.json",
    name: "helper-steps",
    exclude: [
      ...(baseOptions.exclude || []),
      path.join(
        rootPathPrefix,
        "packages/core/core-flows/src/common/workflows/**.ts"
      ),
    ],
  }),
  "medusa-config": getOptions({
    entryPointPath: "packages/core/types/src/common/config-module.ts",
    tsConfigName: "types.json",
    name: "medusa-config",
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
  "payment-provider": getOptions({
    entryPointPath:
      "packages/core/utils/src/payment/abstract-payment-provider.ts",
    tsConfigName: "utils.json",
    name: "payment-provider",
  }),
  search: getOptions({
    entryPointPath: "packages/core/utils/src/search/abstract-service.ts",
    tsConfigName: "utils.json",
    name: "search",
  }),
  "tax-provider": getOptions({
    entryPointPath: "packages/core/types/src/tax/provider.ts",
    tsConfigName: "types.json",
    name: "tax-provider",
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
  "modules-sdk": getOptions({
    entryPointPath: "packages/core/modules-sdk/src/index.ts",
    tsConfigName: "modules-sdk.json",
    name: "modules-sdk",
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
      "**/dml/**",
    ],
  }),
  workflows: getOptions({
    entryPointPath: "packages/core/workflows-sdk/src/utils/composer/index.ts",
    tsConfigName: "workflows.json",
    name: "workflows",
  }),
}

export default customOptions
