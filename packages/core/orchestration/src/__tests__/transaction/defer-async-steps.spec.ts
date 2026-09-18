import { TransactionStepState } from "@medusajs/utils"
import { setTimeout } from "timers/promises"
import {
  DistributedTransaction,
  DistributedTransactionType,
  TransactionHandlerType,
  TransactionOrchestrator,
  TransactionPayload,
  TransactionState,
  TransactionStep,
  TransactionStepsDefinition,
} from "../../transaction"
import { BaseInMemoryDistributedTransactionStorage } from "../../transaction/datastore/base-in-memory-storage"

class DeferringStorage extends BaseInMemoryDistributedTransactionStorage {
  executeAsyncStepsLocally = false
  scheduledRetries: { action: string; interval: number; state: string }[] = []

  shouldExecuteAsyncStepsLocally(): boolean {
    return this.executeAsyncStepsLocally
  }

  async scheduleRetry(
    transaction: DistributedTransactionType,
    step: TransactionStep,
    timestamp: number,
    interval: number
  ): Promise<void> {
    this.scheduledRetries.push({
      action: step.definition.action!,
      interval,
      state: step.getStates().state,
    })
  }
}

// Async steps are invoked fire-and-forget, wait for their completion chain
const settleAsyncExecution = async () => {
  await setTimeout(0)
}

