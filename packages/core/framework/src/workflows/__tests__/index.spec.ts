import { WorkflowManager } from "@medusajs/orchestration"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
} from "@medusajs/utils"
import { asValue } from "../../deps/awilix"
import { join } from "path"
import { logger } from "../../logger"
import { productWorkflowId } from "../__fixtures__/workflows/deep-workflows/product-updater"
import { indexWorkflowId } from "../__fixtures__/workflows/index-workflow"
import { orderWorkflowId } from "../__fixtures__/workflows/order-notifier"
import { WorkflowLoader } from "../workflow-loader"

describe("WorkflowLoader", () => {
  const rootDir = join(__dirname, "../__fixtures__", "workflows")

  beforeAll(async () => {
    // Start from a clean registry so the assertions below are not affected by
    // workflows registered in other test files.
    WorkflowManager.unregisterAll()

    const container = createMedusaContainer()
    container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))

    await new WorkflowLoader(rootDir, container).load()
  })

  afterAll(() => {
    WorkflowManager.unregisterAll()
  })

  it("should register each workflow in the '/workflows' folder and sub folder", async () => {
    const registeredWorkflows = WorkflowManager.getWorkflows()

    expect(registeredWorkflows.size).toBe(3)
    expect(registeredWorkflows.has(orderWorkflowId)).toBe(true)
    expect(registeredWorkflows.has(productWorkflowId)).toBe(true)
  })

  it("should register a workflow defined in an index.[js,ts] file", async () => {
    const registeredWorkflows = WorkflowManager.getWorkflows()

    expect(registeredWorkflows.has(indexWorkflowId)).toBe(true)
  })
})
