import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CartDTO,
  FilterableCartProps,
  ICartModuleService,
  UpdateCartDataDTO,
} from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateCartsStepInput = {
  selector: FilterableCartProps
  update: UpdateCartDataDTO
}

export const updateCartsStepId = "update-carts"
export const updateCartsStep = createStep(
  updateCartsStepId,
  async (data: UpdateCartsStepInput, { container }) => {
    const service = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevCarts = await service.list(data.selector, {
      select: selects,
      relations,
    })

    const updatedCarts = await service.update(
      data.selector as Partial<CartDTO>,
      data.update
    )

    return new StepResponse(updatedCarts, prevCarts)
  },
  async (previousCarts, { container }) => {
    if (!previousCarts?.length) {
      return
    }

    const service = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const toRestore = previousCarts.map((c) => ({
      id: c.id,
      region_id: c.region_id,
      customer_id: c.customer_id,
      sales_channel_id: c.sales_channel_id,
      email: c.email,
      currency_code: c.currency_code,
      metadata: c.metadata,
    }))

    await service.update(toRestore)
  }
)
