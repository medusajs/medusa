import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IRegionModuleService, LoaderOptions, Logger } from "@medusajs/types"
import { ContainerRegistrationKeys, DefaultsUtils } from "@medusajs/utils"

export default async ({ container }: LoaderOptions): Promise<void> => {
  // TODO: Add default logger to the container when running tests
  const logger =
    container.resolve<Logger>(ContainerRegistrationKeys.LOGGER) ?? console
  const regionService = container.resolve<IRegionModuleService>(
    ModuleRegistrationName.REGION
  )

  try {
    const normalizedCountries = DefaultsUtils.defaultCountries.map((c) => ({
      iso_2: c.alpha2.toLowerCase(),
      iso_3: c.alpha3.toLowerCase(),
      num_code: c.numeric,
      name: c.name.toUpperCase(),
      display_name: c.name,
    }))

    const resp = await regionService.upsert(normalizedCountries)
    logger.info(`Loaded ${resp.length} countries`)
  } catch (error) {
    logger.warn(
      `Failed to load countries, skipping loader. Original error: ${error.message}`
    )
  }
}
