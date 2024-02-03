import { moduleProviderLoader } from "@medusajs/modules-sdk"
import { LoaderOptions, ModuleProvider, ModulesSdkTypes } from "@medusajs/types"
import { Lifetime, asFunction, asValue } from "awilix"

const registrationFn = async (klass, container, pluginOptions) => {
  Object.entries(pluginOptions.config).map(([k, v]) => {
    const key = `pp_${klass.PROVIDER}_${k}`
    container.register({
      [key]: asFunction((cradle) => new klass(cradle, pluginOptions), {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }).inject(() => ({ config: v })),
    })

    container.registerAdd("payment_providers", asValue(key))
  })
}

export default async ({
  container,
  options,
}: LoaderOptions<
  (
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  ) & { providers: ModuleProvider[] }
>): Promise<void> => {
  const pluginProviders =
    options?.providers?.filter((provider) => provider.resolve) || []

  await moduleProviderLoader({
    container,
    providers: pluginProviders,
    registerServiceFn: registrationFn,
  })
}
