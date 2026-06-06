import {
  FindConfig,
  IFulfillmentModuleService,
  ShippingOptionDTO,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to retrieve the list of shipping options.
 */
export interface ListShippingOptionsForContextStepInput {
  /**
   * The context of retrieving the shipping options. This context
   * will be compared against shipping options' rules. The key
   * of the context is a name of an attribute, and the value is
   * the attribute's value. Shipping options that have rules
   * matching this context are retrieved.
   */
  context: Record<string, unknown>
  /**
   * The fields and relations to select in the returned shipping options,
   * along with pagination and sorting options.
   * 
   * Learn more in the [service factory reference](https://docs.medusajs.com/resources/service-factory-reference/methods/list).
   */
  config?: FindConfig<ShippingOptionDTO>
}

export const listShippingOptionsForContextStepId =
  "list-shipping-options-for-context"
/**
 * This step retrieves shipping options that can be used in the specified context, based on
 * the shipping options' rules.
 * 
 * @example
 * To retrieve shipping options matching a context:
 * 
 * ```ts
 * const data = listShippingOptionsForContextStep({
 *   context: {
 *     region_id: "reg_123"
 *   }
 * })
 * ```
 * 
 * To retrieve shipping options matching a context with pagination:
 * 
 * ```ts
 * const data = listShippingOptionsForContextStep({
 *   context: {
 *     region_id: "reg_123"
 *   },
 *   config: {
 *     skip: 0,
 *     take: 10
 *   }
 * })
 * ```
 * 
 * Learn more about paginating records and selecting fields in the 
 * [service factory reference](https://docs.medusajs.com/resources/service-factory-reference/methods/list).
 */
export const listShippingOptionsForContextStep = createStep(
  listShippingOptionsForContextStepId,
  async (data: ListShippingOptionsForContextStepInput, { container }) => {
    const fulfillmentService = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const shippingOptions =
      await fulfillmentService.listShippingOptionsForContext(
        data.context,
        data.config
      )

    return new StepResponse(shippingOptions)
  }
)
