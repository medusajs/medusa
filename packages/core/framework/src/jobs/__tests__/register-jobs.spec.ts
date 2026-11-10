import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  Modules,
} from "@medusajs/utils"
import { getWorkflowDefinition } from "@medusajs/workflows-sdk"
import { createEngine } from "@medusajs/workflow-engine"
import { join } from "path"
import { asValue } from "../../deps/awilix"
import { logger } from "../../logger"
import { JobLoader } from "../job-loader"

function setup() {
  const workflows = new Map<string, any>()
  const container = createMedusaContainer()
  container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))
  container.register(
    Modules.WORKFLOW_ENGINE,
    asValue({
      registerWorkflows: async (registered: any[]) => {
        for (const workflow of registered) {
          workflows.set(workflow.getName(), workflow)
        }
      },
    })
  )
  return { container, workflows }
}

describe("register jobs", () => {
  beforeEach(() => {
    global.__medusaScheduledForTest = undefined
  })

  it("should registers jobs from plugins", async () => {
    const { container, workflows } = setup()

    await new JobLoader(
      join(__dirname, "../__fixtures__/plugin/jobs"),
      container
    ).load()

    const workflow = workflows.get("job-summarize-orders")
    expect(workflow).toBeDefined()
    expect(getWorkflowDefinition(workflow).options.schedule).toEqual(
      expect.objectContaining({
        cron: "* * * * * *",
        numberOfExecutions: 2,
      })
    )
  })

  it("should pass scheduledFor to the job handler", async () => {
    const { container, workflows } = setup()

    await new JobLoader(
      join(__dirname, "../__fixtures__/plugin/jobs"),
      container
    ).load()

    const scheduledFor = "2024-06-01T12:00:00.000Z"
    const workflow = workflows.get("job-capture-scheduled-for")
    expect(workflow).toBeDefined()

    const engine = createEngine({ autoBoot: false })
    engine.register(getWorkflowDefinition(workflow))
    const handle = await engine.start({
      workflowId: "job-capture-scheduled-for",
      input: { scheduledFor },
      locals: { container },
    })

    expect(handle.status).toBe("succeeded")
    expect(global.__medusaScheduledForTest).toEqual(new Date(scheduledFor))
  })

  it("should not load non js/ts files", async () => {
    const { container, workflows } = setup()

    await new JobLoader(
      join(__dirname, "../__fixtures__/plugin/jobs-with-other-files"),
      container
    ).load()

    expect(workflows.get("job-summarize-orders")).toBeUndefined()
  })
})
