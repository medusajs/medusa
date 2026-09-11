import {
  SkipExecutionError,
  TransactionCheckpoint,
  TransactionContext,
  TransactionFlow,
  TransactionState,
} from "../../transaction"

const createCheckpoint = (state: TransactionState) => {
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
    _v: 1,
  }

  return new TransactionCheckpoint(flow, new TransactionContext())
}

describe("TransactionCheckpoint", () => {
  describe("mergeCheckpoints", () => {
    it("adopts a stored flow state that is farther along", () => {
      const currentCheckpoint = createCheckpoint(TransactionState.INVOKING)
      const storedCheckpoint = createCheckpoint(TransactionState.DONE)

      const result = TransactionCheckpoint.mergeCheckpoints(
        currentCheckpoint,
        storedCheckpoint
      )

      expect(result).toBe(currentCheckpoint)
      expect(result.flow.state).toBe(TransactionState.DONE)
    })

    it("retains an equal flow state", () => {
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

    it("throws when the current flow state is ahead of the stored state", () => {
      const currentCheckpoint = createCheckpoint(TransactionState.DONE)
      const storedCheckpoint = createCheckpoint(TransactionState.INVOKING)

      expect(() =>
        TransactionCheckpoint.mergeCheckpoints(
          currentCheckpoint,
          storedCheckpoint
        )
      ).toThrow(
        new SkipExecutionError("Transaction is behind another execution")
      )
    })

    it("preserves waiting to compensate when the stored flow is behind", () => {
      const currentCheckpoint = createCheckpoint(
        TransactionState.WAITING_TO_COMPENSATE
      )
      const storedCheckpoint = createCheckpoint(TransactionState.DONE)

      expect(() =>
        TransactionCheckpoint.mergeCheckpoints(
          currentCheckpoint,
          storedCheckpoint
        )
      ).not.toThrow()
      expect(currentCheckpoint.flow.state).toBe(
        TransactionState.WAITING_TO_COMPENSATE
      )
    })
  })
})
