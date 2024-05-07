import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import { ContainerRegistrationKeys, DefaultsUtils } from "@medusajs/utils"
import { Country } from "@models"

export default async ({ container }: LoaderOptions): Promise<void> => {
  // TODO: Add default logger to the container when running tests
  const logger =
    container.resolve<Logger>(ContainerRegistrationKeys.LOGGER) ?? console
  const countryService_: ModulesSdkTypes.InternalModuleService<Country> =
    container.resolve("countryService")

  try {
    const normalizedCountries = DefaultsUtils.defaultCountries.map((c) => ({
      iso_2: c.alpha2.toLowerCase(),
      iso_3: c.alpha3.toLowerCase(),
      num_code: c.numeric,
      name: c.name.toUpperCase(),
      display_name: c.name,
    }))

    const resp = await countryService_.upsert(normalizedCountries)
    logger.info(`Loaded ${resp.length} countries`)
  } catch (error) {
    logger.warn(
      `Failed to load countries, skipping loader. Original error: ${error.message}`
    )
  }
}
