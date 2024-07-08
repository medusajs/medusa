import { GroupCustomerPair, ICustomerModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteCustomerGroupCustomersStepId =
  "delete-customer-group-customers"
export const deleteCustomerGroupCustomersStep = createStep(
  deleteCustomerGroupCustomersStepId,
  async (data: GroupCustomerPair[], { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.removeCustomerFromGroup(data)

    return new StepResponse(void 0, data)
  },
  async (groupPairs, { container }) => {
    if (!groupPairs?.length) {
      return
    }
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.addCustomerToGroup(groupPairs)
  }
)
