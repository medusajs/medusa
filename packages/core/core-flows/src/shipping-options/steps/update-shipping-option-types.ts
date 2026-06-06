import type {
  FulfillmentTypes,
  IFulfillmentModuleService,
} from "@zjedene-medusa/framework/types"
import {
  getSelectsAndRelationsFromObjectArray,
  Modules,
} from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to identify and update the shipping option types.
 */
export type UpdateShippingOptionTypesStepInput = {
  /**
   * The filters to select the shipping option types to update.
   */
  selector: FulfillmentTypes.FilterableShippingOptionTypeProps
  /**
   * The data to update the shipping option types with.
   */
  update: FulfillmentTypes.UpdateShippingOptionTypeDTO
}

export const updateShippingOptionTypesStepId = "update-shipping-option-types"
/**
 * This step updates shipping option types matching the specified filters.
 *
 * @since 2.10.0
 *
 * @example
 * const shippingOptionTypes = updateShippingOptionTypesStep({
 *   selector: {
 *     id: "sotype_123"
 *   },
 *   update: {
 *     label: "Standard"
 *   }
 * })
 */
export const updateShippingOptionTypesStep = createStep(
  updateShippingOptionTypesStepId,
  async (data: UpdateShippingOptionTypesStepInput, { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listShippingOptionTypes(data.selector, {
      select: selects,
      relations,
    })

    const shippingOptionTypes = await service.updateShippingOptionTypes(
      data.selector,
      data.update
    )
    return new StepResponse(shippingOptionTypes, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    await service.upsertShippingOptionTypes(prevData)
  }
)
