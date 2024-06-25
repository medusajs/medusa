import { TransactionStepState, TransactionStepStatus } from "@medusajs/utils"
import { setTimeout } from "timers/promises"
import {
  DistributedTransaction,
  TransactionHandlerType,
  TransactionOrchestrator,
  TransactionPayload,
  TransactionState,
  TransactionStepTimeoutError,
  TransactionStepsDefinition,
  TransactionTimeoutError,
} from "../../transaction"

describe("Transaction Orchestrator", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("Should follow the flow by calling steps in order with the correct payload", async () => {
    const mocks = {
      one: jest.fn().mockImplementation((payload) => {
        return payload
      }),
      two: jest.fn().mockImplementation((payload) => {
        return payload
      }),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      const command = {
        firstMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.one(payload)
          },
        },
        secondMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.two(payload)
          },
        },
      }
      return command[actionId][functionHandlerType](payload)
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "firstMethod",
        next: {
          action: "secondMethod",
        },
      },
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler,
      {
        prop: 123,
      }
    )

    await strategy.resume(transaction)

    expect(transaction.transactionId).toBe("transaction_id_123")
    expect(transaction.getState()).toBe(TransactionState.DONE)

    expect(mocks.one).toBeCalledWith(
      expect.objectContaining({
        metadata: {
          model_id: "transaction-name",
          idempotency_key:
            "transaction-name:transaction_id_123:firstMethod:invoke",
          action: "firstMethod",
          action_type: "invoke",
          attempt: 1,
          timestamp: expect.any(Number),
        },
        data: { prop: 123 },
      })
    )

    expect(mocks.two).toBeCalledWith(
      expect.objectContaining({
        metadata: {
          model_id: "transaction-name",
          idempotency_key:
            "transaction-name:transaction_id_123:secondMethod:invoke",
          action: "secondMethod",
          action_type: "invoke",
          attempt: 1,
          timestamp: expect.any(Number),
        },
        data: { prop: 123 },
      })
    )
  })

  it("Should resume steps in parallel if 'next' is an array", async () => {
    const actionOrder: string[] = []
    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      return actionOrder.push(actionId)
    }

    const flow: TransactionStepsDefinition = {
      next: [
        {
          action: "one",
        },
        {
          action: "two",
          next: {
            action: "four",
            next: {
              action: "six",
            },
          },
        },
        {
          action: "three",
          next: {
            action: "five",
          },
        },
      ],
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler
    )

    await strategy.resume(transaction)
    expect(actionOrder).toEqual(["one", "two", "three", "four", "five", "six"])
  })

  it("Should not execute next steps when a step fails", async () => {
    const actionOrder: string[] = []
    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      if (functionHandlerType === TransactionHandlerType.INVOKE) {
        actionOrder.push(actionId)
      }

      if (TransactionHandlerType.INVOKE && actionId === "three") {
        throw new Error()
      }
    }

    const flow: TransactionStepsDefinition = {
      next: [
        {
          action: "one",
        },
        {
          action: "two",
          next: {
            action: "four",
            next: {
              action: "six",
            },
          },
        },
        {
          action: "three",
          maxRetries: 0,
          next: {
            action: "five",
          },
        },
      ],
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler
    )

    await strategy.resume(transaction)
    expect(actionOrder).toEqual(["one", "two", "three"])
  })

  it("Should store invoke's step response by default or if flag 'saveResponse' is set to true and ignore it if set to false", async () => {
    const mocks = {
      one: jest.fn().mockImplementation((data) => {
        return { abc: 1234 }
      }),
      two: jest.fn().mockImplementation((data) => {
        return { def: "567" }
      }),
      three: jest.fn().mockImplementation((data, context) => {
        return { end: true, onePropAbc: context.invoke.firstMethod.abc }
      }),
      four: jest.fn().mockImplementation((data) => {
        return null
      }),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      const command = {
        firstMethod: {
          [TransactionHandlerType.INVOKE]: (data) => {
            return mocks.one(data)
          },
        },
        secondMethod: {
          [TransactionHandlerType.INVOKE]: (data) => {
            return mocks.two(data)
          },
        },
        thirdMethod: {
          [TransactionHandlerType.INVOKE]: (data, context) => {
            return mocks.three(data, context)
          },
        },
        fourthMethod: {
          [TransactionHandlerType.INVOKE]: (data) => {
            return mocks.four(data)
          },
        },
      }

      return command[actionId][functionHandlerType](
        payload.data,
        payload.context
      )
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "firstMethod",
        next: {
          action: "secondMethod",
          next: {
            action: "thirdMethod",
            next: {
              action: "fourthMethod",
              saveResponse: false,
            },
          },
        },
      },
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler,
      { prop: 123 }
    )

    await strategy.resume(transaction)

    expect(mocks.one).toBeCalledWith({ prop: 123 })
    expect(mocks.two).toBeCalledWith({ prop: 123 })

    expect(mocks.three).toBeCalledWith(
      { prop: 123 },
      {
        payload: {
          prop: 123,
        },
        invoke: {
          firstMethod: { abc: 1234 },
          secondMethod: { def: "567" },
          thirdMethod: { end: true, onePropAbc: 1234 },
        },
        compensate: {},
      }
    )
  })

  it("Should store compensate's step responses if flag 'saveResponse' is set to true", async () => {
    const mocks = {
      one: jest.fn().mockImplementation(() => {
        return 1
      }),
      two: jest.fn().mockImplementation(() => {
        return 2
      }),
      compensateOne: jest.fn().mockImplementation((compensateContext) => {
        return "compensate 1 - 2 = " + compensateContext.secondMethod.two
      }),
      compensateTwo: jest.fn().mockImplementation((compensateContext) => {
        return { two: "isCompensated" }
      }),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      const command = {
        firstMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            return mocks.one()
          },
          [TransactionHandlerType.COMPENSATE]: ({ compensate }) => {
            return mocks.compensateOne({ ...compensate })
          },
        },
        secondMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            return mocks.two()
          },
          [TransactionHandlerType.COMPENSATE]: ({ compensate }) => {
            return mocks.compensateTwo({ ...compensate })
          },
        },
        thirdMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            throw new Error("failed")
          },
        },
      }

      return command[actionId][functionHandlerType](payload.context)
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "firstMethod",
        saveResponse: true,
        next: {
          action: "secondMethod",
          saveResponse: true,
          next: {
            action: "thirdMethod",
            noCompensation: true,
          },
        },
      },
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler
    )

    await strategy.resume(transaction)
    const resposes = transaction.getContext()

    expect(mocks.compensateTwo).toBeCalledWith({})

    expect(mocks.compensateOne).toBeCalledWith({
      secondMethod: {
        two: "isCompensated",
      },
    })

    expect(resposes.compensate.firstMethod).toEqual(
      "compensate 1 - 2 = isCompensated"
    )
  })

  it("Should continue the exection of next steps without waiting for the execution of all its parents when flag 'noWait' is set to true", async () => {
    const actionOrder: string[] = []
    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      if (functionHandlerType === TransactionHandlerType.INVOKE) {
        actionOrder.push(actionId)
      }

      if (
        functionHandlerType === TransactionHandlerType.INVOKE &&
        actionId === "three"
      ) {
        throw new Error()
      }
    }

    const flow: TransactionStepsDefinition = {
      next: [
        {
          action: "one",
          next: {
            action: "five",
          },
        },
        {
          action: "two",
          noWait: true,
          next: {
            action: "four",
          },
        },
        {
          action: "three",
          maxRetries: 0,
        },
      ],
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler
    )

    strategy.resume(transaction)

    await new Promise((ok) => {
      strategy.on("finish", ok)
    })

    expect(actionOrder).toEqual(["one", "two", "three", "four"])
  })

  it("Should retry steps X times when a step fails and compensate steps afterward", async () => {
    const mocks = {
      one: jest.fn().mockImplementation((payload) => {
        return payload
      }),
      compensateOne: jest.fn().mockImplementation((payload) => {
        return payload
      }),
      two: jest.fn().mockImplementation((payload) => {
        throw new Error()
      }),
      compensateTwo: jest.fn().mockImplementation((payload) => {
        return payload
      }),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      const command = {
        firstMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.one(payload)
          },
          [TransactionHandlerType.COMPENSATE]: () => {
            mocks.compensateOne(payload)
          },
        },
        secondMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.two(payload)
          },
          [TransactionHandlerType.COMPENSATE]: () => {
            mocks.compensateTwo(payload)
          },
        },
      }

      return command[actionId][functionHandlerType](payload)
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "firstMethod",
        maxRetries: 3,
        next: {
          action: "secondMethod",
          maxRetries: 3,
        },
      },
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler
    )

    await strategy.resume(transaction)

    expect(transaction.transactionId).toBe("transaction_id_123")
    expect(mocks.one).toHaveBeenCalledTimes(1)
    expect(mocks.two).toHaveBeenCalledTimes(4)
    expect(transaction.getState()).toBe(TransactionState.REVERTED)
    expect(mocks.compensateOne).toHaveBeenCalledTimes(1)

    expect(mocks.two).nthCalledWith(
      1,
      expect.objectContaining({
        metadata: expect.objectContaining({
          attempt: 1,
        }),
      })
    )

    expect(mocks.two).nthCalledWith(
      4,
      expect.objectContaining({
        metadata: expect.objectContaining({
          attempt: 4,
        }),
      })
    )
  })

  it("Should fail a transaction if any step fails after retrying X time to compensate it", async () => {
    const mocks = {
      one: jest.fn().mockImplementation((payload) => {
        throw new Error()
      }),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      const command = {
        firstMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.one(payload)
          },
        },
      }

      return command[actionId][functionHandlerType](payload)
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "firstMethod",
        maxRetries: 1,
      },
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler
    )

    await strategy.resume(transaction)

    expect(mocks.one).toHaveBeenCalledTimes(2)
    expect(transaction.getState()).toBe(TransactionState.FAILED)
  })

  it("Should complete a transaction if a failing step has the flag 'continueOnPermanentFailure' set to true", async () => {
    const mocks = {
      one: jest.fn().mockImplementation((payload) => {
        return
      }),
      two: jest.fn().mockImplementation((payload) => {
        throw new Error()
      }),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      const command = {
        firstMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.one(payload)
          },
        },
        secondMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.two(payload)
          },
        },
      }

      return command[actionId][functionHandlerType](payload)
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "firstMethod",
        next: {
          action: "secondMethod",
          maxRetries: 1,
          continueOnPermanentFailure: true,
        },
      },
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler
    )

    await strategy.resume(transaction)

    expect(transaction.transactionId).toBe("transaction_id_123")
    expect(mocks.one).toHaveBeenCalledTimes(1)
    expect(mocks.two).toHaveBeenCalledTimes(2)
    expect(transaction.getState()).toBe(TransactionState.DONE)
    expect(transaction.isPartiallyCompleted).toBe(true)
  })

  it("Should hold the status INVOKING while the transaction hasn't finished", async () => {
    const mocks = {
      one: jest.fn().mockImplementation((payload) => {
        return
      }),
      two: jest.fn().mockImplementation((payload) => {
        return
      }),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      const command = {
        firstMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.one(payload)
          },
        },
        secondMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.two(payload)
          },
        },
      }

      return command[actionId][functionHandlerType](payload)
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "firstMethod",
        async: true,
        compensateAsync: true,
        next: {
          action: "secondMethod",
        },
      },
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler,
      {
        myPayloadProp: "test",
      }
    )

    await strategy.resume(transaction)

    expect(mocks.one).toHaveBeenCalledTimes(1)
    expect(mocks.two).toHaveBeenCalledTimes(0)
    expect(transaction.getState()).toBe(TransactionState.INVOKING)
    expect(transaction.getFlow().hasWaitingSteps).toBe(true)

    const mocktransactionId = TransactionOrchestrator.getKeyName(
      "transaction-name",
      transaction.transactionId,
      "firstMethod",
      TransactionHandlerType.INVOKE
    )
    await strategy.registerStepSuccess(
      mocktransactionId,
      undefined,
      transaction
    )

    expect(transaction.getState()).toBe(TransactionState.DONE)
    expect(transaction.getFlow().hasWaitingSteps).toBe(false)
  })

  it("Should hold the status COMPENSATING while the transaction hasn't finished compensating", async () => {
    const mocks = {
      one: jest.fn().mockImplementation((payload) => {
        return
      }),
      compensateOne: jest.fn().mockImplementation((payload) => {
        return
      }),
      two: jest.fn().mockImplementation((payload) => {
        return
      }),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      const command = {
        firstMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.one(payload)
          },
          [TransactionHandlerType.COMPENSATE]: () => {
            mocks.compensateOne(payload)
          },
        },
        secondMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.two(payload)
          },
        },
      }

      return command[actionId][functionHandlerType](payload)
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "firstMethod",
        async: true,
        compensateAsync: true,
        next: {
          action: "secondMethod",
          async: true,
          compensateAsync: true,
        },
      },
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler
    )

    const mocktransactionId = TransactionOrchestrator.getKeyName(
      "transaction-name",
      transaction.transactionId,
      "firstMethod",
      TransactionHandlerType.INVOKE
    )

    const mockSecondStepId = TransactionOrchestrator.getKeyName(
      "transaction-name",
      transaction.transactionId,
      "secondMethod",
      TransactionHandlerType.INVOKE
    )

    await strategy.resume(transaction)

    expect(mocks.one).toHaveBeenCalledTimes(1)
    expect(mocks.compensateOne).toHaveBeenCalledTimes(0)
    expect(mocks.two).toHaveBeenCalledTimes(0)

    const registerBeforeAllowed = await strategy
      .registerStepSuccess(mockSecondStepId, handler)
      .catch((e) => e.message)

    expect(registerBeforeAllowed).toEqual(
      "Cannot set step success when status is idle"
    )
    expect(transaction.getState()).toBe(TransactionState.INVOKING)

    const resumedTransaction = await strategy.registerStepFailure(
      mocktransactionId,
      null,
      handler
    )

    expect(resumedTransaction.getState()).toBe(TransactionState.COMPENSATING)
    expect(mocks.compensateOne).toHaveBeenCalledTimes(1)

    const mocktransactionIdCompensate = TransactionOrchestrator.getKeyName(
      "transaction-name",
      transaction.transactionId,
      "firstMethod",
      TransactionHandlerType.COMPENSATE
    )
    await strategy.registerStepSuccess(
      mocktransactionIdCompensate,
      undefined,
      resumedTransaction
    )

    expect(resumedTransaction.getState()).toBe(TransactionState.REVERTED)
  })

  it("Should hold the status REVERTED if the steps failed and the compensation succeed and has some no compensations step set", async () => {
    const mocks = {
      one: jest.fn().mockImplementation((payload) => {
        return
      }),
      compensateOne: jest.fn().mockImplementation((payload) => {
        return
      }),
      two: jest.fn().mockImplementation((payload) => {
        return
      }),
      compensateTwo: jest.fn().mockImplementation((payload) => {
        return
      }),
      three: jest.fn().mockImplementation((payload) => {
        throw new Error("Third step error")
      }),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      const command = {
        firstMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.one(payload)
          },
          [TransactionHandlerType.COMPENSATE]: () => {
            mocks.compensateOne(payload)
          },
        },
        secondMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.two(payload)
          },
          [TransactionHandlerType.COMPENSATE]: () => {
            mocks.compensateTwo(payload)
          },
        },
        thirdMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.three(payload)
          },
        },
      }

      return command[actionId][functionHandlerType](payload)
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "firstMethod",
        next: {
          action: "secondMethod",
          next: {
            action: "thirdMethod",
            noCompensation: true,
          },
        },
      },
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler
    )

    await strategy.resume(transaction)

    expect(mocks.one).toHaveBeenCalledTimes(1)
    expect(mocks.compensateOne).toHaveBeenCalledTimes(1)
    expect(mocks.two).toHaveBeenCalledTimes(1)
    expect(mocks.compensateTwo).toHaveBeenCalledTimes(1)
    expect(mocks.three).toHaveBeenCalledTimes(1)

    expect(transaction.getState()).toBe(TransactionState.REVERTED)
  })

  it("Should revert a transaction when .cancelTransaction() is called", async () => {
    const mocks = {
      one: jest.fn().mockImplementation((payload) => {
        return payload
      }),
      oneCompensate: jest.fn().mockImplementation((payload) => {
        return payload
      }),
      two: jest.fn().mockImplementation((payload) => {
        return payload
      }),
      twoCompensate: jest.fn().mockImplementation((payload) => {
        return payload
      }),
    }

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload
    ) {
      const command = {
        firstMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.one(payload)
          },
          [TransactionHandlerType.COMPENSATE]: () => {
            mocks.oneCompensate(payload)
          },
        },
        secondMethod: {
          [TransactionHandlerType.INVOKE]: () => {
            mocks.two(payload)
          },
          [TransactionHandlerType.COMPENSATE]: () => {
            mocks.twoCompensate(payload)
          },
        },
      }
      return command[actionId][functionHandlerType](payload)
    }

    const flow: TransactionStepsDefinition = {
      next: {
        action: "firstMethod",
        next: {
          action: "secondMethod",
        },
      },
    }

    const strategy = new TransactionOrchestrator("transaction-name", flow)

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler
    )

    await strategy.resume(transaction)

    expect(transaction.getState()).toBe(TransactionState.DONE)
    expect(mocks.one).toHaveBeenCalledTimes(1)
    expect(mocks.two).toHaveBeenCalledTimes(1)

    await strategy.cancelTransaction(transaction)

    expect(transaction.getState()).toBe(TransactionState.REVERTED)
    expect(mocks.one).toHaveBeenCalledTimes(1)
    expect(mocks.two).toHaveBeenCalledTimes(1)
    expect(mocks.oneCompensate).toHaveBeenCalledTimes(1)
    expect(mocks.twoCompensate).toHaveBeenCalledTimes(1)
  })

  it("Should receive the current transaction as reference in the handler", async () => {
    let transactionInHandler

    async function handler(
      actionId: string,
      functionHandlerType: TransactionHandlerType,
      payload: TransactionPayload,
      transaction?: DistributedTransaction
    ) {
      transactionInHandler = transaction
    }

    const strategy = new TransactionOrchestrator("transaction-name", {
      next: {
        action: "firstMethod",
      },
    })

    const transaction = await strategy.beginTransaction(
      "transaction_id_123",
      handler
    )

    await strategy.resume(transaction)

    expect(transaction).toBe(transactionInHandler)
  })

  describe("Timeouts - Transaction and Step", () => {
    it("should fail the current steps and revert the transaction if the Transaction Timeout is reached", async () => {
      const mocks = {
        f1: jest.fn(() => {
          return "content f1"
        }),
        f2: jest.fn(async () => {
          await setTimeout(200)
          return "delayed content f2"
        }),
        f3: jest.fn(() => {
          return "content f3"
        }),
        f4: jest.fn(() => {
          return "content f4"
        }),
      }

      async function handler(
        actionId: string,
        functionHandlerType: TransactionHandlerType,
        payload: TransactionPayload
      ) {
        const command = {
          action1: {
            [TransactionHandlerType.INVOKE]: () => {
              return mocks.f1()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f1()
            },
          },
          action2: {
            [TransactionHandlerType.INVOKE]: async () => {
              return await mocks.f2()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f2()
            },
          },
          action3: {
            [TransactionHandlerType.INVOKE]: () => {
              return mocks.f3()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f3()
            },
          },
          action4: {
            [TransactionHandlerType.INVOKE]: () => {
              return mocks.f4()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f4()
            },
          },
        }

        return command[actionId][functionHandlerType]()
      }

      const flow: TransactionStepsDefinition = {
        next: {
          action: "action1",
          next: [
            {
              action: "action2",
            },
            {
              action: "action3",
              next: {
                action: "action4",
              },
            },
          ],
        },
      }

      const strategy = new TransactionOrchestrator("transaction-name", flow, {
        timeout: 0.1, // 100ms
      })

      const transaction = await strategy.beginTransaction(
        "transaction_id_123",
        handler
      )

      await strategy.resume(transaction)

      expect(transaction.transactionId).toBe("transaction_id_123")
      expect(mocks.f1).toHaveBeenCalledTimes(2)
      expect(mocks.f2).toHaveBeenCalledTimes(2)
      expect(mocks.f3).toHaveBeenCalledTimes(2)
      expect(mocks.f4).toHaveBeenCalledTimes(0)
      expect(transaction.getContext().invoke.action1).toBe("content f1")
      expect(transaction.getContext().invoke.action2).toBe("delayed content f2")
      expect(transaction.getContext().invoke.action3).toBe("content f3")
      expect(transaction.getContext().invoke.action4).toBe(undefined)

      expect(transaction.getErrors()[0].error).toBeInstanceOf(
        TransactionTimeoutError
      )
      expect(transaction.getErrors()[0].action).toBe("action2")

      expect(transaction.getState()).toBe(TransactionState.REVERTED)
    })

    it("should continue the transaction and skip children steps when the Transaction Step Timeout is reached but the step is set to 'continueOnPermanentFailure'", async () => {
      const mocks = {
        f1: jest.fn(() => {
          return "content f1"
        }),
        f2: jest.fn(async () => {
          await setTimeout(200)
          return "delayed content f2"
        }),
        f3: jest.fn(() => {
          return "content f3"
        }),
        f4: jest.fn(() => {
          return "content f4"
        }),
      }

      async function handler(
        actionId: string,
        functionHandlerType: TransactionHandlerType,
        payload: TransactionPayload
      ) {
        const command = {
          action1: {
            [TransactionHandlerType.INVOKE]: () => {
              return mocks.f1()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f1()
            },
          },
          action2: {
            [TransactionHandlerType.INVOKE]: async () => {
              return await mocks.f2()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f2()
            },
          },
          action3: {
            [TransactionHandlerType.INVOKE]: () => {
              return mocks.f3()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f3()
            },
          },
          action4: {
            [TransactionHandlerType.INVOKE]: () => {
              return mocks.f4()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f4()
            },
          },
        }

        return command[actionId][functionHandlerType]()
      }

      const flow: TransactionStepsDefinition = {
        next: {
          action: "action1",
          next: [
            {
              timeout: 0.1, // 100ms
              action: "action2",
              continueOnPermanentFailure: true,
              next: {
                action: "action4",
              },
            },
            {
              action: "action3",
            },
          ],
        },
      }

      const strategy = new TransactionOrchestrator("transaction-name", flow)

      const transaction = await strategy.beginTransaction(
        "transaction_id_123",
        handler
      )

      await strategy.resume(transaction)

      expect(transaction.transactionId).toBe("transaction_id_123")
      expect(mocks.f1).toHaveBeenCalledTimes(1)
      expect(mocks.f2).toHaveBeenCalledTimes(1)
      expect(mocks.f3).toHaveBeenCalledTimes(1)
      expect(mocks.f4).toHaveBeenCalledTimes(0)
      expect(transaction.getContext().invoke.action1).toBe("content f1")
      expect(transaction.getContext().invoke.action2).toBe("delayed content f2")
      expect(transaction.getContext().invoke.action3).toBe("content f3")
      expect(transaction.getContext().invoke.action4).toBe(undefined)
      expect(
        transaction.getFlow().steps["_root.action1.action2"].invoke.state
      ).toBe(TransactionStepState.TIMEOUT)
      expect(
        transaction.getFlow().steps["_root.action1.action2"].invoke.status
      ).toBe(TransactionStepStatus.PERMANENT_FAILURE)
      expect(
        transaction.getFlow().steps["_root.action1.action2"].compensate.state
      ).toBe(TransactionStepState.DORMANT)
      expect(
        transaction.getFlow().steps["_root.action1.action2.action4"].invoke
          .state
      ).toBe(TransactionStepState.SKIPPED)
      expect(
        transaction.getFlow().steps["_root.action1.action2.action4"].invoke
          .status
      ).toBe(TransactionStepStatus.IDLE)

      expect(transaction.getState()).toBe(TransactionState.DONE)
    })

    it("should fail the current steps and revert the transaction if the Step Timeout is reached", async () => {
      const mocks = {
        f1: jest.fn(() => {
          return "content f1"
        }),
        f2: jest.fn(async () => {
          await setTimeout(200)
          return "delayed content f2"
        }),
        f3: jest.fn(() => {
          return "content f3"
        }),
        f4: jest.fn(() => {
          return "content f4"
        }),
      }

      async function handler(
        actionId: string,
        functionHandlerType: TransactionHandlerType,
        payload: TransactionPayload
      ) {
        const command = {
          action1: {
            [TransactionHandlerType.INVOKE]: () => {
              return mocks.f1()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f1()
            },
          },
          action2: {
            [TransactionHandlerType.INVOKE]: async () => {
              return await mocks.f2()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f2()
            },
          },
          action3: {
            [TransactionHandlerType.INVOKE]: () => {
              return mocks.f3()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f3()
            },
          },
          action4: {
            [TransactionHandlerType.INVOKE]: () => {
              return mocks.f4()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f4()
            },
          },
        }

        return command[actionId][functionHandlerType]()
      }

      const flow: TransactionStepsDefinition = {
        next: {
          action: "action1",
          next: [
            {
              action: "action2",
              timeout: 0.1, // 100ms
            },
            {
              action: "action3",
              next: {
                action: "action4",
              },
            },
          ],
        },
      }

      const strategy = new TransactionOrchestrator("transaction-name", flow)

      const transaction = await strategy.beginTransaction(
        "transaction_id_123",
        handler
      )

      await strategy.resume(transaction)

      expect(transaction.transactionId).toBe("transaction_id_123")
      expect(mocks.f1).toHaveBeenCalledTimes(2)
      expect(mocks.f2).toHaveBeenCalledTimes(2)
      expect(mocks.f3).toHaveBeenCalledTimes(2)
      expect(mocks.f4).toHaveBeenCalledTimes(0)
      expect(transaction.getContext().invoke.action1).toBe("content f1")
      expect(transaction.getContext().invoke.action2).toBe("delayed content f2")
      expect(transaction.getContext().invoke.action3).toBe("content f3")
      expect(transaction.getContext().invoke.action4).toBe(undefined)

      expect(transaction.getErrors()[0].error).toBeInstanceOf(
        TransactionStepTimeoutError
      )
      expect(transaction.getErrors()[0].action).toBe("action2")

      expect(transaction.getState()).toBe(TransactionState.REVERTED)
    })

    it("should fail the current steps and revert the transaction if the Transaction Timeout is reached event if the step is set as 'continueOnPermanentFailure'", async () => {
      const mocks = {
        f1: jest.fn(() => {
          return "content f1"
        }),
        f2: jest.fn(async () => {
          await setTimeout(200)
          return "delayed content f2"
        }),
        f3: jest.fn(async () => {
          await setTimeout(200)
          return "content f3"
        }),
        f4: jest.fn(() => {
          return "content f4"
        }),
      }

      async function handler(
        actionId: string,
        functionHandlerType: TransactionHandlerType,
        payload: TransactionPayload
      ) {
        const command = {
          action1: {
            [TransactionHandlerType.INVOKE]: () => {
              return mocks.f1()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f1()
            },
          },
          action2: {
            [TransactionHandlerType.INVOKE]: async () => {
              return await mocks.f2()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f2()
            },
          },
          action3: {
            [TransactionHandlerType.INVOKE]: async () => {
              return await mocks.f3()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f3()
            },
          },
          action4: {
            [TransactionHandlerType.INVOKE]: () => {
              return mocks.f4()
            },
            [TransactionHandlerType.COMPENSATE]: () => {
              return mocks.f4()
            },
          },
        }

        return command[actionId][functionHandlerType]()
      }

      const flow: TransactionStepsDefinition = {
        next: {
          action: "action1",
          next: [
            {
              action: "action2",
              continueOnPermanentFailure: true,
            },
            {
              action: "action3",
              continueOnPermanentFailure: true,
              next: {
                action: "action4",
              },
            },
          ],
        },
      }

      const strategy = new TransactionOrchestrator("transaction-name", flow, {
        timeout: 0.1, // 100ms
      })

      const transaction = await strategy.beginTransaction(
        "transaction_id_123",
        handler
      )

      await strategy.resume(transaction)

      expect(transaction.transactionId).toBe("transaction_id_123")
      expect(mocks.f1).toHaveBeenCalledTimes(2)
      expect(mocks.f2).toHaveBeenCalledTimes(2)
      expect(mocks.f3).toHaveBeenCalledTimes(2)
      expect(mocks.f4).toHaveBeenCalledTimes(0)
      expect(transaction.getContext().invoke.action1).toBe("content f1")
      expect(transaction.getContext().invoke.action2).toBe("delayed content f2")
      expect(transaction.getContext().invoke.action3).toBe("content f3")
      expect(transaction.getContext().invoke.action4).toBe(undefined)

      expect(transaction.getErrors()).toHaveLength(2)
      expect(
        TransactionTimeoutError.isTransactionTimeoutError(
          transaction.getErrors()[0].error
        )
      ).toBe(true)
      expect(transaction.getErrors()[0].action).toBe("action2")

      expect(
        TransactionTimeoutError.isTransactionTimeoutError(
          transaction.getErrors()[1].error
        )
      ).toBe(true)
      expect(transaction.getErrors()[1].action).toBe("action3")

      expect(transaction.getState()).toBe(TransactionState.REVERTED)
    })
  })
})
