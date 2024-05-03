import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateStoreDTO, IStoreModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CreateStoresStepInput = {
  stores: CreateStoreDTO[]
}

export const createStoresStepId = "create-stores"
export const createStoresStep = createStep(
  createStoresStepId,
  async (data: CreateStoresStepInput, { container }) => {
    const service = container.resolve<IStoreModuleService>(
      ModuleRegistrationName.STORE
    )

    const created = await service.create(data.stores)
    return new StepResponse(
      created,
      created.map((store) => store.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IStoreModuleService>(
      ModuleRegistrationName.STORE
    )

    await service.delete(createdIds)
  }
)
