import { moduleProviderLoader } from "@medusajs/framework/modules-sdk"
import {
  LoaderOptions,
  ModuleProvider,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  lowerCaseFirst,
  promiseAll,
} from "@medusajs/framework/utils"
import { LockingProviderService } from "@services"
import {
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
    [LockingProviderRegistrationPrefix + InMemoryLockingProvider.identifier]:
      asFunction(
        (cradle) => new InMemoryLockingProvider(cradle, pluginOptions.options),
        {
          lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
        }
      ),
  })

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

  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })

  await syncDatabaseProviders({
    container,
  })
}

async function syncDatabaseProviders({ container }) {
  const providerServiceRegistrationKey = lowerCaseFirst(
    LockingProviderService.name
  )

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER) ?? console

  try {
    const providerIdentifiers: string[] = (
      container.resolve(LockingIdentifiersRegistrationName) ?? []
    ).filter(Boolean)

    const providerService: ModulesSdkTypes.IMedusaInternalService<any> =
      container.resolve(providerServiceRegistrationKey)

    const providers = await providerService.list({})
    const loadedProvidersMap = new Map(providers.map((p) => [p.id, p]))

    const providersToCreate = providerIdentifiers.filter(
      (id) => !loadedProvidersMap.has(id)
    )
    const providersToEnabled = providerIdentifiers.filter((id) =>
      loadedProvidersMap.has(id)
    )
    const providersToDisable = providers.filter(
      (p) => !providerIdentifiers.includes(p.id)
    )

    const promises: Promise<any>[] = []

    if (providersToCreate.length) {
      promises.push(
        providerService.create(providersToCreate.map((id) => ({ id })))
      )
    }

    if (providersToEnabled.length) {
      promises.push(
        providerService.update(
          providersToEnabled.map((id) => ({ id, is_enabled: true }))
        )
      )
    }

    if (providersToDisable.length) {
      promises.push(
        providerService.update(
          providersToDisable.map((p) => ({ id: p.id, is_enabled: false }))
        )
      )
    }

    await promiseAll(promises)
  } catch (error) {
    logger.error(`Error syncing the fulfillment providers: ${error.message}`)
  }
}
