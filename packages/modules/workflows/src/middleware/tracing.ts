import type { EngineExtension } from "@medusajs/workflow-engine"

export type RunTraceMetadata = {
  model_id: string
  transaction_id: string
  flow_metadata?: Record<string, unknown>
}

export type StepTraceMetadata = {
  action: string
  type: "invoke" | "compensate"
  idempotency_key: string
  attempt: number
  model_id: string
  transaction_id: string
}

export type WorkflowTracing = {
  traceRun?: <T>(
    run: () => Promise<T>,
    metadata: RunTraceMetadata
  ) => Promise<T>
  traceStep?: <T>(
    step: () => Promise<T>,
    metadata: StepTraceMetadata
  ) => Promise<T>
}

let defaultTracing: WorkflowTracing = {}

/**
 * Sets the tracing hooks of the workflows modules loaded afterwards. Called by
 * instrumentation, which runs before modules load.
 */
export function configureWorkflowTracing(hooks: WorkflowTracing) {
  defaultTracing = hooks
}

/**
 * Traces the runs and steps of one engine with the hooks configured when the
 * engine is built.
 */
export function tracingExtension(
  tracing: WorkflowTracing = defaultTracing
): EngineExtension {
  return {
    name: "medusa-tracing",
    aroundRun: (invocation, next) => {
      if (!tracing.traceRun) {
        return next()
      }
      const { run } = invocation
      return tracing.traceRun(next, {
        model_id: run.workflowId,
        transaction_id: run.transactionId,
        flow_metadata: {
          eventGroupId: run.context?.eventGroupId,
          parentStepIdempotencyKey: run.context?.parentStepIdempotencyKey,
        },
      })
    },
    aroundStep: (invocation, next) => {
      if (!tracing.traceStep) {
        return next()
      }
      const { ctx } = invocation
      const key = ctx.idempotencyKey
      return tracing.traceStep(next, {
        action: ctx.stepId,
        type: ctx.action,
        idempotency_key: `${key.workflowId}:${key.transactionId}:${key.stepId}:${key.action}`,
        attempt: ctx.attempt,
        model_id: ctx.workflowId,
        transaction_id: ctx.transactionId,
      })
    },
  }
}
