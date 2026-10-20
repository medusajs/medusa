import { CompiledWorkflow } from "../definition/compile"
import { RunStatus, StepAction, StepStatus } from "../definition/types"
import { deserializeError, serializeError } from "../serialization/serializer"
import { RunError, RunFlags, RunRecord, StepRecord } from "../store/store"
import { assertRunTransition, assertStepTransition } from "./transitions"

export interface StepState {
  status: StepStatus
  attempt: number
  output?: unknown
  compensateInput?: unknown
  hasOutput: boolean
  skipReason?: "condition" | "failure" | null
  pendingFailure?: { permanent: boolean } | null
  error?: RunError["error"] | null
  startedAt?: Date | null
  finishedAt?: Date | null
  owner?: string | null
}

export interface LiveRunError extends RunError {
  /**
   * The value the handler threw, when it was thrown in this process.
   */
  cause?: unknown
}

/**
 * In-memory state of one run. Only the executor and compensator change it.
 */
export class RunState {
  readonly steps: StepState[]
  readonly results = new Map<string, unknown>()
  readonly memo = new Map<string, unknown>()
  readonly errors: LiveRunError[]
  readonly dirty = new Set<number>()
  status: RunStatus
  flags: RunFlags
  /**
   * Number of unresolved dependencies per step, for the invoke phase.
   */
  readonly remaining: number[]
  #resolved: boolean[]
  #unresolved: number
  /**
   * Candidates for `takeReady`, fed by the transitions that can make a step
   * ready. Checked again when taken.
   */
  #ready: number[] = []

