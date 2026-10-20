import {
  LoaderOptions,
  Logger,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  DefaultsUtils,
} from "@medusajs/framework/utils"
import { Country } from "@models"

export default async ({ container }: LoaderOptions): Promise<void> => {
  // TODO: Add default logger to the container when running tests
  const logger =
    container.resolve<Logger>(ContainerRegistrationKeys.LOGGER) ?? console
  const countryService_: ModulesSdkTypes.IMedusaInternalService<
    typeof Country
  > = container.resolve("countryService")

  try {
    const normalizedCountries = DefaultsUtils.defaultCountries.map((c) => ({
      iso_2: c.alpha2.toLowerCase(),
      iso_3: c.alpha3.toLowerCase(),
      num_code: c.numeric,
      name: c.name.toUpperCase(),
      display_name: c.name,
    }))

    // The defaults only change with Medusa upgrades: write only what's
    // missing or different, so a boot doesn't rewrite every country
    const existing = await countryService_.list(
      {},
      { select: ["iso_2", "iso_3", "num_code", "name", "display_name"] }
    )
    const existingByIso2 = new Map(existing.map((c) => [c.iso_2, c]))
    const changed = normalizedCountries.filter((country) => {
      const current = existingByIso2.get(country.iso_2)
      return (
        !current ||
        current.iso_3 !== country.iso_3 ||
        String(current.num_code) !== String(country.num_code) ||
        current.name !== country.name ||
        current.display_name !== country.display_name
      )
    })
    if (changed.length) {
      await countryService_.upsert(changed)
    }
    logger.debug(`Loaded ${changed.length} countries`)
  } catch (error) {
    logger.warn(
      `Failed to load countries, skipping loader. Original error: ${error.message}`
    )
  }
}
