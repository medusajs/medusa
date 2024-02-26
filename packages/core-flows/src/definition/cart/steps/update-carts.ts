import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CartWorkflow, ICartModuleService } from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updateCartsStepId = "update-carts"
export const updateCartsStep = createStep(
  updateCartsStepId,
  async (data: CartWorkflow.UpdateCartWorkflowInputDTO, { container }) => {
    const { id, ...updateData } = data
    const cartModule = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([data])

    const cartBeforeUpdate = await cartModule.retrieve(id, {
      select: selects,
      relations,
    })

    const updatedCart = await cartModule.update(id, updateData)

    return new StepResponse(updatedCart, cartBeforeUpdate)
  },
  async (cartBeforeUpdate, { container }) => {
    if (!cartBeforeUpdate) {
      return
    }

    const cartModule = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    await cartModule.update(cartBeforeUpdate.id, {
      region_id: cartBeforeUpdate.region_id,
      customer_id: cartBeforeUpdate.customer_id,
      sales_channel_id: cartBeforeUpdate.sales_channel_id,
      email: cartBeforeUpdate.email,
      currency_code: cartBeforeUpdate.currency_code,
      metadata: cartBeforeUpdate.metadata,
    })
  }
)
