import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { WorkflowTypes } from "@medusajs/types"
import { generateProductCsvStep, getAllProductsStep } from "../steps"
import { useRemoteQueryStep } from "../../common"
import { sendNotificationsStep } from "../../notification"

export const exportProductsWorkflowId = "export-products"
export const exportProductsWorkflow = createWorkflow(
  exportProductsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.ProductWorkflow.ExportProductsDTO>
  ): WorkflowData<void> => {
    const products = getAllProductsStep(input)
    const fileKey = generateProductCsvStep(products)

    const fileDetails = useRemoteQueryStep({
      fields: ["id", "url"],
      entry_point: "file",
      variables: { id: fileKey },
      list: false,
    })

    const notifications = transform(fileDetails, (data) => {
      return [
        {
          to: "",
          channel: "feed",
          template: "admin-ui",
          data: {
            title: "Test",
            description: "Test",
            file: {
              filename: "",
              url: data.url,
              mimeType: "text/csv",
            },
          },
        },
      ]
    })

    sendNotificationsStep(notifications)
  }
)
