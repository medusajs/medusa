import { join } from "path"
import { WortkflowLoader } from "../workflow-loader"
import { WorkflowManager } from "@medusajs/orchestration"
import { orderWorkflowId } from "../__fixtures__/workflows/order-notifier"
import { productWorkflowId } from "../__fixtures__/workflows/deep-workflows/product-updater"

describe("WorkflowLoader", () => {
  const rootDir = join(__dirname, "../__fixtures__", "workflows")

  beforeAll(async () => {
    await new WortkflowLoader(rootDir).load()
  })

  it("should register each workflow in the '/workflows' folder and sub folder", async () => {
    const registeredWorkflows = WorkflowManager.getWorkflows()

    expect(registeredWorkflows.size).toBe(2)
    expect(registeredWorkflows.has(orderWorkflowId)).toBe(true)
    expect(registeredWorkflows.has(productWorkflowId)).toBe(true)
  })
})
