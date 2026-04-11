import { FilterableOrderProps } from "@medusajs/framework/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { notifyOnFailureStep, sendNotificationsStep } from "../../notification"
import { exportOrdersStep } from "../steps"

/**
 * The data to export orders.
 */
export type ExportOrdersDTO = {
  /**
   * The fields to select. These fields will be passed to
   * [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query), so you can
   * pass order properties or any relation names, including custom links.
   */
  select: string[]
  /**
   * The filters to select which orders to export.
   */
  filter?: FilterableOrderProps
}

export const exportOrdersWorkflowId = "export-orders"
/**
 * This workflow exports orders matching the specified filters. It's used to
 * export orders to a CSV file.
 *
 * :::note
 *
 * This workflow doesn't return the exported orders. Instead, it sends a notification to the admin
 * users that they can download the exported orders.
 *
 * :::
 *
 * @example
 * To export all orders:
 *
 * ```ts
 * const { result } = await exportOrdersWorkflow(container)
 * .run({
 *   input: {
 *     select: ["*"],
 *   }
 * })
 * ```
 *
 * To export orders matching a criteria:
 *
 * ```ts
 * const { result } = await exportOrdersWorkflow(container)
 * .run({
 *   input: {
 *     select: ["*"],
 *     filter: {
 *       created_at: {
 *         $gte: "2024-01-01",
 *         $lte: "2024-12-31"
 *       }
 *     }
 *   }
 * })
 * ```
 *
 * To export orders within a date range:
 *
 * ```ts
 * const { result } = await exportOrdersWorkflow(container)
 * .run({
 *   input: {
 *     select: ["*"],
 *     filter: {
 *       created_at: {
 *         $gte: "2024-01-01T00:00:00Z",
 *         $lte: "2024-01-31T23:59:59Z"
 *       }
 *     }
 *   }
 * })
 * ```
 *
 * @summary
 *
 * Export orders with filtering capabilities.
 */
export const exportOrdersWorkflow = createWorkflow(
  exportOrdersWorkflowId,
  (input: WorkflowData<ExportOrdersDTO>): WorkflowData<void> => {
    const file = exportOrdersStep(input).config({
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
            title: "Order export",
            description: `Failed to export orders, please try again later.`,
          },
        },
      ]
    })
    notifyOnFailureStep(failureNotification)

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
            title: "Order export",
            description: "Order export completed successfully!",
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
