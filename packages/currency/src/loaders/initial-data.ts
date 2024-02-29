import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ModulesSdkTypes, LoaderOptions } from "@medusajs/types"
import { defaultCurrencies } from "@medusajs/utils"
import { Currency } from "@models"

export default async ({
  container,
  options,
}: LoaderOptions<
  | ModulesSdkTypes.ModuleServiceInitializeOptions
  | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  try {
    const {
      currencyService_,
    }: { currencyService_: ModulesSdkTypes.InternalModuleService<Currency> } =
      container.resolve(ModuleRegistrationName.CURRENCY)

    const normalizedCurrencies = Object.values(defaultCurrencies).map((c) => ({
      ...c,
      code: c.code.toLowerCase(),
    }))
    const resp = await currencyService_.upsert(normalizedCurrencies)
    console.log(`Loaded ${resp.length} currencies`)
  } catch (error) {
    console.error(
      `Failed to load currencies, skipping loader. Original error: ${error.message}`
    )
  }
}
