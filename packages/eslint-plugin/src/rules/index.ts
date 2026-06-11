import type { ESLint } from "eslint"
import { rule as noAsyncWorkflowConstructor } from "./no-async-workflow-constructor"
import { rule as noConditionalExpressionsInWorkflow } from "./no-conditional-expressions-in-workflow"
import { rule as noConsoleLogInWorkflow } from "./no-console-log-in-workflow"
import { rule as noDirectVariableMutationInWorkflow } from "./no-direct-variable-mutation-in-workflow"
import { rule as noIfInWorkflowConstructor } from "./no-if-in-workflow-constructor"
import { rule as medusaContextOnContextParam } from "./medusa-context-on-context-param"
import { rule as noLoopsInWorkflow } from "./no-loops-in-workflow"
import { rule as noSpreadInWorkflow } from "./no-spread-in-workflow"
import { rule as noTryCatchInWorkflow } from "./no-try-catch-in-workflow"
import { rule as serviceConstructorMustCallSuper } from "./service-constructor-must-call-super"
import { rule as serviceMethodsMustBeAsync } from "./service-methods-must-be-async"
import { rule as useInjectManagerOnPublicMethods } from "./use-inject-manager-on-public-methods"

export const rules = {
  "no-async-workflow-constructor": noAsyncWorkflowConstructor,
  "no-conditional-expressions-in-workflow": noConditionalExpressionsInWorkflow,
  "no-console-log-in-workflow": noConsoleLogInWorkflow,
  "no-direct-variable-mutation-in-workflow": noDirectVariableMutationInWorkflow,
  "no-if-in-workflow-constructor": noIfInWorkflowConstructor,
  "medusa-context-on-context-param": medusaContextOnContextParam,
  "no-loops-in-workflow": noLoopsInWorkflow,
  "no-spread-in-workflow": noSpreadInWorkflow,
  "no-try-catch-in-workflow": noTryCatchInWorkflow,
  "service-constructor-must-call-super": serviceConstructorMustCallSuper,
  "service-methods-must-be-async": serviceMethodsMustBeAsync,
  "use-inject-manager-on-public-methods": useInjectManagerOnPublicMethods,
} as unknown as NonNullable<ESLint.Plugin["rules"]>
