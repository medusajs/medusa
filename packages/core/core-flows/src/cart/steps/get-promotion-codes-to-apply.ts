import {
  ContainerRegistrationKeys,
  MedusaError,
  PromotionActions,
} from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the promotion codes to apply on a cart.
 */
export interface GetPromotionCodesToApplyStepInput {
  /**
   * The cart containing items and shipping methods.
   */
  cart: {
    /**
     * The cart's items and the promotion adjustments applied to them.
     */
    items?: { adjustments?: { code?: string }[] }[]
    /**
     * The cart's shipping methods and the promotion adjustments applied to them.
     */
    shipping_methods?: { adjustments?: { code?: string }[] }[]
  }
  /**
   * the promotion codes to be applied to the cart.
   */
  promo_codes?: string[]
  /**
   * Whether to add, remove, or replace promotion codes.
   */
  action?:
    | PromotionActions.ADD
    | PromotionActions.REMOVE
    | PromotionActions.REPLACE
}

/**
 * The promotion codes to apply on the cart.
 *
 * @example ["PRO10", "SHIPFREE", "NEWYEAR20"]
 */
export type GetPromotionCodesToApplyStepOutput = string[]

export const getPromotionCodesToApplyId = "get-promotion-codes-to-apply"
/**
 * This step retrieves the promotion codes to apply on a cart.
 *
 * @example
 * const data = getPromotionCodesToApply(
 *   {
 *     cart: {
 *       items: [
 *         {
 *           adjustments: [{ code: "PROMO10" }]
 *         }
 *       ],
 *       shipping_methods: [
 *         {
 *           adjustments: [{ code: "SHIPFREE" }]
 *         }
 *       ]
 *     },
 *     promo_codes: ["NEWYEAR20"],
 *     action: PromotionActions.ADD
 *   },
 * )
 */
export const getPromotionCodesToApply = createStep(
  getPromotionCodesToApplyId,
  async (data: GetPromotionCodesToApplyStepInput, { container }) => {
    const { promo_codes = [], cart, action = PromotionActions.ADD } = data
    const { items = [], shipping_methods = [] } = cart

    const adjustmentCodes: string[] = []
    items.concat(shipping_methods).forEach((object) => {
      object.adjustments?.forEach((adjustment) => {
        if (adjustment.code) {
          adjustmentCodes.push(adjustment.code)
        }
      })
    })

    const promotionCodesToApply: Set<string> = new Set(adjustmentCodes)

    if (action === PromotionActions.REMOVE) {
      promo_codes.forEach((code) => promotionCodesToApply.delete(code))
    }

    if (action === PromotionActions.REPLACE) {
      promotionCodesToApply.clear()
    }

    if (
      action === PromotionActions.ADD ||
      action === PromotionActions.REPLACE
    ) {
      const query = container.resolve(ContainerRegistrationKeys.QUERY)
      const validPromoCodes: Set<string> = new Set(
        promo_codes.length
          ? (
              await query.graph(
                {
                  entity: "promotion",
                  fields: ["id", "code"],
                  filters: { code: promo_codes },
                },
                {
                  cache: {
                    enable: true,
                  },
                }
              )
            ).data.map((p) => p.code!)
          : []
      )

      promo_codes.forEach((code) => {
        if (!validPromoCodes.has(code)) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `The promotion code ${code} is invalid`
          )
        }
        promotionCodesToApply.add(code)
      })
    }

    return new StepResponse(
      Array.from(promotionCodesToApply) as GetPromotionCodesToApplyStepOutput
    )
  }
)
