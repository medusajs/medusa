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
    // The defaults only change with Medusa upgrades: write only what's
    // missing or different, so a boot doesn't rewrite every currency
    const existing = await currencyService_.list(
      {},
      {
        select: [
          "code",
          "symbol",
          "symbol_native",
          "name",
          "decimal_digits",
          "rounding",
        ],
      }
    )
    const existingByCode = new Map(existing.map((c) => [c.code, c]))
    const changed = normalizedCurrencies.filter((currency) => {
      const current = existingByCode.get(currency.code)
      return (
        !current ||
        current.symbol !== currency.symbol ||
        current.symbol_native !== currency.symbol_native ||
        current.name !== currency.name ||
        Number(current.decimal_digits) !== Number(currency.decimal_digits) ||
        Number(current.rounding) !== Number(currency.rounding)
      )
    })
    if (changed.length) {
      await currencyService_.upsert(changed)
    }
    logger.debug(`Loaded ${changed.length} currencies`)
  } catch (error) {
    logger.warn(
      `Failed to load currencies, skipping loader. Original error: ${error.message}`
    )
  }
}
