import type { ESLint } from "eslint"
import { rule as noAsyncWorkflowConstructor } from "./no-async-workflow-constructor"
import { rule as noConditionalExpressionsInWorkflow } from "./no-conditional-expressions-in-workflow"
import { rule as noConsoleLogInWorkflow } from "./no-console-log-in-workflow"
import { rule as noDirectVariableMutationInWorkflow } from "./no-direct-variable-mutation-in-workflow"
import { rule as noIfInWorkflowConstructor } from "./no-if-in-workflow-constructor"
import { rule as noLoopsInWorkflow } from "./no-loops-in-workflow"
import { rule as noNewDateInWorkflow } from "./no-new-date-in-workflow"
import { rule as noNonSerializableStepReturn } from "./no-non-serializable-step-return"
import { rule as noSpreadInWorkflow } from "./no-spread-in-workflow"
import { rule as noThrowInTransform } from "./no-throw-in-transform"
import { rule as noTryCatchInWorkflow } from "./no-try-catch-in-workflow"
import { rule as noWorkflowCallWithoutContainer } from "./no-workflow-call-without-container"
import { rule as stepIdKebabCase } from "./step-id-kebab-case"
import { rule as stepMustReturnStepResponse } from "./step-must-return-step-response"
import { rule as workflowIdMatchesExportOrFilename } from "./workflow-id-matches-export-or-filename"
import { rule as workflowMustReturnWorkflowResponse } from "./workflow-must-return-workflow-response"

export const rules = {
  "no-async-workflow-constructor": noAsyncWorkflowConstructor,
  "no-conditional-expressions-in-workflow": noConditionalExpressionsInWorkflow,
  "no-console-log-in-workflow": noConsoleLogInWorkflow,
  "no-direct-variable-mutation-in-workflow": noDirectVariableMutationInWorkflow,
  "no-if-in-workflow-constructor": noIfInWorkflowConstructor,
  "no-loops-in-workflow": noLoopsInWorkflow,
  "no-new-date-in-workflow": noNewDateInWorkflow,
  "no-non-serializable-step-return": noNonSerializableStepReturn,
  "no-spread-in-workflow": noSpreadInWorkflow,
  "no-throw-in-transform": noThrowInTransform,
  "no-try-catch-in-workflow": noTryCatchInWorkflow,
  "no-workflow-call-without-container": noWorkflowCallWithoutContainer,
  "step-id-kebab-case": stepIdKebabCase,
  "step-must-return-step-response": stepMustReturnStepResponse,
  "workflow-id-matches-export-or-filename": workflowIdMatchesExportOrFilename,
  "workflow-must-return-workflow-response": workflowMustReturnWorkflowResponse,
} as unknown as NonNullable<ESLint.Plugin["rules"]>
