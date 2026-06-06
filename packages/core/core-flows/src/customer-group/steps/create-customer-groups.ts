import {
  CreateCustomerGroupDTO,
  ICustomerModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to create customer groups.
 */
export type CreateCustomerGroupsStepInput = CreateCustomerGroupDTO[]

export const createCustomerGroupsStepId = "create-customer-groups"
/**
 * This step creates one or more customer groups.
 */
export const createCustomerGroupsStep = createStep(
  createCustomerGroupsStepId,
  async (data: CreateCustomerGroupsStepInput, { container }) => {
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

    await service.deleteCustomerGroups(createdCustomerGroupIds)
  }
)
