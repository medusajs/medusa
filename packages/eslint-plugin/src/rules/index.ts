import type { ESLint } from "eslint"
import { rule as adminComponentMustBeArrowFunction } from "./admin-component-must-be-arrow-function"
import { rule as adminEnvVarsImportMeta } from "./admin-env-vars-import-meta"
import { rule as authenticateFlagNameAndType } from "./authenticate-flag-name-and-type"
import { rule as dataModelTableNameSnakeCase } from "./data-model-table-name-snake-case"
import { rule as linkCreateKeysModulesEnum } from "./link-create-keys-modules-enum"
import { rule as linkNoCrossModuleRelationship } from "./link-no-cross-module-relationship"
import { rule as linkUsesLinkableProperties } from "./link-uses-linkable-properties"
import { rule as loaderMustBeExportedInModuleDefinition } from "./loader-must-be-exported-in-module-definition"
import { rule as moduleNameSnakeCase } from "./module-name-snake-case"
import { rule as noAsyncWorkflowConstructor } from "./no-async-workflow-constructor"
import { rule as noConditionalExpressionsInWorkflow } from "./no-conditional-expressions-in-workflow"
import { rule as noConfigOnDynamicUiRoute } from "./no-config-on-dynamic-ui-route"
import { rule as noConsoleLogInWorkflow } from "./no-console-log-in-workflow"
import { rule as noDeprecatedRemoteQueryConfig } from "./no-deprecated-remote-query-config"
import { rule as noDirectVariableMutationInWorkflow } from "./no-direct-variable-mutation-in-workflow"
import { rule as noDuplicateStepIdInWorkflow } from "./no-duplicate-step-id-in-workflow"
import { rule as noIfInWorkflowConstructor } from "./no-if-in-workflow-constructor"
import { rule as medusaContextOnContextParam } from "./medusa-context-on-context-param"
import { rule as middlewareMustCallNext } from "./middleware-must-call-next"
import { rule as middlewaresFileLocationAndName } from "./middlewares-file-location-and-name"
import { rule as noLoopsInWorkflow } from "./no-loops-in-workflow"
import { rule as noNewDateInWorkflow } from "./no-new-date-in-workflow"
import { rule as noNonSerializableStepReturn } from "./no-non-serializable-step-return"
import { rule as noReservedDefaultPropertiesInModel } from "./no-reserved-default-properties-in-model"
import { rule as noServiceMutationsInApiRoute } from "./no-service-mutations-in-api-route"
import { rule as noSpreadInWorkflow } from "./no-spread-in-workflow"
import { rule as noThrowInTransform } from "./no-throw-in-transform"
import { rule as noTrailingSlashInRouteMatcher } from "./no-trailing-slash-in-route-matcher"
import { rule as noTryCatchInWorkflow } from "./no-try-catch-in-workflow"
import { rule as readOnlyLinkRequiresField } from "./read-only-link-requires-field"
import { rule as routeDynamicFolderSyntax } from "./route-dynamic-folder-syntax"
import { rule as routeFileNaming } from "./route-file-naming"
import { rule as routeHandlerExportsUppercase } from "./route-handler-exports-uppercase"
import { rule as routeParamsMustBeDefined } from "./route-params-must-be-defined"
import { rule as serviceConstructorMustCallSuper } from "./service-constructor-must-call-super"
import { rule as serviceMethodsMustBeAsync } from "./service-methods-must-be-async"
import { rule as useInjectManagerOnPublicMethods } from "./use-inject-manager-on-public-methods"
import { rule as useQueryContextUtility } from "./use-query-context-utility"
import { rule as useValidatedBodyOrQuery } from "./use-validated-body-or-query"
import { rule as noWorkflowCallWithoutContainer } from "./no-workflow-call-without-container"
import { rule as preferContainerRegistrationKeysQuery } from "./prefer-container-registration-keys-query"
import { rule as preferLinkOverRemoteLink } from "./prefer-link-over-remote-link"
import { rule as pricesInMajorUnits } from "./prices-in-major-units"
import { rule as stepIdKebabCase } from "./step-id-kebab-case"
import { rule as stepMustReturnStepResponse } from "./step-must-return-step-response"
import { rule as uiRouteConfigViaDefineRouteConfig } from "./ui-route-config-via-define-route-config"
import { rule as uiRouteFileNamePageTsx } from "./ui-route-file-name-page-tsx"
import { rule as uiRouteMustHaveDefaultExport } from "./ui-route-must-have-default-export"
import { rule as workflowIdMatchesExportOrFilename } from "./workflow-id-matches-export-or-filename"
import { rule as workflowMustReturnWorkflowResponse } from "./workflow-must-return-workflow-response"
import { rule as widgetMustExportConfig } from "./widget-must-export-config"
import { rule as widgetMustHaveDefaultExport } from "./widget-must-have-default-export"
import { rule as widgetZoneMustBeStringLiteral } from "./widget-zone-must-be-string-literal"
import { rule as zodImportSource } from "./zod-import-source"

