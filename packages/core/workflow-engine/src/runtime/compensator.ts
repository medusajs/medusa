import { StepStatus } from "../definition/types"
import { sleep } from "./clock"
import type { Executor } from "./executor"

const COMPENSATE_FROM: ReadonlySet<StepStatus> = new Set([
  "succeeded",
  "failed",
  "timed_out",
  "compensating",
])

/**
 * Compensates the steps that ran, deepest first. Steps at the same depth have
 * no dependency between them and are compensated in parallel.
 */
export async function runCompensation(executor: Executor): Promise<void> {
  const { state, compiled } = executor

  const byDepth = new Map<number, number[]>()
  state.steps.forEach((step, index) => {
    if (COMPENSATE_FROM.has(step.status)) {
      const depth = compiled.depth[index]
      byDepth.set(depth, [...(byDepth.get(depth) ?? []), index])
    }
  })

  const depths = [...byDepth.keys()].sort((a, b) => b - a)
  for (const depth of depths) {
    await Promise.all(
      byDepth.get(depth)!.map((index) => compensateStep(executor, index))
    )
    await executor.flushCompensation()
  }
}

async function compensateStep(executor: Executor, index: number) {
  const { state, compiled, runtime } = executor
  const node = compiled.steps[index]
  const step = state.steps[index]

  if (!node.compensate) {
    state.setStepStatus(index, "compensated")
    await executor.stepCompensated(index)
    return
  }

  state.setStepStatus(index, "compensating")
  const maxRetries = node.options.maxRetries ?? 0
  const compensateInput = step.hasOutput ? step.compensateInput : undefined

  for (let attempt = 1; ; attempt++) {
    const ctx = executor.context(
      index,
      "compensate",
      new AbortController().signal
    )
    ctx.attempt = attempt

    try {
      await executor.callHandler(ctx, () =>
        node.compensate!(compensateInput, ctx)
      )
    } catch (error) {
      if (attempt > maxRetries) {
        state.setStepStatus(index, "compensation_failed")
        state.addError(index, "compensate", error)
        executor.emit("stepCompensationFailed", {
          stepId: node.id,
          action: "compensate",
          attempt,
          error,
        })
        return
      }
      if (node.options.retryIntervalMs) {
        await sleep(runtime.clock, node.options.retryIntervalMs)
      }
      continue
    }

    state.setStepStatus(index, "compensated")
    await executor.stepCompensated(index)
    executor.emit("stepCompensated", {
      stepId: node.id,
      action: "compensate",
      attempt,
    })
    return
  }
}
