import { MedusaApp } from "@medusajs/modules-sdk"
import {
  TransactionStepTimeoutError,
  TransactionTimeoutError,
  WorkflowManager,
} from "@medusajs/orchestration"
import {
  IWorkflowEngineService,
  MedusaContainer,
  RemoteQueryFunction,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  Module,
  Modules,
  TransactionHandlerType,
  TransactionStepState,
} from "@medusajs/utils"
import { asFunction, asValue } from "awilix"
import { knex } from "knex"
import { setTimeout } from "timers/promises"
import "../__fixtures__"
import { createScheduled } from "../__fixtures__/workflow_scheduled"
import { DB_URL, TestDatabase } from "../utils"
import { WorkflowsModuleService } from "@medusajs/workflow-engine-inmemory/dist/services"
import Redis from "ioredis"

jest.setTimeout(100000)

const sharedPgConnection = knex<any, any>({
  client: "pg",
  searchPath: process.env.MEDUSA_WORKFLOW_ENGINE_DB_SCHEMA,
  connection: {
    connectionString: DB_URL,
    debug: false,
  },
})

const afterEach_ = async () => {
  await TestDatabase.clearTables(sharedPgConnection)
}

function times(num) {
  let resolver
  let counter = 0
  const promise = new Promise((resolve) => {
    resolver = resolve
  })

  return {
    next: () => {
      counter += 1
      if (counter === num) {
        resolver()
      }
    },
    promise,
  }
}