export const rules = {
  "admin-component-must-be-arrow-function": adminComponentMustBeArrowFunction,
  "admin-env-vars-import-meta": adminEnvVarsImportMeta,
  "authenticate-flag-name-and-type": authenticateFlagNameAndType,
  "data-model-table-name-snake-case": dataModelTableNameSnakeCase,
  "link-create-keys-modules-enum": linkCreateKeysModulesEnum,
  "link-no-cross-module-relationship": linkNoCrossModuleRelationship,
  "link-uses-linkable-properties": linkUsesLinkableProperties,
  "loader-must-be-exported-in-module-definition":
    loaderMustBeExportedInModuleDefinition,
  "module-name-snake-case": moduleNameSnakeCase,
  "no-async-workflow-constructor": noAsyncWorkflowConstructor,
  "no-conditional-expressions-in-workflow": noConditionalExpressionsInWorkflow,
  "no-config-on-dynamic-ui-route": noConfigOnDynamicUiRoute,
  "no-console-log-in-workflow": noConsoleLogInWorkflow,
  "no-deprecated-remote-query-config": noDeprecatedRemoteQueryConfig,
  "no-direct-variable-mutation-in-workflow": noDirectVariableMutationInWorkflow,
  "no-duplicate-step-id-in-workflow": noDuplicateStepIdInWorkflow,
  "no-if-in-workflow-constructor": noIfInWorkflowConstructor,
  "medusa-context-on-context-param": medusaContextOnContextParam,
  "middleware-must-call-next": middlewareMustCallNext,
  "middlewares-file-location-and-name": middlewaresFileLocationAndName,
  "no-loops-in-workflow": noLoopsInWorkflow,
  "no-new-date-in-workflow": noNewDateInWorkflow,
  "no-non-serializable-step-return": noNonSerializableStepReturn,
  "no-reserved-default-properties-in-model": noReservedDefaultPropertiesInModel,
  "no-service-mutations-in-api-route": noServiceMutationsInApiRoute,
  "no-spread-in-workflow": noSpreadInWorkflow,
  "no-throw-in-transform": noThrowInTransform,
  "no-trailing-slash-in-route-matcher": noTrailingSlashInRouteMatcher,
  "no-try-catch-in-workflow": noTryCatchInWorkflow,
  "read-only-link-requires-field": readOnlyLinkRequiresField,
  "route-dynamic-folder-syntax": routeDynamicFolderSyntax,
  "route-file-naming": routeFileNaming,
  "route-handler-exports-uppercase": routeHandlerExportsUppercase,
  "route-params-must-be-defined": routeParamsMustBeDefined,
  "service-constructor-must-call-super": serviceConstructorMustCallSuper,
  "service-methods-must-be-async": serviceMethodsMustBeAsync,
  "use-inject-manager-on-public-methods": useInjectManagerOnPublicMethods,
  "use-query-context-utility": useQueryContextUtility,
  "use-validated-body-or-query": useValidatedBodyOrQuery,
  "no-workflow-call-without-container": noWorkflowCallWithoutContainer,
  "prefer-container-registration-keys-query":
    preferContainerRegistrationKeysQuery,
  "prefer-link-over-remote-link": preferLinkOverRemoteLink,
  "prices-in-major-units": pricesInMajorUnits,
  "step-id-kebab-case": stepIdKebabCase,
  "step-must-return-step-response": stepMustReturnStepResponse,
  "ui-route-config-via-define-route-config": uiRouteConfigViaDefineRouteConfig,
  "ui-route-file-name-page-tsx": uiRouteFileNamePageTsx,
  "ui-route-must-have-default-export": uiRouteMustHaveDefaultExport,
  "workflow-id-matches-export-or-filename": workflowIdMatchesExportOrFilename,
  "workflow-must-return-workflow-response": workflowMustReturnWorkflowResponse,
  "widget-must-export-config": widgetMustExportConfig,
  "widget-must-have-default-export": widgetMustHaveDefaultExport,
  "widget-zone-must-be-string-literal": widgetZoneMustBeStringLiteral,
  "zod-import-source": zodImportSource,
} as unknown as NonNullable<ESLint.Plugin["rules"]>