describe("Transaction Orchestrator - deferred async steps", () => {
  afterEach(() => {
    jest.clearAllMocks()
    DistributedTransaction.setStorage(
      new BaseInMemoryDistributedTransactionStorage()
    )
  })

  it("should defer async steps instead of invoking them locally and let a resuming instance pick them up through the regular execution path", async () => {
    const storage = new DeferringStorage()
    DistributedTransaction.setStorage(storage)

    const mocks = {
      one: jest.fn(),
      two: jest.fn(),
      three: jest.fn(),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      return mocks[actionId](payload)
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "one",
        next: {
          action: "two",
          async: true,
          backgroundExecution: true,
          next: {
            action: "three",
            async: true,
            backgroundExecution: true,
          },
        },
      },
    }

    const strategy = new TransactionOrchestrator({
      id: "defer-async-steps",
      definition: flow,
    })

    const transaction = await strategy.beginTransaction({
      transactionId: "trx_defer_1",
      handler,
    })

    // Instance that doesn't execute async steps locally (e.g. a server
    // instance): the sync prefix runs inline, the async step is left
    // untouched and handed off through an immediate retry
    await strategy.resume(transaction)
    await settleAsyncExecution()

    expect(mocks.one).toHaveBeenCalledTimes(1)
    expect(mocks.two).not.toHaveBeenCalled()
    expect(storage.scheduledRetries).toEqual([
      {
        action: "two",
        interval: 0,
        state: TransactionStepState.NOT_STARTED,
      },
    ])
    expect(transaction.getState()).toBe(TransactionState.INVOKING)

    // Worker instance consumes the retry job and resumes the transaction,
    // invoking the deferred step through the regular execution path
    storage.executeAsyncStepsLocally = true
    await strategy.resume(transaction)
    await settleAsyncExecution()

    expect(mocks.two).toHaveBeenCalledTimes(1)

    // The completion of "two" schedules the continuation as usual
    const lastRetry =
      storage.scheduledRetries[storage.scheduledRetries.length - 1]
    expect(lastRetry).toEqual(
      expect.objectContaining({ action: "two", interval: 0 })
    )

    // Next retry job invokes the downstream async step on the worker
    await strategy.resume(transaction)
    await settleAsyncExecution()

    expect(mocks.three).toHaveBeenCalledTimes(1)

    await strategy.resume(transaction)
    expect(transaction.getState()).toBe(TransactionState.DONE)
  })

  it("should still execute sync steps locally while deferring async steps of the same tier", async () => {
    const storage = new DeferringStorage()
    DistributedTransaction.setStorage(storage)

    const mocks = {
      syncStep: jest.fn(),
      asyncStep: jest.fn(),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      return mocks[actionId](payload)
    }

    const flow: TransactionStepsDefinition = {
      next: [
        {
          action: "syncStep",
        },
        {
          action: "asyncStep",
          async: true,
          backgroundExecution: true,
        },
      ],
    }

    const strategy = new TransactionOrchestrator({
      id: "defer-async-steps-mixed",
      definition: flow,
    })

    const transaction = await strategy.beginTransaction({
      transactionId: "trx_defer_2",
      handler,
    })

    await strategy.resume(transaction)
    await settleAsyncExecution()

    expect(mocks.syncStep).toHaveBeenCalledTimes(1)
    expect(mocks.asyncStep).not.toHaveBeenCalled()

    // The deferred step can be re-scheduled across loop iterations, the job
    // queue deduplicates by job id. All records point to the async step only
    const actions = new Set(storage.scheduledRetries.map((r) => r.action))
    expect(actions).toEqual(new Set(["asyncStep"]))
    expect(
      storage.scheduledRetries.every((retry) => retry.interval === 0)
    ).toBe(true)
    expect(transaction.getState()).toBe(TransactionState.INVOKING)
  })

  it("should defer async compensation steps", async () => {
    const storage = new DeferringStorage()
    DistributedTransaction.setStorage(storage)

    const mocks = {
      one: jest.fn(),
      compensateOne: jest.fn(),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      const command = {
        one: {
          [TransactionHandlerType.INVOKE]: () => mocks.one(),
          [TransactionHandlerType.COMPENSATE]: () => mocks.compensateOne(),
        },
        two: {
          [TransactionHandlerType.INVOKE]: () => {
            throw new Error("step two failed")
          },
        },
      }

      return command[actionId][functionHandlerType]()
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "one",
        compensateAsync: true,
        backgroundExecution: true,
        next: {
          action: "two",
          maxRetries: 0,
        },
      },
    }

    const strategy = new TransactionOrchestrator({
      id: "defer-async-compensation",
      definition: flow,
    })

    const transaction = await strategy.beginTransaction({
      transactionId: "trx_defer_3",
      handler,
    })

    await strategy.resume(transaction)
    await settleAsyncExecution()

    expect(mocks.one).toHaveBeenCalledTimes(1)
    expect(mocks.compensateOne).not.toHaveBeenCalled()
    expect(transaction.getState()).toBe(TransactionState.COMPENSATING)

    const actions = new Set(storage.scheduledRetries.map((r) => r.action))
    expect(actions).toEqual(new Set(["one"]))

    // Worker instance picks up the deferred compensation
    storage.executeAsyncStepsLocally = true
    await strategy.resume(transaction)
    await settleAsyncExecution()

    expect(mocks.compensateOne).toHaveBeenCalledTimes(1)

    // The transaction ends FAILED because a step failed, with the executed
    // steps compensated
    await strategy.resume(transaction)
    expect(transaction.getState()).toBe(TransactionState.FAILED)
  })

  it("should invoke async steps locally when the storage executes async steps locally", async () => {
    const storage = new DeferringStorage()
    storage.executeAsyncStepsLocally = true
    DistributedTransaction.setStorage(storage)

    const mocks = {
      one: jest.fn(),
      two: jest.fn(),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      return mocks[actionId](payload)
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "one",
        next: {
          action: "two",
          async: true,
          backgroundExecution: true,
        },
      },
    }

    const strategy = new TransactionOrchestrator({
      id: "local-async-steps",
      definition: flow,
    })

    const transaction = await strategy.beginTransaction({
      transactionId: "trx_defer_4",
      handler,
    })

    await strategy.resume(transaction)
    await settleAsyncExecution()

    expect(mocks.one).toHaveBeenCalledTimes(1)
    expect(mocks.two).toHaveBeenCalledTimes(1)
  })

  it("should default to executing async steps locally when the storage does not implement the capability", () => {
    const storage = new BaseInMemoryDistributedTransactionStorage()

    expect(storage.shouldExecuteAsyncStepsLocally()).toBe(true)
  })
})
