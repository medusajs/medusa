import {
  IOrderModuleService,
  UpdateOrderShippingMethodDTO,
} from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateOrderShippingMethodsStepId = "update-order-shopping-methods"
export const updateOrderShippingMethodsStep = createStep(
  updateOrderShippingMethodsStepId,
  async (data: UpdateOrderShippingMethodDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data, {
      objectFields: ["metadata"],
    })
    const dataBeforeUpdate = await service.listShippingMethods(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updated = await service.updateShippingMethods(data)

    return new StepResponse(updated, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.updateShippingMethods(dataBeforeUpdate)
  }
)
