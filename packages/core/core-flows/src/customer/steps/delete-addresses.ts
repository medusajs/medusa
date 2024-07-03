import { ICustomerModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

type DeleteCustomerAddressStepInput = string[]
export const deleteCustomerAddressesStepId = "delete-customer-addresses"
export const deleteCustomerAddressesStep = createStep(
  deleteCustomerAddressesStepId,
  async (ids: DeleteCustomerAddressStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const existing = await service.listAddresses({
      id: ids,
    })
    await service.deleteAddresses(ids)

    return new StepResponse(void 0, existing)
  },
  async (prevAddresses, { container }) => {
    if (!prevAddresses?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.createAddresses(prevAddresses)
  }
)
