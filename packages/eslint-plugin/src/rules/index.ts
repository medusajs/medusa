import type { ESLint } from "eslint"
import { rule as noAsyncWorkflowConstructor } from "./no-async-workflow-constructor"
import { rule as noIfInWorkflowConstructor } from "./no-if-in-workflow-constructor"

export const rules = {
  "no-async-workflow-constructor": noAsyncWorkflowConstructor,
  "no-if-in-workflow-constructor": noIfInWorkflowConstructor,
} as unknown as NonNullable<ESLint.Plugin["rules"]>
