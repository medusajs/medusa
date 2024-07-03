import { createDefaultsWorkflow } from "@medusajs/core-flows"
import {
  IRegionModuleService,
  IStoreModuleService,
  MedusaContainer,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"

export const seedStorefrontDefaults = async (
  container: MedusaContainer,
  defaultCurrency: string = "usd"
) => {
  const regionModule: IRegionModuleService = container.resolve(
    ModuleRegistrationName.REGION
  )
  const storeModule: IStoreModuleService = container.resolve(
    ModuleRegistrationName.STORE
  )

  // Creates the stores & default sales channel
  await createDefaultsWorkflow(container).run()

  const region = await regionModule.createRegions({
    name: "Default Region",
    currency_code: defaultCurrency,
  })

  let [store] = await storeModule.listStores({})

  store = await storeModule.updateStores(store.id, {
    default_region_id: region.id,
    supported_currencies: [
      { currency_code: region.currency_code, is_default: true },
    ],
  })

  return {
    region,
    store,
  }
}
