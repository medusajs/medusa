import type { WorkflowTypes } from "@medusajs/framework/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { notifyOnFailureStep, sendNotificationsStep } from "../../notification"
import { exportInventoryItemsStep } from "../steps/export-inventory-items"

export const exportInventoryItemsWorkflowId = "export-inventory-items"
/**
 * This workflow exports inventory items matching the specified filters. The exported
 * CSV file includes the inventory levels of each item per stock location. It's used by the
 * [Export Inventory Items Admin API Route](https://docs.medusajs.com/api/admin/inventory-items/export-inventory-items).
 *
 * :::note
 *
 * This workflow doesn't return the exported inventory items. Instead, it sends a notification to the admin
 * users that they can download the exported inventory items. Learn more in the [API Reference](https://docs.medusajs.com/api/admin/inventory-items/export-inventory-items).
 *
 * :::
 *
 * @example
 * To export all inventory items:
 *
 * ```ts
 * const { result } = await exportInventoryItemsWorkflow(container)
 * .run({
 *   input: {
 *     select: ["*"],
 *   }
 * })
 * ```
 *
 * To export inventory items matching a criteria:
 *
 * ```ts
 * const { result } = await exportInventoryItemsWorkflow(container)
 * .run({
 *   input: {
 *     select: ["*"],
 *     filter: {
 *       sku: "SHIRT"
 *     }
 *   }
 * })
 * ```
 *
 * @summary
 *
 * Export inventory items with filtering capabilities.
 */
export const exportInventoryItemsWorkflow = createWorkflow(
  exportInventoryItemsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.InventoryWorkflow.ExportInventoryItemsDTO>
  ): WorkflowData<void> => {
    const file = exportInventoryItemsStep(input).config({
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
            title: "Inventory export",
            description: `Failed to export inventory items, please try again later.`,
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
            title: "Inventory export",
            description: "Inventory export completed successfully!",
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
