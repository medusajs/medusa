import {
  FilterableStockLocationProps,
  RemoteQueryFilters,
  StockLocationDTO,
  UpdateStockLocationInput,
  UpsertStockLocationAddressInput,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"

import { useQueryGraphStep } from "../../common"
import { updateStockLocationsStep } from "../steps"
import { upsertStockLocationAddressesStep } from "../steps/upsert-stock-location-addresses"

/**
 * The data to update the stock locations.
 */
export interface UpdateStockLocationsWorkflowInput {
  /**
   * The filters to select the stock locations to update.
   */
  selector: FilterableStockLocationProps
  /**
   * The data to update the stock locations with.
   */
  update: UpdateStockLocationInput
}
export const updateStockLocationsWorkflowId = "update-stock-locations-workflow"
/**
 * This workflow updates stock locations matching the specified filters. It's used by the
 * [Update Stock Location Admin API Route](https://docs.medusajs.com/api/admin/stock-locations/update-a-stock-location).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to update stock locations in your custom flows.
 *
 * @example
 * const { result } = await updateStockLocationsWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "sloc_123"
 *     },
 *     update: {
 *       name: "European Warehouse"
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update stock locations.
 */
export const updateStockLocationsWorkflow = createWorkflow(
  updateStockLocationsWorkflowId,
  (
    input: WorkflowData<UpdateStockLocationsWorkflowInput>
  ): WorkflowResponse<StockLocationDTO[]> => {
    const stockLocationsQuery = useQueryGraphStep({
      entity: "stock_location",
      filters: input.selector as RemoteQueryFilters<"stock_location">,
      fields: ["id", "address.id"],
    }).config({ name: "get-stock-location" })

    const stockLocations = transform(
      { stockLocationsQuery },
      ({ stockLocationsQuery }) => stockLocationsQuery.data
    )

    const normalizedData = transform(
      { input, stockLocations },
      ({ input, stockLocations }) => {
        const { address, address_id, ...stockLocationInput } = input.update
        const addressesInput: UpsertStockLocationAddressInput[] = []

        if (address) {
          for (const stockLocation of stockLocations) {
            if (stockLocation.address?.id) {
              addressesInput.push({
                id: stockLocation.address?.id!,
                ...address,
              })
            } else {
              addressesInput.push(address)
            }
          }
        }

        return {
          stockLocationInput: {
            selector: input.selector,
            update: stockLocationInput,
          },
          addressesInput,
        }
      }
    )

    upsertStockLocationAddressesStep(normalizedData.addressesInput)

    return new WorkflowResponse(
      updateStockLocationsStep(normalizedData.stockLocationInput)
    )
  }
)
