import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import type { WorkflowTypes } from "@medusajs/framework/types"
import { exportProductsStep } from "../steps"
import { useQueryGraphStep } from "../../common"
import { notifyOnFailureStep, sendNotificationsStep } from "../../notification"

export const exportProductsWorkflowId = "export-products"
/**
 * This workflow exports products matching the specified filters. It's used by the
 * [Export Products Admin API Route](https://docs.medusajs.com/api/admin#products_postproductsexport).
 *
 * :::note
 *
 * This workflow doesn't return the exported products. Instead, it sends a notification to the admin
 * users that they can download the exported products. Learn more in the [API Reference](https://docs.medusajs.com/api/admin#products_postproductsexport).
 *
 * :::
 *
 * @example
 * To export all products:
 *
 * ```ts
 * const { result } = await exportProductsWorkflow(container)
 * .run({
 *   input: {
 *     select: ["*"],
 *   }
 * })
 * ```
 *
 * To export products matching a criteria:
 *
 * ```ts
 * const { result } = await exportProductsWorkflow(container)
 * .run({
 *   input: {
 *     select: ["*"],
 *     filter: {
 *       collection_id: "pcol_123"
 *     }
 *   }
 * })
 * ```
 *
 * @summary
 *
 * Export products with filtering capabilities.
 */
export const exportProductsWorkflow = createWorkflow(
  exportProductsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.ProductWorkflow.ExportProductsDTO>
  ): WorkflowData<void> => {
    const file = exportProductsStep(input).config({
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

    const { data: fileDetails } = useQueryGraphStep({
      entity: "file",
      fields: ["id", "url"],
      filters: { id: file.id },
      options: { isList: false },
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
