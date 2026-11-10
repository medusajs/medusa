import { RunEventName } from "../events/emitter"

export type NotifierMessage =
  | { type: "wake"; origin: string }
  | {
      type: "event"
      origin: string
      name: RunEventName
      runId: string
      workflowId: string
      transactionId: string
      status: string
      stepId?: string
    }

/**
 * Carries wake-ups and run events between instances. Messages may be lost;
 * nothing depends on them for correctness, only for latency.
 */
export interface Notifier {
  publish(message: NotifierMessage): Promise<void>
  subscribe(
    listener: (message: NotifierMessage) => void
  ): Promise<() => Promise<void> | void>
  close?(): Promise<void>
}
