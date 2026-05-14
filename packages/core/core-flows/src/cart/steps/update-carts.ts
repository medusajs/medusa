import {
  ICartModuleService,
  UpdateAddressDTO,
  UpdateCartDTO,
  UpdateCartWorkflowInputDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the carts to update.
 */
export type UpdateCartsStepInput = UpdateCartWorkflowInputDTO[]

export const updateCartsStepId = "update-carts"
/**
 * This step updates a cart.
 *
 * @example
 * const data = updateCartsStep([{
 *   id: "cart_123",
 *   email: "customer@gmail.com",
 * }])
 */
export const updateCartsStep = createStep(
  updateCartsStepId,
  async (data: UpdateCartsStepInput, { container }) => {
    const cartModule = container.resolve<ICartModuleService>(Modules.CART)

    if (!data.length) {
      return new StepResponse([], {
        cartsBeforeUpdate: [],
        addressesBeforeUpdate: [],
      })
    }

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data, {
      requiredFields: [
        "id",
        "region_id",
        "customer_id",
        "sales_channel_id",
        "email",
        "currency_code",
        "metadata",
        "completed_at",
      ],
    })
    const cartsBeforeUpdate = await cartModule.listCarts(
      { id: data.map((d) => d.id) },
      { select: selects, relations }
    )

    // Since service factory udpate method will correctly keep the reference to the addresses,
    // but won't update its fields, we do this separately
    const addressesInput = data
      .flatMap((cart) => [cart.shipping_address, cart.billing_address])
      .filter((address) => !!address)
    let addressesToUpdateIds: string[] = []
    const addressesToUpdate = addressesInput.filter(
      (address): address is UpdateAddressDTO => {
        if ("id" in address && !!address.id) {
          addressesToUpdateIds.push(address.id as string)
          return true
        }
        return false
      }
    )
    const addressesBeforeUpdate = await cartModule.listAddresses({
      id: addressesToUpdate.map((address) => address.id),
    })
    if (addressesToUpdate.length) {
      await cartModule.updateAddresses(addressesToUpdate)
    }

    const updatedCart = await cartModule.updateCarts(data)

    return new StepResponse(updatedCart, {
      cartsBeforeUpdate,
      addressesBeforeUpdate,
    })
  },
  async (dataToCompensate, { container }) => {
    if (!dataToCompensate) {
      return
    }

    const { cartsBeforeUpdate, addressesBeforeUpdate } = dataToCompensate

    const cartModule = container.resolve<ICartModuleService>(Modules.CART)

    const addressesToUpdate: UpdateAddressDTO[] = []
    for (const address of addressesBeforeUpdate) {
      addressesToUpdate.push({
        ...address,
        metadata: address.metadata ?? undefined,
      })
    }
    await cartModule.updateAddresses(addressesToUpdate)

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
        completed_at: cart.completed_at,
      })
    }

    return await cartModule.updateCarts(dataToUpdate)
  }
)
