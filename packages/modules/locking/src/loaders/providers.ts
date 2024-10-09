import { moduleProviderLoader } from "@medusajs/framework/modules-sdk"
import {
  LoaderOptions,
  ModuleProvider,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { LockingProviderService } from "@services"
import {
  LockingDefaultProvider,
  LockingIdentifiersRegistrationName,
  LockingProviderRegistrationPrefix,
} from "@types"
import { Lifetime, asFunction, asValue } from "awilix"
import { InMemoryLockingProvider } from "../providers/in-memory"

const registrationFn = async (klass, container, pluginOptions) => {
  const key = LockingProviderService.getRegistrationIdentifier(
    klass,
    pluginOptions.id
  )

  container.register({
    [LockingProviderRegistrationPrefix + key]: asFunction(
      (cradle) => new klass(cradle, pluginOptions.options),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(LockingIdentifiersRegistrationName, asValue(key))
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
  container.registerAdd(LockingIdentifiersRegistrationName, asValue(undefined))

  // InMemoryLockingProvider - default provider
  container.register({
    [LockingProviderRegistrationPrefix + InMemoryLockingProvider.identifier]:
      asFunction((cradle) => new InMemoryLockingProvider(), {
        lifetime: Lifetime.SINGLETON,
      }),
  })
  container.registerAdd(
    LockingIdentifiersRegistrationName,
    asValue(InMemoryLockingProvider.identifier)
  )
  container.register(
    LockingDefaultProvider,
    asValue(InMemoryLockingProvider.identifier)
  )

  // Load other providers
  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })

  for (const provider of options?.providers || []) {
    if (provider.is_default) {
      container.register(LockingDefaultProvider, asValue(provider.id))
    }
  }
}
