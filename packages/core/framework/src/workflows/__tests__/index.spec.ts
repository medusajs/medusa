import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  Modules,
} from "@medusajs/utils"
import { join } from "path"
import { asValue } from "../../deps/awilix"
import { logger } from "../../logger"
import { productWorkflowId } from "../__fixtures__/workflows/deep-workflows/product-updater"
import { orderWorkflowId } from "../__fixtures__/workflows/order-notifier"
import { WorkflowLoader } from "../workflow-loader"

// The index-file workflow fixture is not imported here, so the test proves the
// loader discovers `index.ts` files itself.
const indexFileWorkflowId = "index-file-workflow"

describe("WorkflowLoader", () => {
  const rootDir = join(__dirname, "../__fixtures__", "workflows")
  const registered = new Set<string>()

  beforeAll(async () => {
    const container = createMedusaContainer()
    container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))
    container.register(
      Modules.WORKFLOW_ENGINE,
      asValue({
        registerWorkflows: async (workflows: any[]) => {
          for (const workflow of workflows) {
            registered.add(workflow.getName())
          }
        },
      })
    )

    await new WorkflowLoader(rootDir, container).load()
  })

  it("should register each workflow in the '/workflows' folder and sub folder, including index files", async () => {
    expect(registered.size).toBe(3)
    expect(registered.has(orderWorkflowId)).toBe(true)
    expect(registered.has(productWorkflowId)).toBe(true)
    expect(registered.has(indexFileWorkflowId)).toBe(true)
  })
})
