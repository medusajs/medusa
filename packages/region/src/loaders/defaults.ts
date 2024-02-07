import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IRegionModuleService, LoaderOptions } from "@medusajs/types"

export default async ({ container }: LoaderOptions): Promise<void> => {
  const service: IRegionModuleService = container.resolve(ModuleRegistrationName.REGION)
  await service.createDefaultCountriesAndCurrencies()
}
