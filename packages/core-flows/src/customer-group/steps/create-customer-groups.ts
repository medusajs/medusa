import { CreateCustomerGroupDTO, ICustomerModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const createCustomerGroupsStepId = "create-customer-groups"
export const createCustomerGroupsStep = createStep(
  createCustomerGroupsStepId,
  async (data: CreateCustomerGroupDTO[], { container }) => {
    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    const createdCustomerGroups = await service.createCustomerGroup(data)

    return new StepResponse(
      createdCustomerGroups,
      createdCustomerGroups.map(
        (createdCustomerGroups) => createdCustomerGroups.id
      )
    )
  },
  async (createdCustomerGroupIds, { container }) => {
    if (!createdCustomerGroupIds?.length) {
      return
    }

    const service = container.resolve<ICustomerModuleService>(
      ModuleRegistrationName.CUSTOMER
    )

    await service.delete(createdCustomerGroupIds)
  }
)
