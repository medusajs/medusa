import type { ESLint } from "eslint"
import { rule as dataModelTableNameSnakeCase } from "./data-model-table-name-snake-case"
import { rule as linkCreateKeysModulesEnum } from "./link-create-keys-modules-enum"
import { rule as linkNoCrossModuleRelationship } from "./link-no-cross-module-relationship"
import { rule as linkUsesLinkableProperties } from "./link-uses-linkable-properties"
import { rule as loaderMustBeExportedInModuleDefinition } from "./loader-must-be-exported-in-module-definition"
import { rule as moduleNameSnakeCase } from "./module-name-snake-case"
import { rule as noAsyncWorkflowConstructor } from "./no-async-workflow-constructor"
import { rule as noConditionalExpressionsInWorkflow } from "./no-conditional-expressions-in-workflow"
import { rule as noConsoleLogInWorkflow } from "./no-console-log-in-workflow"
import { rule as noDirectVariableMutationInWorkflow } from "./no-direct-variable-mutation-in-workflow"
import { rule as noIfInWorkflowConstructor } from "./no-if-in-workflow-constructor"
import { rule as medusaContextOnContextParam } from "./medusa-context-on-context-param"
import { rule as noLoopsInWorkflow } from "./no-loops-in-workflow"
import { rule as noNewDateInWorkflow } from "./no-new-date-in-workflow"
import { rule as noNonSerializableStepReturn } from "./no-non-serializable-step-return"
import { rule as noReservedDefaultPropertiesInModel } from "./no-reserved-default-properties-in-model"
import { rule as noSpreadInWorkflow } from "./no-spread-in-workflow"
import { rule as noThrowInTransform } from "./no-throw-in-transform"
import { rule as noTryCatchInWorkflow } from "./no-try-catch-in-workflow"
import { rule as readOnlyLinkRequiresField } from "./read-only-link-requires-field"
import { rule as serviceConstructorMustCallSuper } from "./service-constructor-must-call-super"
import { rule as serviceMethodsMustBeAsync } from "./service-methods-must-be-async"
import { rule as useInjectManagerOnPublicMethods } from "./use-inject-manager-on-public-methods"
import { rule as noWorkflowCallWithoutContainer } from "./no-workflow-call-without-container"
import { rule as preferLinkOverRemoteLink } from "./prefer-link-over-remote-link"
import { rule as stepIdKebabCase } from "./step-id-kebab-case"
import { rule as stepMustReturnStepResponse } from "./step-must-return-step-response"
import { rule as workflowIdMatchesExportOrFilename } from "./workflow-id-matches-export-or-filename"
import { rule as workflowMustReturnWorkflowResponse } from "./workflow-must-return-workflow-response"

export const rules = {
  "data-model-table-name-snake-case": dataModelTableNameSnakeCase,
  "link-create-keys-modules-enum": linkCreateKeysModulesEnum,
  "link-no-cross-module-relationship": linkNoCrossModuleRelationship,
  "link-uses-linkable-properties": linkUsesLinkableProperties,
  "loader-must-be-exported-in-module-definition":
    loaderMustBeExportedInModuleDefinition,
  "module-name-snake-case": moduleNameSnakeCase,
  "no-async-workflow-constructor": noAsyncWorkflowConstructor,
  "no-conditional-expressions-in-workflow": noConditionalExpressionsInWorkflow,
  "no-console-log-in-workflow": noConsoleLogInWorkflow,
  "no-direct-variable-mutation-in-workflow": noDirectVariableMutationInWorkflow,
  "no-if-in-workflow-constructor": noIfInWorkflowConstructor,
  "medusa-context-on-context-param": medusaContextOnContextParam,
  "no-loops-in-workflow": noLoopsInWorkflow,
  "no-new-date-in-workflow": noNewDateInWorkflow,
  "no-non-serializable-step-return": noNonSerializableStepReturn,
  "no-reserved-default-properties-in-model": noReservedDefaultPropertiesInModel,
  "no-spread-in-workflow": noSpreadInWorkflow,
  "no-throw-in-transform": noThrowInTransform,
  "no-try-catch-in-workflow": noTryCatchInWorkflow,
  "read-only-link-requires-field": readOnlyLinkRequiresField,
  "service-constructor-must-call-super": serviceConstructorMustCallSuper,
  "service-methods-must-be-async": serviceMethodsMustBeAsync,
  "use-inject-manager-on-public-methods": useInjectManagerOnPublicMethods,
  "no-workflow-call-without-container": noWorkflowCallWithoutContainer,
  "prefer-link-over-remote-link": preferLinkOverRemoteLink,
  "step-id-kebab-case": stepIdKebabCase,
  "step-must-return-step-response": stepMustReturnStepResponse,
  "workflow-id-matches-export-or-filename": workflowIdMatchesExportOrFilename,
  "workflow-must-return-workflow-response": workflowMustReturnWorkflowResponse,
} as unknown as NonNullable<ESLint.Plugin["rules"]>
