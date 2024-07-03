import EmailPassProvider from "@medusajs/auth-emailpass"

import { LoaderOptions, ModulesSdkTypes, ModuleProvider } from "@medusajs/types"
import { Lifetime, asFunction, asValue } from "awilix"
import { moduleProviderLoader } from "@medusajs/modules-sdk"
import {
  AuthIdentifiersRegistrationName,
  AuthProviderRegistrationPrefix,
} from "@types"

const registrationFn = async (klass, container, pluginOptions) => {
  container.register({
    [AuthProviderRegistrationPrefix + pluginOptions.id]: asFunction(
      (cradle) => new klass(cradle, pluginOptions.options ?? {}),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(
    AuthIdentifiersRegistrationName,
    asValue(pluginOptions.id)
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
  // Note: For now we want to inject some providers out of the box
  const providerConfig = [
    {
      resolve: EmailPassProvider,
      id: "emailpass",
    },
    ...(options?.providers ?? []),
  ]

  await moduleProviderLoader({
    container,
    providers: providerConfig,
    registerServiceFn: registrationFn,
  })
}
