import { RunStatus, StepAction } from "../definition/types"
import { RunError, RunRecord } from "../store/store"

export type RunEventName =
  | "runStarted"
  | "runResumed"
  | "stepStarted"
  | "stepSucceeded"
  | "stepFailed"
  | "stepSkipped"
  | "stepWaiting"
  | "compensationStarted"
  | "stepCompensated"
  | "stepCompensationFailed"
  | "runTimedOut"
  | "runFinished"

export interface RunEvent {
  name: RunEventName
  runId: string
  workflowId: string
  transactionId: string
  status: RunStatus
  stepId?: string
  action?: StepAction
  attempt?: number
  output?: unknown
  error?: unknown
  /**
   * Set on `runFinished`.
   */
  result?: unknown
  errors?: RunError[]
  /**
   * The run as it stands, with its steps. Only available in the process that
   * emitted the event.
   */
  snapshot?: () => RunRecord
  /**
   * Set on events another instance published. They carry ids only.
   */
  remote?: boolean
}

export type RunEventListener = (event: RunEvent) => void | Promise<void>

export class RunEventEmitter {
  #listeners = new Set<RunEventListener>()

  on(listener: RunEventListener): () => void {
    this.#listeners.add(listener)
    return () => this.off(listener)
  }

  off(listener: RunEventListener): void {
    this.#listeners.delete(listener)
  }

  /**
   * Listeners run synchronously in registration order. A failing listener never
   * affects the run.
   */
  emit(event: RunEvent): void {
    for (const listener of this.#listeners) {
      try {
        const result = listener(event)
        if (result && typeof (result as Promise<void>).catch === "function") {
          ;(result as Promise<void>).catch(() => {})
        }
      } catch {
        // Listener errors are the listener's concern.
      }
    }
  }
}
