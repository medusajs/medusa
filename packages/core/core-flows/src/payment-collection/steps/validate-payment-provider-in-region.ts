import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { listRegionPaymentProviderIds } from "../utils/region-payment-providers"

/**
 * The details of the payment provider to validate.
 */
export interface ValidatePaymentProviderInRegionStepInput {
  /**
   * The ID of the payment collection that the payment session is created for.
   */
  payment_collection_id: string
  /**
   * The ID of the payment provider to validate.
   */
  provider_id: string
}

export const validatePaymentProviderInRegionStepId =
  "validate-payment-provider-in-region"
/**
 * This step validates that a payment provider can be used for a payment collection.
 * If the payment collection belongs to an active (not yet completed) cart, the payment
 * provider must be enabled in the cart's region. If not, the step throws an error.
 *
 * Payment collections that aren't linked to an active cart, such as those of an order,
 * aren't affected by this validation.
 *
 * @example
 * const data = validatePaymentProviderInRegionStep({
 *   payment_collection_id: "paycol_123",
 *   provider_id: "pp_stripe_stripe"
 * })
 */
export const validatePaymentProviderInRegionStep = createStep(
  validatePaymentProviderInRegionStepId,
  async (data: ValidatePaymentProviderInRegionStepInput, { container }) => {
    const { payment_collection_id: paymentCollectionId, provider_id } = data

    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const {
      data: [paymentCollection],
    } = await query.graph({
      entity: "payment_collection",
      fields: ["cart.id", "cart.region_id", "cart.completed_at"],
      filters: { id: paymentCollectionId },
    })

    const cart = paymentCollection?.cart

    if (!cart?.region_id || cart.completed_at) {
      return new StepResponse(void 0)
    }

    const enabledProviderIds = await listRegionPaymentProviderIds(
      container,
      cart.region_id
    )

    if (!enabledProviderIds.has(provider_id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Payment provider ${provider_id} is not enabled in the cart's region ${cart.region_id}.`
      )
    }

    return new StepResponse(void 0)
  }
)
