import type { ResultContext, StepContext } from "@medusajs/workflow-engine"
import { resolveValue } from "../utils/composer/helpers/resolve-value"
import type { ConditionBlock } from "./recorder"

/**
 * Key of the per-run memo on the object handed to resolvers. Transforms and
 * `when` conditions are evaluated once per run through it.
 */
export const RUN_MEMO = Symbol.for("medusa.workflow.runMemo")

export type ValueContext = {
  payload: unknown
  invoke: Record<string, unknown>
  context: Record<string, unknown>
  container: unknown
  [RUN_MEMO]: Map<string, unknown>
}

/**
 * Builds the object `resolveValue`, transforms and conditions read from.
 * `payload` is the workflow input and `invoke[step]` a step's output.
 */
export function buildValueContext(
  ctx: StepContext | ResultContext
): ValueContext {
  const results = ctx.results
  const invoke = new Proxy({} as ValueContext["invoke"], {
    get(_target, stepId) {
      return typeof stepId === "string" ? results.get(stepId) : undefined
    },
    has(_target, stepId) {
      return typeof stepId === "string" && results.has(stepId)
    },
    ownKeys() {
      return [...results.keys()]
    },
    getOwnPropertyDescriptor(_target, stepId) {
      return typeof stepId === "string" && results.has(stepId)
        ? { enumerable: true, configurable: true }
        : undefined
    },
  })

  return {
    payload: ctx.input,
    invoke,
    context: ctx.context,
    container: ctx.locals.container,
    [RUN_MEMO]: ctx.memo,
  }
}

export async function resolveInput(input: unknown, values: ValueContext) {
  if (input === undefined) {
    return {}
  }
  return await resolveValue(input, values)
}

/**
 * Evaluates a `when` condition once per block per run, however many steps the
 * block holds.
 */
export async function evaluateCondition(
  block: ConditionBlock,
  values: ValueContext
): Promise<boolean> {
  return memoised(values, `condition:${block.id}`, async () => {
    const input = await resolveValue(block.input, values)
    return !!(await block.condition(input, values))
  })
}

export async function memoised<T>(
  values: unknown,
  key: string,
  compute: () => Promise<T>
): Promise<T> {
  const memo = (values as Partial<ValueContext> | undefined)?.[RUN_MEMO]
  if (!memo) {
    return compute()
  }
  if (!memo.has(key)) {
    const pending = compute()
    memo.set(key, pending)
    // A failure is not kept, so a retry evaluates again.
    pending.catch(() => {
      if (memo.get(key) === pending) {
        memo.delete(key)
      }
    })
  }
  return (await memo.get(key)) as T
}