describe("Workflow Orchestrator module", function () {
  let workflowOrcModule: IWorkflowEngineService
  let query: RemoteQueryFunction
  let sharedContainer_: MedusaContainer

  beforeAll(async () => {
    const container = createMedusaContainer()
    container.register(ContainerRegistrationKeys.LOGGER, asValue(console))

    // Clear any residual data in Redis
    const redisClient = new Redis()
    redisClient.flushall()

    const {
      runMigrations,
      query: remoteQuery,
      modules,
      sharedContainer,
      onApplicationStart,
    } = await MedusaApp({
      sharedContainer: container,
      sharedResourcesConfig: {
        database: {
          connection: sharedPgConnection,
        },
      },
      modulesConfig: {
        workflows: {
          resolve: __dirname + "/../..",
          options: {
            redis: {
              url: "localhost:6379",
            },
          },
        },
      },
    })

    query = remoteQuery
    sharedContainer_ = sharedContainer!

    await runMigrations()
    await onApplicationStart()

    workflowOrcModule = modules.workflows as unknown as IWorkflowEngineService
  })

  it(`should export the appropriate linkable configuration`, () => {
    const linkable = Module(Modules.WORKFLOW_ENGINE, {
      service: WorkflowsModuleService,
    }).linkable

    expect(Object.keys(linkable)).toEqual(["workflowExecution"])

    Object.keys(linkable).forEach((key) => {
      delete linkable[key].toJSON
    })

    expect(linkable).toEqual({
      workflowExecution: {
        id: {
          linkable: "workflow_execution_id",
          primaryKey: "id",
          serviceName: "workflows",
          field: "workflowExecution",
        },
      },
    })
  })

  describe("Testing basic workflow", function () {
    afterEach(afterEach_)

    it("should return a list of workflow executions and remove after completed when there is no retentionTime set", async () => {
      await workflowOrcModule.run("workflow_1", {
        input: {
          value: "123",
        },
        throwOnError: true,
      })

      let executionsList = await query({
        workflow_executions: {
          fields: ["workflow_id", "transaction_id", "state"],
        },
      })

      expect(executionsList).toHaveLength(1)

      const { result } = await workflowOrcModule.setStepSuccess({
        idempotencyKey: {
          action: TransactionHandlerType.INVOKE,
          stepId: "new_step_name",
          workflowId: "workflow_1",
          transactionId: executionsList[0].transaction_id,
        },
        stepResponse: { uhuuuu: "yeaah!" },
      })

      executionsList = await query({
        workflow_executions: {
          fields: ["id"],
        },
      })

      expect(executionsList).toHaveLength(0)
      expect(result).toEqual({
        done: {
          inputFromSyncStep: "oh",
        },
      })
    })

    it("should return a list of workflow executions and keep it saved when there is a retentionTime set", async () => {
      await workflowOrcModule.run("workflow_2", {
        input: {
          value: "123",
        },
        throwOnError: true,
        transactionId: "transaction_1",
      })

      let executionsList = await query({
        workflow_executions: {
          fields: ["id"],
        },
      })

      expect(executionsList).toHaveLength(1)

      await workflowOrcModule.setStepSuccess({
        idempotencyKey: {
          action: TransactionHandlerType.INVOKE,
          stepId: "new_step_name",
          workflowId: "workflow_2",
          transactionId: "transaction_1",
        },
        stepResponse: { uhuuuu: "yeaah!" },
      })

      executionsList = await query({
        workflow_executions: {
          fields: ["id"],
        },
      })

      expect(executionsList).toHaveLength(1)
    })

    it("should revert the entire transaction when a step timeout expires", async () => {
      const { transaction, result, errors } = await workflowOrcModule.run(
        "workflow_step_timeout",
        {
          input: {
            myInput: "123",
          },
          throwOnError: false,
        }
      )

      expect(transaction.flow.state).toEqual("reverted")
      expect(result).toEqual({
        myInput: "123",
      })
      expect(errors).toHaveLength(1)
      expect(errors[0].action).toEqual("step_1")
      expect(errors[0].error).toBeInstanceOf(TransactionStepTimeoutError)
    })

    it("should revert the entire transaction when the transaction timeout expires", async () => {
      const { transaction, result, errors } = await workflowOrcModule.run(
        "workflow_transaction_timeout",
        {
          input: {},
          transactionId: "trx",
          throwOnError: false,
        }
      )

      expect(transaction.flow.state).toEqual("reverted")
      expect(result).toEqual({ executed: true })
      expect(errors).toHaveLength(1)
      expect(errors[0].action).toEqual("step_1")
      expect(
        TransactionTimeoutError.isTransactionTimeoutError(errors[0].error)
      ).toBe(true)
    })

    it("should revert the entire transaction when a step timeout expires in a async step", async () => {
      await workflowOrcModule.run("workflow_step_timeout_async", {
        input: {
          myInput: "123",
        },
        transactionId: "transaction_1",
        throwOnError: false,
      })

      await setTimeout(200)

      const { transaction, result, errors } = await workflowOrcModule.run(
        "workflow_step_timeout_async",
        {
          input: {
            myInput: "123",
          },
          transactionId: "transaction_1",
          throwOnError: false,
        }
      )

      expect(transaction.flow.state).toEqual("reverted")
      expect(result).toEqual(undefined)
      expect(errors).toHaveLength(1)
      expect(errors[0].action).toEqual("step_1_async")
      expect(
        TransactionStepTimeoutError.isTransactionStepTimeoutError(
          errors[0].error
        )
      ).toBe(true)
    })

    it("should revert the entire transaction when the transaction timeout expires in a transaction containing an async step", async () => {
      await workflowOrcModule.run("workflow_transaction_timeout_async", {
        input: {},
        transactionId: "transaction_1",
        throwOnError: false,
      })

      await setTimeout(200)

      const { transaction, result, errors } = await workflowOrcModule.run(
        "workflow_transaction_timeout_async",
        {
          input: {},
          transactionId: "transaction_1",
          throwOnError: false,
        }
      )

      expect(transaction.flow.state).toEqual("reverted")
      expect(result).toEqual(undefined)
      expect(errors).toHaveLength(1)
      expect(errors[0].action).toEqual("step_1")
      expect(
        TransactionTimeoutError.isTransactionTimeoutError(errors[0].error)
      ).toBe(true)
    })

    it("should complete an async workflow that returns a StepResponse", async () => {
      const { transaction, result } = await workflowOrcModule.run(
        "workflow_async_background",
        {
          input: {
            myInput: "123",
          },
          transactionId: "transaction_1",
          throwOnError: false,
        }
      )

      expect(transaction.flow.state).toEqual(TransactionStepState.INVOKING)
      expect(result).toEqual(undefined)

      await setTimeout(205)

      const trx = await workflowOrcModule.run("workflow_async_background", {
        input: {
          myInput: "123",
        },
        transactionId: "transaction_1",
        throwOnError: false,
      })

      expect(trx.transaction.flow.state).toEqual(TransactionStepState.DONE)
      expect(trx.result).toEqual({
        myInput: "123",
      })
    })

    it("should subsctibe to a async workflow and receive the response when it finishes", (done) => {
      const transactionId = "trx_123"

      const onFinish = jest.fn(() => {
        done()
      })

      void workflowOrcModule.run("workflow_async_background", {
        input: {
          myInput: "123",
        },
        transactionId,
        throwOnError: false,
      })

      void workflowOrcModule.subscribe({
        workflowId: "workflow_async_background",
        transactionId,
        subscriber: (event) => {
          if (event.eventType === "onFinish") {
            onFinish()
          }
        },
      })

      expect(onFinish).toHaveBeenCalledTimes(0)
    })
  })

  // Note: These tests depend on actual Redis instance and waiting for the scheduled jobs to run, which isn't great.
  // Mocking bullmq, however, would make the tests close to useless, so we can keep them very minimal and serve as smoke tests.
  describe("Scheduled workflows", () => {
    it("should execute a scheduled workflow", async () => {
      const wait = times(2)
      const spy = createScheduled("standard", wait.next)

      await wait.promise
      expect(spy).toHaveBeenCalledTimes(2)
      WorkflowManager.unregister("standard")
    })

    it("should stop executions after the set number of executions", async () => {
      const wait = times(2)
      const spy = await createScheduled("num-executions", wait.next, {
        cron: "* * * * * *",
        numberOfExecutions: 2,
      })

      await wait.promise
      expect(spy).toHaveBeenCalledTimes(2)

      // Make sure that on the next tick it doesn't execute again
      await setTimeout(1100)
      expect(spy).toHaveBeenCalledTimes(2)

      WorkflowManager.unregister("num-execution")
    })

    it("should remove scheduled workflow if workflow no longer exists", async () => {
      const wait = times(1)
      const logger = sharedContainer_.resolve<Logger>(
        ContainerRegistrationKeys.LOGGER
      )

      const spy = await createScheduled("remove-scheduled", wait.next, {
        cron: "* * * * * *",
      })
      const logSpy = jest.spyOn(logger, "warn")

      await wait.promise
      expect(spy).toHaveBeenCalledTimes(1)
      WorkflowManager["workflows"].delete("remove-scheduled")

      await setTimeout(1100)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(logSpy).toHaveBeenCalledWith(
        "Tried to execute a scheduled workflow with ID remove-scheduled that does not exist, removing it from the scheduler."
      )
    })

    it("the scheduled workflow should have access to the shared container", async () => {
      const wait = times(1)
      sharedContainer_.register(
        "test-value",
        asFunction(() => "test")
      )

      const spy = await createScheduled("shared-container-job", wait.next, {
        cron: "* * * * * *",
      })

      await wait.promise
      expect(spy).toHaveBeenCalledTimes(1)

      expect(spy).toHaveReturnedWith(
        expect.objectContaining({ output: { testValue: "test" } })
      )
      WorkflowManager.unregister("shared-container-job")
    })
  })
})
