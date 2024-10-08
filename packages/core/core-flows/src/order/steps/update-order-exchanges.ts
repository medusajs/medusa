import {
  IOrderModuleService,
  UpdateOrderExchangeDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const updateOrderExchangesStepId = "update-order-exchange"
/**
 * This step update order changes.
 */
export const updateOrderExchangesStep = createStep(
  updateOrderExchangesStepId,
  async (data: UpdateOrderExchangeDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data, {
      objectFields: ["metadata"],
    })
    const dataBeforeUpdate = await service.listOrderExchanges(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updated = await service.updateOrderExchanges(
      data.map((dt) => {
        const { id, ...rest } = dt
        return {
          selector: { id },
          data: rest,
        }
      })
    )

    return new StepResponse(updated, dataBeforeUpdate)
  },
  async (dataBeforeUpdate, { container }) => {
    if (!dataBeforeUpdate?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.updateOrderExchanges(
      dataBeforeUpdate.map((dt) => {
        const { id, ...rest } = dt
        return {
          selector: { id },
          data: rest,
        }
      })
    )
  }
)
