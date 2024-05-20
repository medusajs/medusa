import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateStoreDTO,
  IRegionModuleService,
  IStoreModuleService,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { createStoresWorkflow } from "../../store"

type CreateDefaultStoreStepInput = {
  store: CreateStoreDTO
}

export const createDefaultStoreStepId = "create-default-store"
export const createDefaultStoreStep = createStep(
  createDefaultStoreStepId,
  async (data: CreateDefaultStoreStepInput, { container }) => {
    const storeService = container.resolve<IStoreModuleService>(
      ModuleRegistrationName.STORE
    )
    const regionService = container.resolve<IRegionModuleService>(
      ModuleRegistrationName.REGION
    )

    let shouldDelete = false
    let [store] = await storeService.list({}, { take: 1 })

    if (!store) {
      let [region] = await regionService.list({}, { take: 1 })

      const { result } = await createStoresWorkflow(container).run({
        input: {
          stores: [
            {
              // TODO: Revisit for a more sophisticated approach
              ...data.store,
              supported_currency_codes: [region?.currency_code ?? "usd"],
              default_currency_code: region?.currency_code ?? "usd",
              default_region_id: region?.id,
            },
          ],
        },
      })

      store = result[0]

      shouldDelete = true
    }

    return new StepResponse(store, { storeId: store.id, shouldDelete })
  },
  async (data, { container }) => {
    if (!data || !data.shouldDelete) {
      return
    }

    const service = container.resolve<IStoreModuleService>(
      ModuleRegistrationName.STORE
    )

    await service.delete(data.storeId)
  }
)
