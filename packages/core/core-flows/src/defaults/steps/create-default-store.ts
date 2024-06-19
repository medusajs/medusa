import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateStoreDTO, IStoreModuleService, StoreDTO } from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { createStoresWorkflow } from "../../store"

type CreateDefaultStoreStepInput = {
  store: CreateStoreDTO
}

export const createDefaultStoreStepId = "create-default-store"
export const createDefaultStoreStep = createStep(
  createDefaultStoreStepId,
  async (data: CreateDefaultStoreStepInput, { container }) => {
    const storeService = container.resolve(ModuleRegistrationName.STORE)

    let shouldDelete = false
    let [store] = await storeService.listStores({}, { take: 1 })

    /**
     * @todo
     * Seems like we are missing an integration test when the
     * following conditional as true.
     */
    if (!store) {
      const stores = await createStoresWorkflow(container).run({
        input: {
          stores: [
            {
              // TODO: Revisit for a more sophisticated approach
              ...data.store,
              supported_currency_codes: ["eur"],
              default_currency_code: "eur",
            },
          ],
        },
      })

      /**
       * As per types, the result from "createStoresWorkflow.run" was
       * an array of "StoreDTO". But at runtime it turns out to be
       * a "StoreDTO"
       */
      store = stores as unknown as StoreDTO
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

    await service.deleteStores(data.storeId)
  }
)
