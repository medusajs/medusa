import { moduleProviderLoader } from "@medusajs/framework/modules-sdk"

import {
  LoaderOptions,
  ModuleProvider,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { asFunction, Lifetime } from "awilix"

import * as providers from "../providers"

const registrationFn = async (klass, container, pluginOptions) => {
  container.register({
    [`tp_${klass.identifier}`]: asFunction(
      (cradle) => new klass(cradle, pluginOptions),
      { lifetime: klass.LIFE_TIME || Lifetime.SINGLETON }
    ),
  })

  container.registerAdd(
    "tax_providers",
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
  // Local providers
  for (const provider of Object.values(providers)) {
    await registrationFn(provider, container, {})
  }

  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })
}
