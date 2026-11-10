import type { StepContext } from "@medusajs/workflow-engine"
import type { StepExecutionContext } from "../utils/composer/type"
import type { RecordedStep } from "./recorder"
import { formatStepKey } from "./step-key"

/**
 * Builds the context a step function receives. Each step gets its own copy of
 * the Medusa context, carrying that step's idempotency key.
 */
export function buildStepExecutionContext(
  ctx: StepContext,
  step: Pick<RecordedStep, "id" | "config">
): StepExecutionContext {
  const idempotencyKey = formatStepKey(ctx.idempotencyKey)
  const runContext = (ctx.context ?? {}) as Record<string, any>

  return {
    workflowId: ctx.workflowId,
    stepName: ctx.stepId,
    action: ctx.action,
    idempotencyKey,
    attempt: ctx.attempt,
    container: ctx.locals.container as StepExecutionContext["container"],
    metadata: {
      model_id: ctx.workflowId,
      idempotency_key: idempotencyKey,
      action: ctx.stepId,
      action_type: ctx.action,
      attempt: ctx.attempt,
      timestamp: Date.now(),
    },
    eventGroupId: runContext.eventGroupId,
    parentStepIdempotencyKey: runContext.parentStepIdempotencyKey,
    preventReleaseEvents: runContext.preventReleaseEvents ?? false,
    transactionId: ctx.transactionId,
    runId: ctx.runId,
    context: {
      ...runContext,
      idempotencyKey,
    } as StepExecutionContext["context"],
    " stepDefinition": { ...step.config, action: step.id },
    " getStepResult"(stepId: string) {
      return ctx.results.get(stepId)
    },
  }
}
