import { TransactionStepState, TransactionStepStatus } from "@medusajs/utils"
import {
  DistributedTransaction,
  DistributedTransactionType,
  SkipStepAlreadyFinishedError,
  TransactionHandlerType,
  TransactionOrchestrator,
  TransactionPayload,
  TransactionState,
} from "../../transaction"
import { BaseInMemoryDistributedTransactionStorage } from "../../transaction/datastore/base-in-memory-storage"

describe("Checkpoint errors after successful steps", () => {
  const originalStorage = (DistributedTransaction as any).keyValueStore

  afterEach(() => {
    jest.restoreAllMocks()
    DistributedTransaction.setStorage(originalStorage)
  })

  async function fixture(background = false, parallel = false) {
    const storage = new BaseInMemoryDistributedTransactionStorage()
    const continuations: DistributedTransactionType[] = []
    storage.scheduleRetry = jest.fn(async (transaction) => {
      continuations.push(transaction)
    })
    storage.clearRetry = jest.fn(async () => {})
    DistributedTransaction.setStorage(storage)

    const state = { locked: false }
    const invoke = jest.fn(async (action: string) => ({ action }))
    const compensate = jest.fn(
      async (_action: string, _response: unknown) => {}
    )
    const write = {
      action: "write",
      async: background,
      backgroundExecution: background,
      maxRetries: 2,
      next: { action: "after" },
    }
    const strategy = new TransactionOrchestrator({
      id: "checkpoint-error",
      definition: {
        next: {
          action: "acquire",
          next: parallel ? [write, { action: "sibling" }] : write,
        },
      },
      options: { store: true },
    })
    const transaction = await strategy.beginTransaction({
      transactionId: "checkpoint-error-run",
      handler: async (
        action: string,
        type: TransactionHandlerType,
        _payload: TransactionPayload,
        current: DistributedTransactionType
      ) => {
        if (type === TransactionHandlerType.INVOKE) {
          if (action === "acquire") {
            state.locked = true
          }
          return invoke(action)
        }
        if (action === "acquire") {
          state.locked = false
        }
        return compensate(action, current.getContext().invoke[action])
      },
    })
    const step = (action: string) =>
      Object.values(transaction.getFlow().steps).find(
        (entry) => entry.definition?.action === action
      )!

    const pending: Promise<void>[] = []
    const backgroundErrors: unknown[] = []
    const execute = (strategy as any).executeAsyncStep.bind(strategy)
    jest
      .spyOn(strategy as any, "executeAsyncStep")
      .mockImplementation((...args: unknown[]) => {
        const execution = execute(...args)
        pending.push(
          execution.catch((error: unknown) => {
            backgroundErrors.push(error)
          })
        )
        return execution
      })

    async function drain() {
      for (let pass = 0; pass < 10; pass++) {
        await Promise.all(pending.splice(0))
        const next = continuations.shift()
        if (!next) {
          return
        }
        await strategy.resume(next)
      }
      throw new Error("Background continuation did not finish")
    }

    return {
      storage,
      strategy,
      transaction,
      step,
      state,
      invoke,
      compensate,
      backgroundErrors,
      drain,
    }
  }

  function expectReverted(result: Awaited<ReturnType<typeof fixture>>) {
    expect(result.transaction.getState()).toBe(TransactionState.REVERTED)
    expect(result.state.locked).toBe(false)
    expect(
      result.invoke.mock.calls.filter(([action]) => action === "write")
    ).toHaveLength(1)
    expect(result.invoke).not.toHaveBeenCalledWith("after")
    expect(result.compensate).toHaveBeenCalledWith("write", { action: "write" })
    expect(result.compensate).toHaveBeenCalledWith("acquire", {
      action: "acquire",
    })
    expect(result.step("write").invoke).toEqual({
      state: TransactionStepState.DONE,
      status: TransactionStepStatus.OK,
    })
    expect(result.backgroundErrors).toEqual([])
  }

  it.each([false, true])(
    "compensates a successful invoke after checkpoint failure (background: %s)",
    async (background) => {
      const result = await fixture(background)
      const error = new Error("Checkpoint unavailable")
      const save = result.transaction.saveCheckpoint.bind(result.transaction)
      let fail = true
      jest
        .spyOn(result.transaction, "saveCheckpoint")
        .mockImplementation(async (options) => {
          if (
            fail &&
            result.step("write").invoke.status === TransactionStepStatus.OK
          ) {
            fail = false
            throw error
          }
          return save(options)
        })

      await result.strategy.resume(result.transaction)
      await result.drain()

      expectReverted(result)
      expect(result.transaction.getErrors()).toEqual([
        expect.objectContaining({
          action: "write",
          handlerType: TransactionHandlerType.INVOKE,
          error: expect.objectContaining({ message: error.message }),
        }),
      ])
    }
  )

  it("compensates when reading the checkpoint fails during a storage-write retry", async () => {
    const result = await fixture()
    const readError = new Error("Checkpoint read unavailable")
    const save = result.storage.save.bind(result.storage)
    const get = result.storage.get.bind(result.storage)
    let failSave = true
    let failRead = false
    jest.spyOn(result.storage, "save").mockImplementation(async (...args) => {
      if (
        failSave &&
        result.step("write").invoke.status === TransactionStepStatus.OK
      ) {
        failSave = false
        failRead = true
        throw new Error("Checkpoint write unavailable")
      }
      return save(...args)
    })
    jest.spyOn(result.storage, "get").mockImplementation(async (...args) => {
      if (failRead) {
        failRead = false
        throw readError
      }
      return get(...args)
    })

    await result.strategy.resume(result.transaction)

    expectReverted(result)
    expect(result.transaction.getErrors()[0].error.message).toBe(
      readError.message
    )
    expect(result.storage.get).toHaveBeenCalled()
  })

  it("continues async compensation if the successful checkpoint was already accepted", async () => {
    const result = await fixture(true)
    const save = result.storage.save.bind(result.storage)
    const get = result.storage.get.bind(result.storage)
    let accepted = false
    let failRead = false
    jest.spyOn(result.storage, "save").mockImplementation(async (...args) => {
      const [, checkpoint, , options] = args
      if (
        accepted &&
        options?.stepId &&
        checkpoint.flow.state !== TransactionState.COMPENSATING
      ) {
        throw new SkipStepAlreadyFinishedError("Step already persisted")
      }
      if (
        !accepted &&
        result.step("write").invoke.status === TransactionStepStatus.OK
      ) {
        await save(...args)
        accepted = true
        failRead = true
        throw new Error("Checkpoint acknowledgement lost")
      }
      return save(...args)
    })
    jest.spyOn(result.storage, "get").mockImplementation(async (...args) => {
      if (failRead) {
        failRead = false
        throw new Error("Checkpoint read unavailable")
      }
      return get(...args)
    })

    await result.strategy.resume(result.transaction)
    await result.drain()

    expectReverted(result)
  })

  it("compensates completed parallel siblings without invoking either again", async () => {
    const result = await fixture(false, true)
    const save = result.transaction.saveCheckpoint.bind(result.transaction)
    let fail = true
    jest
      .spyOn(result.transaction, "saveCheckpoint")
      .mockImplementation(async (options) => {
        if (
          fail &&
          result.step("write").invoke.status === TransactionStepStatus.OK
        ) {
          fail = false
          throw new Error("Checkpoint unavailable")
        }
        return save(options)
      })

    await result.strategy.resume(result.transaction)

    expectReverted(result)
    expect(
      result.invoke.mock.calls.filter(([action]) => action === "sibling")
    ).toHaveLength(1)
    expect(
      result.compensate.mock.calls.filter(([action]) => action === "sibling")
    ).toHaveLength(1)
  })

  it("preserves the storage error if the compensation checkpoint also cannot be saved", async () => {
    const result = await fixture()
    const error = new Error("Checkpoint still unavailable")
    const save = result.transaction.saveCheckpoint.bind(result.transaction)
    jest
      .spyOn(result.transaction, "saveCheckpoint")
      .mockImplementation(async (options) => {
        if (result.step("write").invoke.status === TransactionStepStatus.OK) {
          throw error
        }
        return save(options)
      })

    await expect(result.strategy.resume(result.transaction)).rejects.toBe(error)
    expect(result.transaction.getState()).toBe(
      TransactionState.WAITING_TO_COMPENSATE
    )
    expect(result.step("write").invoke.status).toBe(TransactionStepStatus.OK)
    expect(result.step("write").failures).toBe(0)
    expect(
      result.invoke.mock.calls.filter(([action]) => action === "write")
    ).toHaveLength(1)
  })

  it("does not reclassify a successful compensation when its checkpoint fails", async () => {
    const result = await fixture()
    result.invoke.mockImplementation(async (action) => {
      if (action === "write") {
        throw new Error("Handler failed")
      }
      return { action }
    })
    const error = new Error("Compensation checkpoint unavailable")
    const save = result.transaction.saveCheckpoint.bind(result.transaction)
    jest
      .spyOn(result.transaction, "saveCheckpoint")
      .mockImplementation(async (options) => {
        if (
          result.step("acquire").compensate.status === TransactionStepStatus.OK
        ) {
          throw error
        }
        return save(options)
      })

    await expect(result.strategy.resume(result.transaction)).rejects.toBe(error)
    expect(
      result.compensate.mock.calls.filter(([action]) => action === "acquire")
    ).toHaveLength(1)
    expect(result.state.locked).toBe(false)
    expect(result.step("acquire").compensate).toEqual({
      state: TransactionStepState.REVERTED,
      status: TransactionStepStatus.OK,
    })
  })
})
