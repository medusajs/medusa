import { CreateCustomerGroupDTO, ICustomerModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createCustomerGroupsStepId = "create-customer-groups"
/**
 * This step creates one or more customer groups.
 */
export const createCustomerGroupsStep = createStep(
  createCustomerGroupsStepId,
  async (data: CreateCustomerGroupDTO[], { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    const createdCustomerGroups = await service.createCustomerGroups(data)

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

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER)

    await service.deleteCustomers(createdCustomerGroupIds)
  }
)
