import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { WorkflowTypes } from "@medusajs/types"
import { sendNotificationsStep } from "../../notification"

export const importProductsWorkflowId = "import-products"
export const importProductsWorkflow = createWorkflow(
  importProductsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.ProductWorkflow.ImportProductsDTO>
  ): WorkflowData<void> => {
    // validateImportCsvStep(input.fileContent)

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
