// import * as defaultProviders from "@providers"

import { LoaderOptions, ModulesSdkTypes, ModuleProvider } from "@medusajs/types"
import { Lifetime, asFunction, asValue } from "awilix"
import { moduleProviderLoader } from "@medusajs/modules-sdk"
import {
  AuthIdentifiersRegistrationName,
  AuthProviderRegistrationPrefix,
} from "@types"

const registrationFn = async (klass, container, pluginOptions) => {
  Object.entries(pluginOptions.config || []).map(([name, config]) => {
    container.register({
      [AuthProviderRegistrationPrefix + name]: asFunction(
        (cradle) => new klass(cradle, config),
        {
          lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
        }
      ),
    })

    container.registerAdd(AuthIdentifiersRegistrationName, asValue(name))
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
  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })
}