  constructor(readonly compiled: CompiledWorkflow, public run: RunRecord) {
    this.status = run.status
    this.flags = { ...run.flags }
    this.errors = (run.errors ?? []).map((error) => ({
      ...error,
      cause: deserializeError(error.error),
    }))

    const stored = new Map((run.steps ?? []).map((s) => [s.stepId, s]))
    this.steps = compiled.steps.map((node) => {
      const record = stored.get(node.id)
      if (!record) {
        return { status: "pending", attempt: 0, hasOutput: false }
      }
      return {
        status: record.status,
        attempt: record.attempt,
        output: record.output,
        compensateInput: record.compensateInput,
        hasOutput: "output" in record || "compensateInput" in record,
        skipReason: record.skipReason ?? null,
        pendingFailure: record.pendingFailure ?? null,
        error: record.error ?? null,
        startedAt: record.startedAt ?? null,
        finishedAt: record.finishedAt ?? null,
        owner: record.owner ?? null,
      }
    })

    this.steps.forEach((step, index) => {
      if (this.#exposesOutput(index, step)) {
        this.results.set(compiled.steps[index].id, step.output)
      }
    })

    this.#resolved = this.steps.map((_, index) => this.isResolved(index))
    this.#unresolved = this.#resolved.filter((resolved) => !resolved).length
    this.remaining = compiled.dependencies.map(
      (deps) => deps.filter((dep) => !this.#resolved[dep]).length
    )
    this.steps.forEach((step, index) => {
      if (step.status === "pending" && this.remaining[index] === 0) {
        this.#ready.push(index)
      }
    })
  }

  stepId(index: number): string {
    return this.compiled.steps[index].id
  }

  setRunStatus(status: RunStatus) {
    assertRunTransition(this.status, status)
    this.status = status
  }

  setStepStatus(index: number, status: StepStatus) {
    const step = this.steps[index]
    assertStepTransition(this.stepId(index), step.status, status)
    step.status = status
    this.dirty.add(index)
    if (status === "pending" && this.remaining[index] === 0) {
      this.#ready.push(index)
    }
  }

  /**
   * Whether dependents of this step may run in the invoke phase.
   */
  isResolved(index: number): boolean {
    const step = this.steps[index]
    if (step.status === "succeeded" || step.status === "skipped") {
      return true
    }
    if (
      (step.status === "failed" || step.status === "timed_out") &&
      !step.pendingFailure
    ) {
      const options = this.compiled.steps[index].options
      return (
        !this.flags.timedOut &&
        (!!options.continueOnPermanentFailure ||
          !!options.skipOnPermanentFailure)
      )
    }
    return false
  }

  /**
   * Marks the step resolved for the invoke phase and lowers the remaining
   * count of each dependent.
   */
  resolve(index: number): void {
    if (this.#resolved[index]) {
      return
    }
    this.#resolved[index] = true
    this.#unresolved--
    for (const dependent of this.compiled.dependents[index]) {
      this.remaining[dependent]--
      if (
        this.remaining[dependent] === 0 &&
        this.steps[dependent].status === "pending"
      ) {
        this.#ready.push(dependent)
      }
    }
  }

  get allResolved(): boolean {
    return this.#unresolved === 0
  }

  /**
   * Pending steps whose dependencies are resolved, in declaration order.
   */
  takeReady(): number[] {
    if (!this.#ready.length) {
      return []
    }
    const candidates = this.#ready
    this.#ready = []
    return [...new Set(candidates)]
      .filter(
        (index) =>
          this.steps[index].status === "pending" && this.remaining[index] === 0
      )
      .sort((a, b) => a - b)
  }

  setOutput(index: number, output: unknown, compensateInput: unknown) {
    const step = this.steps[index]
    const saveResponse = this.compiled.steps[index].options.saveResponse
    step.output = saveResponse === false ? undefined : output
    step.compensateInput = compensateInput
    step.hasOutput = true
    if (this.#exposesOutput(index, step)) {
      this.results.set(this.stepId(index), step.output)
    }
    this.dirty.add(index)
  }

  addError(index: number, action: StepAction, cause: unknown) {
    const error = serializeError(cause)
    this.errors.push({ stepId: this.stepId(index), action, error, cause })
    if (action === "invoke") {
      this.steps[index].error = error
    }
    this.dirty.add(index)
  }

  descendants(index: number): Set<number> {
    const result = new Set<number>()
    const stack = [...this.compiled.dependents[index]]
    while (stack.length) {
      const next = stack.pop()!
      if (!result.has(next)) {
        result.add(next)
        stack.push(...this.compiled.dependents[next])
      }
    }
    return result
  }

  hasStatus(...statuses: StepStatus[]): boolean {
    return this.steps.some((step) => statuses.includes(step.status))
  }

  stepRecord(index: number): StepRecord {
    const step = this.steps[index]
    const record: StepRecord = {
      stepId: this.stepId(index),
      status: step.status,
      attempt: step.attempt,
      error: step.error ?? null,
      skipReason: step.skipReason ?? null,
      pendingFailure: step.pendingFailure ?? null,
      startedAt: step.startedAt ?? null,
      finishedAt: step.finishedAt ?? null,
      owner: step.owner ?? null,
    }
    if (step.hasOutput) {
      record.output = step.output
      record.compensateInput = step.compensateInput
    }
    return record
  }

  takeDirtySteps(): StepRecord[] {
    const records = [...this.dirty].map((index) => this.stepRecord(index))
    this.dirty.clear()
    return records
  }

  storedErrors(): RunError[] {
    return this.errors.map(({ stepId, action, error }) => ({
      stepId,
      action,
      error,
    }))
  }

  snapshot(): RunRecord {
    return {
      ...this.run,
      status: this.status,
      flags: { ...this.flags },
      errors: this.storedErrors(),
      steps: this.steps.map((_, index) => this.stepRecord(index)),
    }
  }

  #exposesOutput(index: number, step: StepState): boolean {
    if (!step.hasOutput) {
      return false
    }
    if (step.status === "succeeded") {
      return true
    }
    // A step that finished after its timeout keeps its output, as before.
    if (step.status === "timed_out") {
      return true
    }
    // A failed step that the run moves past still exposes its partial output.
    return (
      step.status === "failed" &&
      !!this.compiled.steps[index].options.continueOnPermanentFailure
    )
  }
}
