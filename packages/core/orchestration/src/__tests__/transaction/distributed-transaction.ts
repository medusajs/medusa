import {
  SkipExecutionError,
  TransactionCheckpoint,
  TransactionContext,
  TransactionFlow,
  TransactionState,
} from "../../transaction"

const createCheckpoint = (
  state: TransactionState,
  version = 1
): TransactionCheckpoint => {
  const flow: TransactionFlow = {
    modelId: "test-model",
    definition: {},
    transactionId: "test-transaction",
    runId: "test-run",
    hasAsyncSteps: false,
    hasFailedSteps: false,
    hasSkippedOnFailureSteps: false,
    hasWaitingSteps: false,
    hasSkippedSteps: false,
    hasRevertedSteps: false,
    timedOutAt: null,
    state,
    steps: {},
    _v: version,
  }

  return new TransactionCheckpoint(flow, new TransactionContext())
}

describe("TransactionCheckpoint", () => {
  describe("mergeCheckpoints - state conflict resolution", () => {
    it("throws when the stored flow state is ahead of the current state", () => {
      // current is INVOKING (index 1), stored is DONE (index 2).
      // This is the conflict case: another worker has progressed the transaction
      // past the current local execution.
      const currentCheckpoint = createCheckpoint(TransactionState.INVOKING)
      const storedCheckpoint = createCheckpoint(TransactionState.DONE)

      expect(() =>
        TransactionCheckpoint.mergeCheckpoints(
          currentCheckpoint,
          storedCheckpoint
        )
      ).toThrow(SkipExecutionError)
    })

    it("does not throw and adopts the stored state when current is WAITING_TO_COMPENSATE", () => {
      // WAITING_TO_COMPENSATE is exempt: a transaction that is waiting to
      // compensate should adopt the more advanced state without throwing.
      const currentCheckpoint = createCheckpoint(
        TransactionState.WAITING_TO_COMPENSATE
      )
      const storedCheckpoint = createCheckpoint(TransactionState.COMPENSATING)

      const result = TransactionCheckpoint.mergeCheckpoints(
        currentCheckpoint,
        storedCheckpoint
      )

      expect(result).toBe(currentCheckpoint)
      expect(result.flow.state).toBe(TransactionState.COMPENSATING)
    })

    it("retains the current flow state when the current state is ahead of the stored state", () => {
      // current is DONE (index 2), stored is INVOKING (index 1):
      // The current execution finished and should retain its DONE state to persist it.
      const currentCheckpoint = createCheckpoint(TransactionState.DONE)
      const storedCheckpoint = createCheckpoint(TransactionState.INVOKING)

      const result = TransactionCheckpoint.mergeCheckpoints(
        currentCheckpoint,
        storedCheckpoint
      )

      expect(result).toBe(currentCheckpoint)
      expect(result.flow.state).toBe(TransactionState.DONE)
    })

    it("retains the current state when both states are equal", () => {
      const currentCheckpoint = createCheckpoint(TransactionState.INVOKING)
      const storedCheckpoint = createCheckpoint(TransactionState.INVOKING)

      expect(() =>
        TransactionCheckpoint.mergeCheckpoints(
          currentCheckpoint,
          storedCheckpoint
        )
      ).not.toThrow()
      expect(currentCheckpoint.flow.state).toBe(TransactionState.INVOKING)
    })
  })
})
