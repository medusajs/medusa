import { createStep } from "@zjedene-medusa/framework/workflows-sdk"
import type { PromotionDTO } from "@zjedene-medusa/framework/types"
import { throwIfCodesAreMissing } from "../utils/validation"

export const validatePromoCodesToRemoveId = "validate-promo-codes-to-remove"

/**
 * The details of the promo codes removal to validate.
 */
export interface ValidatePromoCodesToRemoveStepInput {
  /**
   * The promo codes to remove from the draft order.
   */
  promo_codes: string[]
  /**
   * The promotions to remove from the draft order.
   */
  promotions: PromotionDTO[]
}

/**
 * This step validates that the promo codes can be removed from a draft order. It throws an error if the promo
 * codes don't exist.
 *
 * :::note
 *
 * You can retrieve a promotion's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = validatePromoCodesToRemoveStep({
 *   promo_codes: ["PROMO_123", "PROMO_456"],
 *   promotions: [{
 *     id: "promo_123",
 *     code: "PROMO_123"
 *   }, {
 *     id: "promo_456",
 *     code: "PROMO_456"
 *   }],
 * })
 */
export const validatePromoCodesToRemoveStep = createStep(
  validatePromoCodesToRemoveId,
  async function (input: ValidatePromoCodesToRemoveStepInput) {
    const { promo_codes, promotions } = input

    throwIfCodesAreMissing(promo_codes, promotions)
  }
)
