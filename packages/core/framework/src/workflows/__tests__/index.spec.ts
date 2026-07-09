import { WorkflowManager } from "@medusajs/orchestration"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
} from "@medusajs/utils"
import { asValue } from "../../deps/awilix"
import { join } from "path"
import { logger } from "../../logger"
import { productWorkflowId } from "../__fixtures__/workflows/deep-workflows/product-updater"
import { orderWorkflowId } from "../__fixtures__/workflows/order-notifier"
import { WorkflowLoader } from "../workflow-loader"

// NOTE: the index-file workflow fixture is intentionally NOT imported here.
// Workflows self-register on module evaluation, so importing the fixture would
// register it regardless of the loader. Referencing the id as a literal proves
// the workflow is only registered when the loader discovers its `index.ts`.
const indexFileWorkflowId = "index-file-workflow"

describe("WorkflowLoader", () => {
  const rootDir = join(__dirname, "../__fixtures__", "workflows")

  beforeAll(async () => {
    const container = createMedusaContainer()
    container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))

    await new WorkflowLoader(rootDir, container).load()
  })

  it("should register each workflow in the '/workflows' folder and sub folder, including index files", async () => {
    const registeredWorkflows = WorkflowManager.getWorkflows()

    expect(registeredWorkflows.size).toBe(3)
    expect(registeredWorkflows.has(orderWorkflowId)).toBe(true)
    expect(registeredWorkflows.has(productWorkflowId)).toBe(true)
    // A workflow defined in an `index.[js,ts]` file must also be registered.
    expect(registeredWorkflows.has(indexFileWorkflowId)).toBe(true)
  })
})
