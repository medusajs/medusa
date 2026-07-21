import { FilterableCustomerProps } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { notifyOnFailureStep, sendNotificationsStep } from "../../notification"
import {
  collectCustomerIdsToExportStep,
  exportCustomersStep,
} from "../steps"

/**
 * The data to export customers.
 */
export type ExportCustomersDTO = {
  /**
   * The fields to select. These fields are passed to
   * [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query), so you can
   * pass customer properties or any relation/link names, including custom links.
   */
  select: string[]
  /**
   * The filters to select which customers to export.
   */
  filter?: FilterableCustomerProps
  /**
   * The batch size to use when querying customers.
   */
  batch_size?: number | string
  /**
   * The format of the exported file. Defaults to `json`, which is best suited
   * for GDPR subject-access requests as it captures nested, cross-module data
   * without loss. Use `csv` for a flattened, spreadsheet-friendly export.
   */
  format?: "csv" | "json"
}

/**
 * The data contributed by the `customerDataExport` hook, keyed by customer ID.
 * Each value is an object whose keys are arbitrary section names (for example
 * `reviews`, `warranties`, or `feedback`) contributed by custom modules.
 */
export type CustomerDataExportHookResult = Record<
  string,
  Record<string, unknown>
>

export const exportCustomersWorkflowId = "export-customers"

/**
 * This workflow exports the data of customers matching the specified filters
 * into a file, and notifies the admin user of the result. It's used to satisfy
 * data subject access requests (for example, GDPR Article 15).
 *
 * The workflow is symmetric with {@link exportOrdersWorkflow} and
 * {@link exportProductsWorkflow}: it runs in the background and returns a transaction
 * ID that can be used to track its progress. When it finishes, a feed
 * notification with a link to the exported file is created.
 *
 * :::note
 *
 * A real store's personal data inevitably spreads across custom modules
 * (reviews, feedback, warranty claims, affiliate data, and so on). This
 * workflow exposes a `customerDataExport` hook that custom modules can consume
 * to contribute their PII slices to the export. Learn more in the
 * [Data Export recipe](https://docs.medusajs.com/resources/recipes/data-export).
 *
 * :::
 *
 * @example
 * const { transaction } = await exportCustomersWorkflow(container).run({
 *   input: {
 *     select: ["addresses.*", "orders.*"],
 *     filter: { id: "cus_123" },
 *     format: "json",
 *   },
 * })
 *
 * @param input - The data to export customers.
 *
 * @property hooks.customerDataExport - This hook is executed before the export
 * file is generated. You can consume it to contribute the PII slices your
 * custom modules hold for the exported customers. Return an object keyed by
 * customer ID, where each value is an object of named sections to include in
 * the export.
 * 
 * For example, a reviews module could contribute the reviews of the exported
 * customers like this:
 * 
 * import { exportCustomersWorkflow } from "@medusajs/medusa/core-flows"
 * import { MedusaModule } from "@medusajs/framework/modules-sdk"
 *
 * exportCustomersWorkflow.hooks.customerDataExport(
 *   async ({ customer_ids }, { container }) => {
 *     const query = container.resolve("query")
 *     const { data: reviews } = await query.graph({
 *       entity: "review",
 *       fields: ["id", "rating", "content", "customer_id"],
 *       filters: { customer_id: customer_ids },
 *     })
 *
 *     const bySlice: Record<string, Record<string, unknown>> = {}
 *     for (const review of reviews) {
 *       bySlice[review.customer_id] ??= { reviews: [] }
 *       ;(bySlice[review.customer_id].reviews as unknown[]).push(review)
 *     }
 *
 *     return new StepResponse(bySlice)
 *   }
 * )
 */
export const exportCustomersWorkflow = createWorkflow(
  exportCustomersWorkflowId,
  (input: WorkflowData<ExportCustomersDTO>) => {
    // Register the failure notification first so its compensation runs if any
    // subsequent step (or the workflow as a whole) fails.
    const failureNotification = transform({ input }, () => {
      return [
        {
          to: "",
          channel: "feed",
          template: "admin-ui",
          data: {
            title: "Customer export",
            description: `Failed to export customers, please try again later.`,
          },
        },
      ]
    })
    notifyOnFailureStep(failureNotification)

    // Resolve the IDs of the customers to export in the background. Making this
    // step async + backgroundExecution allows the request to return a
    // transaction ID immediately while the rest of the workflow runs.
    const customerIds = collectCustomerIdsToExportStep({
      filter: input.filter,
      batch_size: input.batch_size,
    }).config({
      async: true,
      backgroundExecution: true,
    })

    // Allow custom modules to contribute the PII slices they hold for the
    // exported customers. This is the extension point that makes a complete
    // GDPR subject-access export possible across a store's custom modules.
    const customerDataExport = createHook("customerDataExport", {
      customer_ids: customerIds,
      filter: input.filter,
    })
    const additionalData = customerDataExport.getResult()

    const exportInput = transform(
      { input, customerIds, additionalData },
      (data) => {
        return {
          select: data.input.select ?? [],
          format: data.input.format,
          batch_size: data.input.batch_size,
          customer_ids: data.customerIds,
          additional_data: (data.additionalData ??
            {}) as CustomerDataExportHookResult,
        }
      }
    )

    const file = exportCustomersStep(exportInput)

    const { data: fileDetails } = useQueryGraphStep({
      entity: "file",
      fields: ["id", "url"],
      filters: { id: file.id },
      options: { isList: false },
    })

    const notifications = transform(
      { fileDetails, file, input },
      (data) => {
        return [
          {
            to: "",
            channel: "feed",
            template: "admin-ui",
            data: {
              title: "Customer export",
              description: "Customer export completed successfully!",
              file: {
                filename: data.file.filename,
                url: data.fileDetails.url,
                mimeType:
                  data.input.format === "csv"
                    ? "text/csv"
                    : "application/json",
              },
            },
          },
        ]
      }
    )

    sendNotificationsStep(notifications)

    return new WorkflowResponse(file, {
      hooks: [customerDataExport] as const,
    })
  }
)
