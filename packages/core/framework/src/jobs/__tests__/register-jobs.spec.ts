import {
  LocalWorkflow,
  WorkflowManager,
  WorkflowScheduler,
} from "@medusajs/orchestration"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  MedusaContextType,
} from "@medusajs/utils"
import { asValue } from "../../deps/awilix"
import { join } from "path"
import { ulid } from "ulid"
import { logger } from "../../logger"
import { MockSchedulerStorage } from "../__fixtures__/mock-scheduler-storage"
import { JobLoader } from "../job-loader"

describe("register jobs", () => {
  WorkflowScheduler.setStorage(new MockSchedulerStorage())

  beforeEach(() => {
    global.__medusaScheduledForTest = undefined
  })

  afterEach(() => {
    WorkflowManager.unregisterAll()
  })

  it("should registers jobs from plugins", async () => {
    const container = createMedusaContainer()
    container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))

    const jobLoader: JobLoader = new JobLoader(
      join(__dirname, "../__fixtures__/plugin/jobs"),
      container
    )
    await jobLoader.load()
    const workflow = WorkflowManager.getWorkflow("job-summarize-orders")
    expect(workflow).toBeDefined()
    expect(workflow?.options.schedule).toEqual({
      cron: "* * * * * *",
      numberOfExecutions: 2,
    })
  })

  it("should pass scheduledFor to the job handler", async () => {
    const container = createMedusaContainer()
    container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))

    const jobLoader: JobLoader = new JobLoader(
      join(__dirname, "../__fixtures__/plugin/jobs"),
      container
    )
    await jobLoader.load()

    const scheduledFor = "2024-06-01T12:00:00.000Z"
    expect(
      WorkflowManager.getWorkflow("job-capture-scheduled-for")
    ).toBeDefined()

    const workflow = new LocalWorkflow("job-capture-scheduled-for", container)
    const transaction = await workflow.run(
      ulid(),
      {
        scheduledFor,
      },
      {
        __type: MedusaContextType,
      }
    )

    expect(transaction.getFlow().state).toBe("done")
    expect(global.__medusaScheduledForTest).toEqual(new Date(scheduledFor))
  })

  it("should not load non js/ts files", async () => {
    const container = createMedusaContainer()
    container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))

    const jobLoader: JobLoader = new JobLoader(
      join(__dirname, "../__fixtures__/plugin/jobs-with-other-files"),
      container
    )
    await jobLoader.load()
    const workflow = WorkflowManager.getWorkflow("job-summarize-orders")
    expect(workflow).toBeUndefined()
  })
})
