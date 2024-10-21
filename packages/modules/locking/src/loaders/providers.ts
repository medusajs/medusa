import { moduleProviderLoader } from "@medusajs/framework/modules-sdk"
import {
  LoaderOptions,
  ModuleProvider,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  getProviderRegistrationKey,
} from "@medusajs/framework/utils"
import { LockingProviderService } from "@services"
import {
  LockingDefaultProvider,
  LockingIdentifiersRegistrationName,
  LockingProviderRegistrationPrefix,
} from "@types"
import { Lifetime, aliasTo, asFunction, asValue } from "awilix"
import { InMemoryLockingProvider } from "../providers/in-memory"

const registrationFn = async (klass, container, { id }) => {
  const key = LockingProviderService.getRegistrationIdentifier(klass)

  if (!id) {
    throw new Error(`No "id" provided for provider ${key}`)
  }

  const regKey = getProviderRegistrationKey({
    providerId: id,
    providerIdentifier: key,
  })

  container.register({
    [LockingProviderRegistrationPrefix + key]: aliasTo(regKey),
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
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
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

  const isSingleProvider = options?.providers?.length === 1
  let hasDefaultProvider = false
  for (const provider of options?.providers || []) {
    if (provider.is_default || isSingleProvider) {
      if (provider.is_default) {
        hasDefaultProvider = true
      }
      container.register(LockingDefaultProvider, asValue(provider.id))
    }
  }

  if (!hasDefaultProvider) {
    logger.warn(
      `No default locking provider explicit defined. Using "${container.resolve(
        LockingDefaultProvider
      )}" as default.`
    )
  }
}
