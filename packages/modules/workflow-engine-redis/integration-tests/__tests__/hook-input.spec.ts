import { IWorkflowEngineService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  createHook,
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import Redis from "ioredis"
import { ulid } from "ulid"
import { TestDatabase } from "../utils/database"

jest.setTimeout(20000)

const testRunId = ulid()
const SECRET = `secret-token-${testRunId}`

const receiveSecretStep = createStep("receive-secret", async () => {
  return new StepResponse({ token: SECRET })
})

const hookCalls: unknown[] = []

const defineWorkflow = (name: string, options: Record<string, unknown>) => {
  const workflow = createWorkflow({ name, ...options }, function () {
    const received = receiveSecretStep()
    const secretReceived = createHook("secretReceived", { received })
    return new WorkflowResponse(void 0, { hooks: [secretReceived] })
  })
  workflow.hooks.secretReceived((input) => {
    hookCalls.push(input)
  })
  return workflow
}

const unstoredWorkflowId = `hook-input-unstored-${testRunId}`
const storedWorkflowId = `hook-input-stored-${testRunId}`
defineWorkflow(unstoredWorkflowId, {})
defineWorkflow(storedWorkflowId, { store: true, retentionTime: 60 })

/** Whether any key in Redis holds the value, whatever the key's type */
const redisHolds = async (redis: Redis, value: string) => {
  const keys = await redis.keys("*")
  for (const key of keys) {
    const type = await redis.type(key)
    const contents =
      type === "string"
        ? [await redis.get(key)]
        : type === "hash"
          ? Object.values(await redis.hgetall(key))
          : type === "list"
            ? await redis.lrange(key, 0, -1)
            : type === "set"
              ? await redis.smembers(key)
              : type === "zset"
                ? await redis.zrange(key, 0, -1)
                : []
    if (contents.some((item) => item?.includes(value))) {
      return true
    }
  }
  return false
}

moduleIntegrationTestRunner<IWorkflowEngineService>({
  moduleName: Modules.WORKFLOW_ENGINE,
  resolve: __dirname + "/../..",
  moduleOptions: {
    redis: {
      redisUrl: "localhost:6379",
      queueName: `medusa-workflows-${
        process.env.JEST_WORKER_ID ?? "1"
      }-${testRunId}`,
      jobQueueName: `medusa-workflows-jobs-${
        process.env.JEST_WORKER_ID ?? "1"
      }-${testRunId}`,
    },
  },
  testSuite: ({ service: workflowOrcModule }) => {
    describe("A hook's input in a workflow that isn't stored", () => {
      let redis: Redis

      beforeAll(() => {
        redis = new Redis("localhost:6379")
      })

      afterAll(async () => {
        await redis.quit()
      })

      beforeEach(async () => {
        await TestDatabase.clearTables()
        hookCalls.length = 0
      })

      afterEach(async () => {
        await TestDatabase.clearTables()
      })

      it("isn't kept in the database or in Redis", async () => {
        await workflowOrcModule.run(unstoredWorkflowId, { input: {} })

        expect(hookCalls).toEqual([{ received: { token: SECRET } }])
        expect(
          await workflowOrcModule.listWorkflowExecutions({
            workflow_id: unstoredWorkflowId,
          })
        ).toEqual([])
        expect(await redisHolds(redis, SECRET)).toBe(false)
      })

      it("is kept by a stored workflow, so the check above can fail", async () => {
        await workflowOrcModule.run(storedWorkflowId, { input: {} })

        const [execution] = await workflowOrcModule.listWorkflowExecutions({
          workflow_id: storedWorkflowId,
        })
        expect(JSON.stringify(execution.context)).toContain(SECRET)
      })
    })
  },
})
