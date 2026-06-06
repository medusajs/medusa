import type {
  FulfillmentTypes,
  IFulfillmentModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The shipping option types to create.
 */
export type CreateShippingOptionTypesStepInput =
  FulfillmentTypes.CreateShippingOptionTypeDTO[]

export const createShippingOptionTypesStepId = "create-shipping-option-types"
/**
 * This step creates one or more shipping option types.
 *
 * @since 2.10.0
 *
 * @example
 * const shippingOptionTypes = createShippingOptionTypesStep([
 *   {
 *     label: "Standard",
 *     code: "standard",
 *     description: "Ship in 2-3 days."
 *   }
 * ])
 */
export const createShippingOptionTypesStep = createStep(
  createShippingOptionTypesStepId,
  async (data: CreateShippingOptionTypesStepInput, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const created = await service.createShippingOptionTypes(data)
    return new StepResponse(
      created,
      created.map((shippingOptionType) => shippingOptionType.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    await service.deleteShippingOptionTypes(createdIds)
  }
)
