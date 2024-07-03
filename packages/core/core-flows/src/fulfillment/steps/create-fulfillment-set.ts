import {
  CreateFulfillmentSetDTO,
  IFulfillmentModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createFulfillmentSetsId = "create-fulfillment-sets"
export const createFulfillmentSets = createStep(
  createFulfillmentSetsId,
  async (data: CreateFulfillmentSetDTO[], { container }) => {
    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const createSets = await service.createFulfillmentSets(data)

    return new StepResponse(
      createSets,
      createSets.map((createdSet) => createdSet.id)
    )
  },
  async (createSetIds, { container }) => {
    if (!createSetIds?.length) {
      return
    }

    const service = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    await service.deleteFulfillmentSets(createSetIds)
  }
)
