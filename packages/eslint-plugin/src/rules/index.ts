import type { ESLint } from "eslint"
import { rule as noAsyncWorkflowConstructor } from "./no-async-workflow-constructor"

export const rules = {
  "no-async-workflow-constructor": noAsyncWorkflowConstructor,
} as unknown as NonNullable<ESLint.Plugin["rules"]>
