import {
  IOrderModuleService,
  UpdateOrderShippingMethodDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The order shipping methods to update.
 */
export type UpdateOrderShippingMethodsStepInput = UpdateOrderShippingMethodDTO[]

export const updateOrderShippingMethodsStepId = "update-order-shopping-methods"
/**
 * This step updates order shipping methods.
 */
export const updateOrderShippingMethodsStep = createStep(
  updateOrderShippingMethodsStepId,
  async (data: UpdateOrderShippingMethodsStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    if (!data.length) {
      return new StepResponse([], [])
    }

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data, {
      objectFields: ["metadata"],
    })
    const dataBeforeUpdate = await service.listOrderShippingMethods(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updated = await service.updateOrderShippingMethods(data)

    return new StepResponse(updated, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.updateOrderShippingMethods(dataBeforeUpdate)
  }
)
