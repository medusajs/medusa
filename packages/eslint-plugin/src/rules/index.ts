import type { ESLint } from "eslint"
import { rule as noAsyncWorkflowConstructor } from "./no-async-workflow-constructor"
import { rule as noConditionalExpressionsInWorkflow } from "./no-conditional-expressions-in-workflow"
import { rule as noConsoleLogInWorkflow } from "./no-console-log-in-workflow"
import { rule as noDirectVariableMutationInWorkflow } from "./no-direct-variable-mutation-in-workflow"
import { rule as noIfInWorkflowConstructor } from "./no-if-in-workflow-constructor"
import { rule as noLoopsInWorkflow } from "./no-loops-in-workflow"
import { rule as noSpreadInWorkflow } from "./no-spread-in-workflow"
import { rule as noTryCatchInWorkflow } from "./no-try-catch-in-workflow"

export const rules = {
  "no-async-workflow-constructor": noAsyncWorkflowConstructor,
  "no-conditional-expressions-in-workflow": noConditionalExpressionsInWorkflow,
  "no-console-log-in-workflow": noConsoleLogInWorkflow,
  "no-direct-variable-mutation-in-workflow": noDirectVariableMutationInWorkflow,
  "no-if-in-workflow-constructor": noIfInWorkflowConstructor,
  "no-loops-in-workflow": noLoopsInWorkflow,
  "no-spread-in-workflow": noSpreadInWorkflow,
  "no-try-catch-in-workflow": noTryCatchInWorkflow,
} as unknown as NonNullable<ESLint.Plugin["rules"]>
