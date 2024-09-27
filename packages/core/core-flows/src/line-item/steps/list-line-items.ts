import {
  CartLineItemDTO,
  FilterableLineItemProps,
  FindConfig,
  ICartModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface ListLineItemsStepInput {
  filters: FilterableLineItemProps
  config?: FindConfig<CartLineItemDTO>
}

export const listLineItemsStepId = "list-line-items"
/**
 * This step retrieves a list of a cart's line items
 * matching the specified filters.
 */
export const listLineItemsStep = createStep(
  listLineItemsStepId,
  async (data: ListLineItemsStepInput, { container }) => {
    const service = container.resolve<ICartModuleService>(Modules.CART)

    const items = await service.listLineItems(data.filters, data.config)

    return new StepResponse(items)
  }
)
