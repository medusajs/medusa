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
    it("throws when the current flow state is ahead of the stored state", () => {
      // current is DONE (index 2), stored is INVOKING (index 1).
      // This is the conflict case: the local copy has moved on while a
      // concurrent save still has the older state.
      const currentCheckpoint = createCheckpoint(TransactionState.DONE)
      const storedCheckpoint = createCheckpoint(TransactionState.INVOKING)

      expect(() =>
        TransactionCheckpoint.mergeCheckpoints(
          currentCheckpoint,
          storedCheckpoint
        )
      ).toThrow(SkipExecutionError)
    })

    it("does not throw when the current state is WAITING_TO_COMPENSATE even if ahead", () => {
      // WAITING_TO_COMPENSATE is exempt: a transaction that is waiting to
      // compensate should not be flagged as being "behind" another execution.
      const currentCheckpoint = createCheckpoint(
        TransactionState.WAITING_TO_COMPENSATE
      )
      const storedCheckpoint = createCheckpoint(TransactionState.INVOKING)

      expect(() =>
        TransactionCheckpoint.mergeCheckpoints(
          currentCheckpoint,
          storedCheckpoint
        )
      ).not.toThrow()
    })

    it("adopts the stored flow state when the stored state is farther along", () => {
      // stored is DONE (index 2), current is INVOKING (index 1): the stored
      // copy has moved on, so the current checkpoint should adopt it.
      const currentCheckpoint = createCheckpoint(TransactionState.INVOKING)
      const storedCheckpoint = createCheckpoint(TransactionState.DONE)

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
