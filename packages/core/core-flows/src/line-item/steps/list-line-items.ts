import {
  CartLineItemDTO,
  FilterableLineItemProps,
  FindConfig,
  ICartModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to list line items.
 */
export interface ListLineItemsStepInput {
  /**
   * The filters to select the line items.
   */
  filters: FilterableLineItemProps
  /**
   * Configurations to select the line items' fields
   * and relations, and to paginate the results.
   * 
   * Learn more in the [service factory reference](https://docs.medusajs.com/resources/service-factory-reference/methods/list).
   */
  config?: FindConfig<CartLineItemDTO>
}

export const listLineItemsStepId = "list-line-items"
/**
 * This step retrieves a list of a cart's line items
 * matching the specified filters.
 * 
 * @example
 * To retrieve the line items of a cart:
 * 
 * ```ts
 * const data = listLineItemsStep({
 *   filters: {
 *     cart_id: "cart_123"
 *   },
 *   config: {
 *     select: ["*"]
 *   }
 * })
 * ```
 * 
 * To retrieve the line items of a cart with pagination:
 * 
 * ```ts
 * const data = listLineItemsStep({
 *   filters: {
 *     cart_id: "cart_123"
 *   },
 *   config: {
 *     select: ["*"],
 *     skip: 0,
 *     take: 15
 *   }
 * })
 * ```
 * 
 * Learn more about listing items in [this service factory reference](https://docs.medusajs.com/resources/service-factory-reference/methods/list).
 */
export const listLineItemsStep = createStep(
  listLineItemsStepId,
  async (data: ListLineItemsStepInput, { container }) => {
    const service = container.resolve<ICartModuleService>(Modules.CART)

    const items = await service.listLineItems(data.filters, data.config)

    return new StepResponse(items)
  }
)
