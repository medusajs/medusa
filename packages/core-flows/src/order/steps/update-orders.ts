import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FilterableOrderProps,
  IOrderModuleService,
  UpdateOrderDTO,
} from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateOrdersStepInput = {
  selector: FilterableOrderProps
  update: UpdateOrderDTO
}

export const updateOrdersStepId = "update-orders"
export const updateOrdersStep = createStep(
  updateOrdersStepId,
  async (data: UpdateOrdersStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.STORE
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.list(data.selector, {
      select: selects,
      relations,
    })

    const orders = await service.update(data.selector, data.update)
    return new StepResponse(orders, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.STORE
    )

    await service.upsert(
      prevData.map((r) => ({
        ...r,
        metadata: r.metadata || undefined,
      }))
    )
  }
)
