import {
  ICartModuleService,
  UpdateCartDTO,
  UpdateCartWorkflowInputDTO,
} from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateCartsStepId = "update-carts"
export const updateCartsStep = createStep(
  updateCartsStepId,
  async (data: UpdateCartWorkflowInputDTO[], { container }) => {
    const cartModule = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)
    const cartsBeforeUpdate = await cartModule.listCarts(
      { id: data.map((d) => d.id) },
      { select: selects, relations }
    )

    const updatedCart = await cartModule.updateCarts(data)

    return new StepResponse(updatedCart, cartsBeforeUpdate)
  },
  async (cartsBeforeUpdate, { container }) => {
    if (!cartsBeforeUpdate) {
      return
    }

    const cartModule = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const dataToUpdate: UpdateCartDTO[] = []

    for (const cart of cartsBeforeUpdate) {
      dataToUpdate.push({
        id: cart.id,
        region_id: cart.region_id,
        customer_id: cart.customer_id,
        sales_channel_id: cart.sales_channel_id,
        email: cart.email,
        currency_code: cart.currency_code,
        metadata: cart.metadata,
      })
    }

    return await cartModule.updateCarts(dataToUpdate)
  }
)
