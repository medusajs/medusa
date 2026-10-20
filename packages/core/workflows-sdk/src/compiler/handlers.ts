import { OrchestrationUtils } from "@medusajs/utils"
import type {
  CompensateHandler,
  InvokeHandler,
  StepResult,
} from "@medusajs/workflow-engine"
import {
  SkipStepResponse,
  StepResponse,
} from "../utils/composer/helpers/step-response"
import type { RecordedStep } from "./recorder"
import { buildStepExecutionContext } from "./step-context"
import { buildValueContext, evaluateCondition, resolveInput } from "./values"

export interface HookHandlers {
  invoke: (input: any, context: any) => any
  compensate?: (input: any, context: any) => any
}

export type HookLookup = (name: string) => HookHandlers | undefined

function isStepResponse(value: unknown): value is StepResponse<unknown> {
  return (
    !!value &&
    typeof value === "object" &&
    (value as { __type?: unknown }).__type ===
      OrchestrationUtils.SymbolWorkflowStepResponse
  )
}

/**
 * Maps what a step function returned to the engine's result.
 *
 * An async step that returns a `StepResponse` completes in the background; one
 * that returns anything else waits to be completed from outside, unless it
 * runs in the background and hosts no child run.
 */
export function toStepResult(
  response: unknown,
  step: Pick<RecordedStep, "config">
): StepResult {
  if (response instanceof SkipStepResponse) {
    return { kind: "skip" }
  }

  if (isStepResponse(response)) {
    return {
      kind: "output",
      output: response.output,
      compensateInput: response.compensateInput,
    }
  }

  if (
    step.config.async &&
    (!step.config.backgroundExecution || step.config.nested)
  ) {
    return { kind: "wait" }
  }

  return { kind: "output", output: response, compensateInput: response }
}

export function buildInvoke(
  step: RecordedStep,
  hooks: HookLookup
): InvokeHandler {
  return async (ctx) => {
    const values = buildValueContext(ctx)

    for (const block of step.conditions) {
      if (!(await evaluateCondition(block, values))) {
        return { kind: "skip" }
      }
    }

    const invokeFn = (step.hook && hooks(step.hook)?.invoke) || step.invokeFn
    const input = await resolveInput(step.input, values)
    const response = await invokeFn(input, buildStepExecutionContext(ctx, step))

    return toStepResult(response, step)
  }
}

export function buildCompensate(
  step: RecordedStep,
  hooks: HookLookup
): CompensateHandler | undefined {
  if (step.config.noCompensation && !step.hook) {
    return undefined
  }

  return async (compensateInput, ctx) => {
    const compensateFn = step.hook
      ? hooks(step.hook)?.compensate ?? step.compensateFn
      : step.compensateFn
    await compensateFn?.(compensateInput, buildStepExecutionContext(ctx, step))
  }
}
