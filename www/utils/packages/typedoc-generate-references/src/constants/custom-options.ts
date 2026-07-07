// any reference in this object doesn't use one of the
// helper functions to get its options and use these options
// instead as-is

import { TypeDocOptions } from "typedoc"
import getOptions from "../utils/get-options.js"
import { baseOptions } from "./base-options.js"
import path from "path"
import { rootPathPrefix } from "./general.js"
import { modules } from "./references.js"
import { getCoreFlowNamespaces } from "../utils/get-namespaces.js"

const customOptions: Record<string, Partial<TypeDocOptions>> = {
  "auth-provider": getOptions({
    entryPointPath: "packages/core/utils/src/auth/abstract-auth-provider.ts",
    tsConfigName: "utils.json",
    name: "auth-provider",
    parentIgnore: true,
  }),
  cache: getOptions({
    entryPointPath: "packages/core/types/src/cache/service.ts",
    tsConfigName: "types.json",
    name: "cache",
  }),
  caching: getOptions({
    entryPointPath: "packages/core/types/src/caching/index.ts",
    tsConfigName: "types.json",
    name: "caching",
  }),
  "core-flows": getOptions({
    entryPointPath: [
      "packages/core/core-flows/src/index.ts",
      "packages/plugins/loyalty/src/workflows/index.ts",
    ],
    tsConfigName: "core-flows.json",
    name: "core-flows",
    plugin: ["typedoc-plugin-workflows"],
    enableWorkflowsPlugins: true,
    enablePathNamespaceGenerator: true,
    // @ts-expect-error there's a typing issue in typedoc
    generatePathNamespaces: getCoreFlowNamespaces(),
  }),
  dml: getOptions({
    entryPointPath: [
      "packages/core/utils/src/dml/entity-builder.ts",
      "packages/core/utils/src/dml/entity.ts",
      "packages/core/utils/src/dml/properties/base.ts",
    ],
    tsConfigName: "utils.json",
    name: "dml",
    generateCustomNamespaces: true,
  }),
  event: getOptions({
    entryPointPath: "packages/core/types/src/event-bus/event-bus-module.ts",
    tsConfigName: "types.json",
    name: "event",
  }),
  events: getOptions({
    entryPointPath: [
      "packages/core/utils/src/core-flows/events.ts",
      "packages/core/utils/src/auth/events.ts"
    ],
    tsConfigName: "utils.json",
    name: "events",
    enableEventsResolver: true,
  }),
  "module-events": getOptions({
    entryPointPath: [
      "packages/core/utils/src/core-flows/events.ts",
      "packages/core/utils/src/auth/events.ts"
    ],
    tsConfigName: "utils.json",
    name: "module-events",
    enableEventsResolver: true,
    generateCustomNamespaces: true,
  }),
  file: getOptions({
    entryPointPath: "packages/core/utils/src/file/abstract-file-provider.ts",
    tsConfigName: "utils.json",
    name: "file",
    parentIgnore: true,
  }),
  "file-service": getOptions({
    entryPointPath: "packages/core/types/src/file/service.ts",
    tsConfigName: "types.json",
    name: "file-service",
  }),
  analytics: getOptions({
    entryPointPath: "packages/core/types/src/analytics/service.ts",
    tsConfigName: "types.json",
    name: "analytics",
    parentIgnore: true,
  }),
  "analytics-provider": getOptions({
    entryPointPath:
      "packages/core/utils/src/analytics/abstract-analytics-provider.ts",
    tsConfigName: "utils.json",
    name: "analytics-provider",
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
  "js-sdk": getOptions({
    entryPointPath: [
      "packages/core/js-sdk/src/admin/index.ts",
      "packages/core/js-sdk/src/auth/index.ts",
      "packages/core/js-sdk/src/store/index.ts",
    ],
    tsConfigName: "js-sdk.json",
    name: "js-sdk",
    enableInternalResolve: true,
    exclude: [...(baseOptions.exclude || []), "**/dist/**"],
  }),
  locking: getOptions({
    entryPointPath: "packages/core/types/src/locking/index.ts",
    tsConfigName: "types.json",
    name: "locking",
  }),
  mfa: getOptions({
    entryPointPath: "packages/core/types/src/auth/mfa-provider.ts",
    tsConfigName: "types.json",
    name: "mfa",
  }),
  medusa: getOptions({
    entryPointPath: "packages/medusa/src/index.ts",
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
  "modules-sdk": getOptions({
    entryPointPath: "packages/core/modules-sdk/src/index.ts",
    tsConfigName: "modules-sdk.json",
    name: "modules-sdk",
  }),
  notification: getOptions({
    entryPointPath:
      "packages/core/utils/src/notification/abstract-notification-provider.ts",
    tsConfigName: "utils.json",
    name: "notification",
    parentIgnore: true,
  }),
  "notification-service": getOptions({
    entryPointPath: "packages/core/types/src/notification/service.ts",
    tsConfigName: "types.json",
    name: "notification-service",
  }),
  "payment-provider": getOptions({
    entryPointPath:
      "packages/core/utils/src/payment/abstract-payment-provider.ts",
    tsConfigName: "utils.json",
    name: "payment-provider",
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
      ...modules.map((moduleName) =>
        path.join(
          rootPathPrefix,
          `packages/core/types/src/${moduleName}/**/!(workflows|provider).ts`
        )
      ),
    ],
  }),
  utils: getOptions({
    entryPointPath: "packages/core/utils/src/index.ts",
    tsConfigName: "utils.json",
    name: "utils",
    jsonFileName: "0-utils",
    enableInternalResolve: true,
    exclude: [
      ...(baseOptions.exclude || []),
      "**/dist/**",
      "**/analytics/**",
      "**/api-key/**",
      "**/auth/**",
      "**/bundles/**",
      "**/common/**",
      "**/dal/**/**",
      "**/dml/**",
      "**/defaults/**",
      "**/**provider.ts",
      "**/event-bus/**",
      "**/exceptions/**",
      "**/feature-flags/**",
      "**/modules-sdk/**",
      "**/orchestration/**",
      "**/pg/**",
      "**/pricing/builders.ts",
      "**/totals/**",
    ],
  }),
  workflows: getOptions({
    entryPointPath: "packages/core/workflows-sdk/src/utils/composer/index.ts",
    tsConfigName: "workflows.json",
    name: "workflows",
    enableInternalResolve: true,
  }),
  loyalty: getOptions({
    entryPointPath: "packages/plugins/loyalty/src/types/loyalty/service.ts",
    tsConfigName: "loyalty.json",
    name: "loyalty",
    entryPointStrategy: "expand",
    plugin: ["typedoc-plugin-rename-defaults"],
    enableInternalResolve: true,
  }),
  "loyalty-models": getOptions({
    entryPointPath: "packages/plugins/loyalty/src/modules/loyalty/models",
    name: `loyalty-models`,
    tsConfigName: `loyalty.json`,
    generateModelsDiagram: true,
    diagramAddToFile:
      "packages/plugins/loyalty/src/modules/loyalty/models/index.ts",
    resolveDmlRelations: true,
    generateDMLsDiagram: true,
    diagramDMLAddToFile:
      "packages/plugins/loyalty/src/modules/loyalty/models/index.ts",
    normalizeDmlTypes: true,
  }),
  "store-credit": getOptions({
    entryPointPath:
      "packages/plugins/loyalty/src/types/store-credit/service.ts",
    tsConfigName: "loyalty.json",
    name: "store-credit",
    entryPointStrategy: "expand",
    plugin: ["typedoc-plugin-rename-defaults"],
    enableInternalResolve: true,
  }),
  "store-credit-models": getOptions({
    entryPointPath: "packages/plugins/loyalty/src/modules/store-credit/models",
    name: `store-credit-models`,
    tsConfigName: `loyalty.json`,
    generateModelsDiagram: true,
    diagramAddToFile:
      "packages/plugins/loyalty/src/modules/store-credit/models/index.ts",
    resolveDmlRelations: true,
    generateDMLsDiagram: true,
    diagramDMLAddToFile:
      "packages/plugins/loyalty/src/modules/store-credit/models/index.ts",
    normalizeDmlTypes: true,
  }),
}

export default customOptions
