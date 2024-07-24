import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { WorkflowTypes } from "@medusajs/types"
import { sendNotificationsStep } from "../../notification"
import { groupProductsForBatchStep, parseProductCsvStep } from "../steps"
import { batchProductsWorkflow } from "./batch-products"

export const importProductsWorkflowId = "import-products"
export const importProductsWorkflow = createWorkflow(
  importProductsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.ProductWorkflow.ImportProductsDTO>
  ): WorkflowData<void> => {
    const products = parseProductCsvStep(input.fileContent)
    const batchRequest = groupProductsForBatchStep(products)

    // TODO: Add async confirmation step here

    batchProductsWorkflow.runAsStep({ input: batchRequest })

    const notifications = transform({ input }, (data) => {
      return [
        {
          // We don't need the recipient here for now, but if we want to push feed notifications to a specific user we could add it.
          to: "",
          channel: "feed",
          template: "admin-ui",
          data: {
            title: "Product import",
            description: `Product import of file ${data.input.filename} completed successfully!`,
          },
        },
      ]
    })

    sendNotificationsStep(notifications)
  }
)
