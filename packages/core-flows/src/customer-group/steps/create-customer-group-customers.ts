import { GroupCustomerPair, ICustomerModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const createCustomerGroupCustomersStepId =
  "create-customer-group-customers"
export const createCustomerGroupCustomersStep = createStep(
  createCustomerGroupCustomersStepId,
  async (data: GroupCustomerPair[], { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const groupPairs = await service.addCustomerToGroup(data)

    return new StepResponse(groupPairs, data)
  },
  async (groupPairs, { container }) => {
    if (!groupPairs?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.removeCustomerFromGroup(groupPairs)
  }
)
