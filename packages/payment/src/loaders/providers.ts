import { moduleProviderLoader } from "@medusajs/modules-sdk"

import { LoaderOptions, ModuleProvider, ModulesSdkTypes } from "@medusajs/types"
import { Lifetime, asFunction } from "awilix"

const registrationFn = async (klass, container, pluginOptions) => {
  container.register({
    [`payment_provider_${klass.prototype}`]: asFunction(
      (cradle) => new klass(cradle, pluginOptions),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(
    "payment_providers",
    asFunction((cradle) => new klass(cradle, pluginOptions), {
      lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
    })
  )
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
