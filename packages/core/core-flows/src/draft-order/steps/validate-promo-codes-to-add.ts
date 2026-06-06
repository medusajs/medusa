import { createStep } from "@zjedene-medusa/framework/workflows-sdk"
import type { PromotionDTO } from "@zjedene-medusa/framework/types"
import {
  throwIfCodesAreInactive,
  throwIfCodesAreMissing,
} from "../utils/validation"

export const validatePromoCodesToAddId = "validate-promo-codes-to-add"

/**
 * The details of the promo codes to add to a draft order.
 */
export interface ValidatePromoCodesToAddStepInput {
  /**
   * The promo codes to add to the draft order.
   */
  promo_codes: string[]
  /**
   * The promotions to add to the draft order.
   */
  promotions: PromotionDTO[]
}

/**
 * This step validates that the promo codes to add to a draft order are valid. It throws an error if the
 * promo codes don't exist or are inactive.
 *
 * :::note
 *
 * You can retrieve a promotion's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = validatePromoCodesToAddStep({
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
export const validatePromoCodesToAddStep = createStep(
  validatePromoCodesToAddId,
  async function (input: ValidatePromoCodesToAddStepInput) {
    const { promo_codes, promotions } = input

    throwIfCodesAreMissing(promo_codes, promotions)
    throwIfCodesAreInactive(promo_codes, promotions)
  }
)
