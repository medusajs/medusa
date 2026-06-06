import {
  FilterableOrderProps,
  IOrderModuleService,
  UpdateOrderDTO,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of updating the orders.
 */
export type UpdateOrdersStepInput = {
  /**
   * The filters to select the orders to update.
   */
  selector: FilterableOrderProps
  /**
   * The data to update in the orders.
   */
  update: UpdateOrderDTO // TODO: Update to UpdateOrderDTO[]
}

export const updateOrdersStepId = "update-orders"
/**
 * This step updates orders matching the specified filters.
 * 
 * @example
 * const data = updateOrdersStep({
 *   selector: {
 *     id: "order_123"
 *   },
 *   update: {
 *     region_id: "region_123"
 *   }
 * })
 */
export const updateOrdersStep = createStep(
  updateOrdersStepId,
  async (data: UpdateOrdersStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listOrders(data.selector, {
      select: selects,
      relations,
    })

    const orders = await service.updateOrders(data.selector, data.update)

    return new StepResponse(orders, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.updateOrders(prevData as UpdateOrderDTO[])
  }
)
