import { moduleProviderLoader } from "@medusajs/modules-sdk"

import { LoaderOptions, ModuleProvider, ModulesSdkTypes } from "@medusajs/types"
import { Lifetime, asFunction } from "awilix"

import * as providers from "../providers"

const registrationFn = async (klass, container, pluginOptions) => {
  container.register({
    [`pp_${klass.identifier}`]: asFunction(
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

  // Local providers
  for (const provider of Object.values(providers)) {
    // TODO: pass options
    await registrationFn(provider, container, {})
  }

  await moduleProviderLoader({
    container,
    providers: pluginProviders,
    registerServiceFn: registrationFn,
  })
}
