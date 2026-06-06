import {
  ICartModuleService,
  UpdateShippingMethodDTO,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the shipping methods to update.
 */
export type UpdateShippingMethodsStepInput = UpdateShippingMethodDTO[]

export const updateShippingMethodsStepId = "update-shipping-methods-step"
/**
 * This step updates a cart's shipping methods.
 * 
 * @example
 * const data = updateOrderShippingMethodsStep([
 *   {
 *     id: "sm_123",
 *     amount: 10
 *   }
 * ])
 */
export const updateShippingMethodsStep = createStep(
  updateShippingMethodsStepId,
  async (data: UpdateShippingMethodsStepInput, { container }) => {
    if (!data?.length) {
      return new StepResponse([], [])
    }

    const cartModule = container.resolve<ICartModuleService>(Modules.CART)
    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)

    const dataBeforeUpdate = await cartModule.listShippingMethods(
      { id: data.map((d) => d.id!) },
      { select: selects, relations }
    )

    const updatedItems = await cartModule.updateShippingMethods(data)

    return new StepResponse(updatedItems, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate?.length) {
      return
    }

    const cartModule: ICartModuleService = container.resolve(Modules.CART)

    await cartModule.updateShippingMethods(dataBeforeUpdate)
  }
)
