import { FilterableCustomerProps } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type CollectCustomerIdsToExportStepInput = {
  /**
   * The filters to select which customers to export.
   */
  filter?: FilterableCustomerProps
  /**
   * The number of customers to retrieve per page while collecting IDs.
   */
  batch_size?: number | string
}

export const collectCustomerIdsToExportStepId = "collect-customer-ids-to-export"

/**
 * This step resolves the IDs of the customers matching the specified filters.
 *
 * The resulting list of IDs is passed to the `customerDataExport` hook so that
 * custom modules can gather the PII slices they hold for these customers, and
 * to the {@link exportCustomersStep} so it can stream their data to a file.
 *
 * Only the IDs are loaded into memory here (not the full records), keeping this
 * step lightweight even for large customer bases.
 *
 * @example
 * const data = collectCustomerIdsToExportStep({
 *   filter: { has_account: true },
 * })
 */
export const collectCustomerIdsToExportStep = createStep(
  collectCustomerIdsToExportStepId,
  async (input: CollectCustomerIdsToExportStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const pageSize = !isNaN(parseInt(input?.batch_size as string))
      ? parseInt(input?.batch_size as string, 10)
      : 200

    const ids: string[] = []
    let page = 0

    while (true) {
      const { data: customers } = await query.graph({
        entity: "customer",
        filters: { ...input.filter },
        pagination: {
          skip: page * pageSize,
          take: pageSize,
        },
        fields: ["id"],
      })

      if (customers.length === 0) {
        break
      }

      for (const customer of customers) {
        ids.push(customer.id)
      }

      if (customers.length < pageSize) {
        break
      }

      page += 1
    }

    return new StepResponse(ids)
  }
)
