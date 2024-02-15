import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IRegionModuleService, LoaderOptions } from "@medusajs/types"

export default async ({ container }: LoaderOptions): Promise<void> => {
  const service: IRegionModuleService = container.resolve(
    ModuleRegistrationName.REGION
  )

  // TODO: Remove when legacy modules have been migrated
  if (!!process.env.MEDUSA_FF_MEDUSA_V2) {
    await service.createDefaultCountriesAndCurrencies()
  }
}
