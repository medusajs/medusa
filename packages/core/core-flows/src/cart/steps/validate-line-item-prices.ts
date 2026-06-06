import { MedusaError, isPresent } from "@zjedene-medusa/framework/utils"
import { createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the line items to validate.
 */
export interface ValidateLineItemPricesStepInput {
  /**
   * The line items to validate.
   */
  items: {
    /**
     * The price of the line item.
     */
    unit_price?: number | null
    /**
     * The title of the line item.
     */
    title: string
  }[]
}

export const validateLineItemPricesStepId = "validate-line-item-prices"
/**
 * This step validates the specified line item objects to ensure they have prices.
 * If an item doesn't have a price, the step throws an error.
 *
 * @example
 * const data = validateLineItemPricesStep({
 *   items: [
 *     {
 *       unit_price: 10,
 *       title: "Shirt"
 *     },
 *     {
 *       title: "Pants"
 *     }
 *   ]
 * })
 */
export const validateLineItemPricesStep = createStep(
  validateLineItemPricesStepId,
  async (data: ValidateLineItemPricesStepInput, { container }) => {
    if (!data.items?.length) {
      return
    }

    const priceNotFound: string[] = []
    for (const item of data.items) {
      if (!isPresent(item?.unit_price)) {
        priceNotFound.push(item.title)
      }
    }

    if (priceNotFound.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Items ${priceNotFound.join(", ")} do not have a price`
      )
    }
  }
)
