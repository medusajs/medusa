import {
  SchedulerOptions,
  WorkflowManager,
} from "@medusajs/framework/orchestration"
import { IWorkflowEngineService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { setTimeout } from "timers/promises"
import { ulid } from "ulid"
import { TestDatabase } from "../utils"

jest.setTimeout(30000)

const INTERVAL_MS = 500
const RUN_DURATION_MS = 1800
const OBSERVATION_MS = 5000

const testRunId = ulid()

function createSlowScheduledWorkflow(
  concurrency: SchedulerOptions["concurrency"]
) {
  const name = `scheduled-concurrency-${concurrency}-${ulid()}`
  const stats = { running: 0, maxRunning: 0, started: 0 }

  const step = createStep(`${name}-step`, async () => {
    stats.started++
    stats.running++
    stats.maxRunning = Math.max(stats.maxRunning, stats.running)

    try {
      await setTimeout(RUN_DURATION_MS)
      return new StepResponse(true)
    } finally {
      stats.running--
    }
  })

  createWorkflow(
    { name, schedule: { interval: INTERVAL_MS, concurrency } },
    function () {
      step()
    }
  )

  const stop = async () => {
    WorkflowManager.unregister(name)

    while (stats.running > 0) {
      await setTimeout(100)
    }
  }

  return { stats, stop }
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
      jobWorkerOptions: { concurrency: 5 },
    },
  },
  testSuite: () => {
    describe("Scheduled workflows concurrency", function () {
      beforeEach(async () => {
        await TestDatabase.clearTables()
      })

      afterEach(async () => {
        await TestDatabase.clearTables()
      })

      it("should not overlap runs of a scheduled workflow when concurrency is forbid", async () => {
        const { stats, stop } = createSlowScheduledWorkflow("forbid")

        try {
          await setTimeout(OBSERVATION_MS)

          expect(stats.started).toBeGreaterThanOrEqual(2)
          expect(stats.maxRunning).toBe(1)
        } finally {
          await stop()
        }
      })

      it("should overlap runs of a scheduled workflow when concurrency is allow", async () => {
        const { stats, stop } = createSlowScheduledWorkflow("allow")

        try {
          await setTimeout(OBSERVATION_MS)

          expect(stats.maxRunning).toBeGreaterThan(1)
        } finally {
          await stop()
        }
      })
    })
  },
})
