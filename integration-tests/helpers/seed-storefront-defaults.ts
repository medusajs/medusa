import { createDefaultsWorkflow } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  IRegionModuleService,
  IStoreModuleService,
  MedusaContainer,
} from "@medusajs/types"

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

  const region = await regionModule.create({
    name: "Default Region",
    currency_code: defaultCurrency,
  })

  let [store] = await storeModule.list({})

  store = await storeModule.update(store.id, {
    default_region_id: region.id,
    supported_currency_codes: [region.currency_code],
    default_currency_code: region.currency_code,
  })

  return {
    region,
    store,
  }
}
