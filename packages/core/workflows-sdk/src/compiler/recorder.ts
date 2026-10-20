import type { WorkflowStepConfig } from "@medusajs/types"

export type StepInvokeFn = (input: any, context: any) => any
export type StepCompensateFn = (input: any, context: any) => any

export interface ConditionBlock {
  id: string
  input: unknown
  condition: (...args: any[]) => unknown
}

export interface RecordedStep {
  id: string
  dependsOn: RecordedStep[]
  config: WorkflowStepConfig
  input: unknown
  invokeFn: StepInvokeFn
  compensateFn?: StepCompensateFn
  conditions: ConditionBlock[]
  /**
   * Set on a hook step. Its handler is looked up on the workflow when the step
   * runs, so handlers attached after composition still apply.
   */
  hook?: string
}

/**
 * Key under which a step reference points back to its recorded step. Steps
 * are tracked by identity because the same step may be used several times
 * before `.config({ name })` renames one use.
 */
export const RECORDED_STEP = Symbol.for("medusa.workflow.recordedStep")

/**
 * Global key of the recorder of the workflow being composed. Global so steps
 * from a duplicate install of this package record into the same workflow.
 */
const ACTIVE_RECORDER = Symbol.for("medusa.workflow.recorder")

/**
 * Records what a composer function declares, in order. Each step depends on
 * the steps that were last at the end of the chain when it was declared.
 */
export class WorkflowRecorder {
  readonly steps: RecordedStep[] = []
  /**
   * The functions that register a handler for each hook, exposed as the
   * workflow's `hooks`.
   */
  readonly hooks: Record<string, (...args: any[]) => void> = {}
  readonly hookHandlers = new Map<
    string,
    { invoke: StepInvokeFn; compensate?: StepCompensateFn }
  >()
  isAsync = false
  /**
   * Workflows composed in with `runAsStep`. They are part of this workflow and
   * are registered with it.
   */
  readonly children = new Set<object>()

  #frontier: RecordedStep[] = []
  #conditions: ConditionBlock[] = []
  #unnamedWhens = 0
  #conditionIds = 0
  #transformIds = 0

  constructor(readonly workflowId: string) {}

  addStep(
    step: Omit<RecordedStep, "dependsOn" | "conditions">,
    ref: object
  ): RecordedStep {
    const recorded: RecordedStep = {
      ...step,
      dependsOn: [...this.#frontier],
      conditions: [...this.#conditions],
    }
    Object.defineProperty(ref, RECORDED_STEP, { value: recorded })
    this.steps.push(recorded)
    this.#frontier = [recorded]
    this.isAsync ||= !!step.config.async
    return recorded
  }

  /**
   * The last recorded step with this id.
   */
  findStep(id: string): RecordedStep | undefined {
    for (let i = this.steps.length - 1; i >= 0; i--) {
      if (this.steps[i].id === id) {
        return this.steps[i]
      }
    }
    return undefined
  }

  updateStep(step: RecordedStep, newId: string, config: WorkflowStepConfig) {
    step.id = newId
    step.config = config
    this.isAsync ||= !!config.async
  }

  addCondition(step: RecordedStep, block: Omit<ConditionBlock, "id">) {
    step.conditions.push({ id: `if-${++this.#conditionIds}`, ...block })
  }

  /**
   * Makes the given steps siblings: each depends on what the first one
   * depended on, plus the steps recorded inside the arguments it waited for,
   * and the next step depends on all of them.
   */
  parallel(refs: unknown[]) {
    const members = new Set(
      refs
        .map((ref) => (ref as any)?.[RECORDED_STEP] as RecordedStep | undefined)
        .filter((step): step is RecordedStep => !!step)
    )
    const indexes = [...members].map((step) => this.steps.indexOf(step))
    if (indexes.length < 2) {
      return
    }

    const first = Math.min(...indexes)
    const last = Math.max(...indexes)
    const base = [...this.steps[first].dependsOn]
    const range = this.steps.slice(first, last + 1)
    const inner = new Set(range.filter((step) => !members.has(step)))

    for (const step of range) {
      if (members.has(step)) {
        // A member keeps waiting for steps recorded in its own arguments, e.g.
        // `c` in `parallelize(a(), b(c()))`, but not for the other members.
        const kept = step.dependsOn.filter((dependency) =>
          inner.has(dependency)
        )
        step.dependsOn = [...new Set([...base, ...kept])]
      }
    }

    // Every step in the range that nothing else in the range waits for is an
    // end of a branch, and the next step waits for all of them.
    const waitedOn = new Set(range.flatMap((step) => step.dependsOn))
    this.#frontier = [
      ...range.filter((step) => !waitedOn.has(step)),
      ...this.#frontier.filter((step) => !range.includes(step)),
    ]
  }

  /**
   * Starts a `when` block. Steps recorded until `endCondition` are skipped
   * when the condition is false. Blocks nest.
   */
  beginCondition(block: Omit<ConditionBlock, "id">): ConditionBlock {
    const recorded = { id: `when-${++this.#conditionIds}`, ...block }
    this.#conditions.push(recorded)
    return recorded
  }

  endCondition(block: ConditionBlock) {
    this.#conditions = this.#conditions.filter((c) => c !== block)
  }

  /**
   * `when` blocks whose `.then` was never called.
   */
  get openConditions(): number {
    return this.#conditions.length
  }

  /**
   * Step name for a `when` without a name. Derived from declaration order so
   * every process compiles the same definition.
   */
  nextUnnamedWhen(): string {
    return `when-then-${++this.#unnamedWhens}`
  }

  /**
   * Id of the next `transform`, unique within the workflow. It keys the
   * transform's per-run memo.
   */
  nextTransformId(): string {
    return `transform-${++this.#transformIds}`
  }
}

export function getComposerContext(): WorkflowRecorder | undefined {
  return global[ACTIVE_RECORDER] ?? undefined
}

export function setComposerContext(recorder: WorkflowRecorder | undefined) {
  if (recorder) {
    global[ACTIVE_RECORDER] = recorder
  } else {
    delete global[ACTIVE_RECORDER]
  }
}
