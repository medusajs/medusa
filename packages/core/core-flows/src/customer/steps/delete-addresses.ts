import type { ICustomerModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The IDs of the customer addresses to delete.
 */
export type DeleteCustomerAddressesStepInput = string[]

export const deleteCustomerAddressesStepId = "delete-customer-addresses"
/**
 * This step deletes one or more customer addresses.
 */
export const deleteCustomerAddressesStep = createStep(
  deleteCustomerAddressesStepId,
  async (ids: DeleteCustomerAddressesStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    const existing = await service.listCustomerAddresses({
      id: ids,
    })
    await service.deleteCustomerAddresses(ids)

    return new StepResponse(void 0, existing)
  },
  async (prevAddresses, { container }) => {
    if (!prevAddresses?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    await service.createCustomerAddresses(
      prevAddresses.map((address) => {
        const { customer, ...rest } = address as any
        return rest
      })
    )
  }
)
