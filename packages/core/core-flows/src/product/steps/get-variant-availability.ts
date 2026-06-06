import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"
import {
  ContainerRegistrationKeys,
  getVariantAvailability,
} from "@zjedene-medusa/framework/utils"

/**
 * The details required to compute the inventory availability for a list of variants in a given sales channel.
 */
export type GetVariantAvailabilityStepInput = {
  /**
   * The IDs of the variants to retrieve their availability.
   */
  variant_ids: string[]
  /**
   * The ID of the sales channel to retrieve the variant availability in.
   */
  sales_channel_id: string
}

export const getVariantAvailabilityId = "get-variant-availability"
/**
 * This step computes the inventory availability for a list of variants in a given sales channel.
 * 
 * @example
 * const data = getVariantAvailabilityStep({
 *   variant_ids: ["variant_123"],
 *   sales_channel_id: "sc_123"
 * })
 */
export const getVariantAvailabilityStep = createStep(
  getVariantAvailabilityId,
  async (data: GetVariantAvailabilityStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const availability = await getVariantAvailability(query, data)
    return new StepResponse(availability)
  }
)
