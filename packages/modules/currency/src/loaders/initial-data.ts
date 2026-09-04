import {
  LoaderOptions,
  Logger,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  defaultCurrencies,
} from "@medusajs/framework/utils"
import { Currency } from "@models"

export default async ({
  container,
  options,
}: LoaderOptions<
  | ModulesSdkTypes.ModuleServiceInitializeOptions
  | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  // TODO: Add default logger to the container when running tests
  const logger =
    container.resolve<Logger>(ContainerRegistrationKeys.LOGGER) ?? console
  const { currencyService_ } = container.resolve<{
    currencyService_: ModulesSdkTypes.IMedusaInternalService<typeof Currency>
  }>("currencyModuleService")

  try {
    const normalizedCurrencies = Object.values(defaultCurrencies).map((c) => ({
      ...c,
      code: c.code.toLowerCase(),
    }))

    // Only insert currencies that are not present yet. Using `upsert` here would
    // overwrite every column on every boot, silently discarding user edits to
    // fields such as `name`.
    const existingCurrencies = await currencyService_.list(
      { code: normalizedCurrencies.map((c) => c.code) },
      { select: ["code"] }
    )
    const existingCodes = new Set(existingCurrencies.map((c) => c.code))

    const missingCurrencies = normalizedCurrencies.filter(
      (c) => !existingCodes.has(c.code)
    )

    if (!missingCurrencies.length) {
      logger.debug(
        `Currencies already seeded, skipping loader (${existingCodes.size} present)`
      )
      return
    }

    const resp = await currencyService_.create(missingCurrencies)
    logger.debug(`Loaded ${resp.length} currencies`)
  } catch (error) {
    logger.warn(
      `Failed to load currencies, skipping loader. Original error: ${error.message}`
    )
  }
}
