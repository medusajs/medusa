import { moduleProviderLoader } from "@zjedene-medusa/framework/modules-sdk"
import { LoaderOptions, ModulesSdkTypes } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  getProviderRegistrationKey,
} from "@zjedene-medusa/framework/utils"
import { CachingProviderService } from "@services"
import {
  CachingDefaultProvider,
  CachingIdentifiersRegistrationName,
  CachingModuleOptions,
  CachingProviderRegistrationPrefix,
} from "@types"
import { aliasTo, asFunction, asValue, Lifetime } from "awilix"
import { MemoryCachingProvider } from "../providers/memory-cache"
import { DefaultCacheStrategy } from "../utils/strategy"

const registrationFn = async (klass, container, { id }) => {
  const key = CachingProviderService.getRegistrationIdentifier(klass)

  if (!id) {
    throw new Error(`No "id" provided for provider ${key}`)
  }

  const regKey = getProviderRegistrationKey({
    providerId: id,
    providerIdentifier: key,
  })

  container.register({
    [CachingProviderRegistrationPrefix + id]: aliasTo(regKey),
  })

  container.registerAdd(CachingIdentifiersRegistrationName, asValue(key))
}

export default async ({
  container,
  options,
}: LoaderOptions<
  (
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  ) &
    CachingModuleOptions
>): Promise<void> => {
  container.registerAdd(CachingIdentifiersRegistrationName, asValue(undefined))

  const strategy = DefaultCacheStrategy // Re enable custom strategy another time
  container.register("strategy", asValue(strategy))

  const inMemoryOptions = options?.in_memory ?? {}
  const { enable: isInMemoryEnabled, ...restInmemoryOptions } = inMemoryOptions

  if (isInMemoryEnabled) {
    // MemoryCachingProvider - default provider
    container.register({
      [CachingProviderRegistrationPrefix + MemoryCachingProvider.identifier]:
        asFunction(
          (cradle) => new MemoryCachingProvider(cradle, restInmemoryOptions),
          {
            lifetime: Lifetime.SINGLETON,
          }
        ),
    })
    container.registerAdd(
      CachingIdentifiersRegistrationName,
      asValue(MemoryCachingProvider.identifier)
    )
    container.register(
      CachingDefaultProvider,
      asValue(MemoryCachingProvider.identifier)
    )
  }

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
      hasDefaultProvider = true
      container.register(CachingDefaultProvider, asValue(provider.id))
    }
  }

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  if (!hasDefaultProvider) {
    if (isInMemoryEnabled) {
      logger.warn(
        `[caching-module]: No default caching provider defined. Using "${container.resolve(
          CachingDefaultProvider
        )}" as default.`
      )
    } else {
      throw new Error(
        "[caching-module]: No providers have been configured and the built in memory cache has not been enabled."
      )
    }
  }
}
