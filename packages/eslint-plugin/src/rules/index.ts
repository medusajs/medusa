import type { ESLint } from "eslint"
import { rule as noAsyncWorkflowConstructor } from "./no-async-workflow-constructor"
import { rule as noConditionalExpressionsInWorkflow } from "./no-conditional-expressions-in-workflow"
import { rule as noConsoleLogInWorkflow } from "./no-console-log-in-workflow"
import { rule as noIfInWorkflowConstructor } from "./no-if-in-workflow-constructor"

export const rules = {
  "no-async-workflow-constructor": noAsyncWorkflowConstructor,
  "no-conditional-expressions-in-workflow": noConditionalExpressionsInWorkflow,
  "no-console-log-in-workflow": noConsoleLogInWorkflow,
  "no-if-in-workflow-constructor": noIfInWorkflowConstructor,
} as unknown as NonNullable<ESLint.Plugin["rules"]>
