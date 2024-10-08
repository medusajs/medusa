import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { WorkflowTypes } from "@medusajs/framework/types"
import { generateProductCsvStep, getAllProductsStep } from "../steps"
import { useRemoteQueryStep } from "../../common"
import { notifyOnFailureStep, sendNotificationsStep } from "../../notification"

export const exportProductsWorkflowId = "export-products"
/**
 * This workflow exports products matching the specified filters.
 */
export const exportProductsWorkflow = createWorkflow(
  exportProductsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.ProductWorkflow.ExportProductsDTO>
  ): WorkflowData<void> => {
    const products = getAllProductsStep(input).config({
      async: true,
      backgroundExecution: true,
    })

    const failureNotification = transform({ input }, (data) => {
      return [
        {
          // We don't need the recipient here for now, but if we want to push feed notifications to a specific user we could add it.
          to: "",
          channel: "feed",
          template: "admin-ui",
          data: {
            title: "Product export",
            description: `Failed to export products, please try again later.`,
          },
        },
      ]
    })
    notifyOnFailureStep(failureNotification)

    const file = generateProductCsvStep(products)
    const fileDetails = useRemoteQueryStep({
      fields: ["id", "url"],
      entry_point: "file",
      variables: { id: file.id },
      list: false,
    })

    const notifications = transform({ fileDetails, file }, (data) => {
      return [
        {
          // We don't need the recipient here for now, but if we want to push feed notifications to a specific user we could add it.
          to: "",
          channel: "feed",
          template: "admin-ui",
          data: {
            title: "Product export",
            description: "Product export completed successfully!",
            file: {
              filename: data.file.filename,
              url: data.fileDetails.url,
              mimeType: "text/csv",
            },
          },
        },
      ]
    })

    sendNotificationsStep(notifications)
  }
)
