import EmailPassProvider from "@medusajs/auth-emailpass"

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
  // TODO: Temporary settings used by the starter, remove once the auth module is updated
  const isLegacyOptions =
    options?.providers?.length && !!(options?.providers[0] as any)?.name

  // Note: For now we want to inject some providers out of the box
  const providerConfig = [
    {
      resolve: EmailPassProvider,
      options: {
        config: {
          emailpass: {},
        },
      },
    },
    ...(isLegacyOptions ? [] : options?.providers ?? []),
  ]

  await moduleProviderLoader({
    container,
    providers: providerConfig,
    registerServiceFn: registrationFn,
  })
}
