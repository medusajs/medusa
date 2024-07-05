import { moduleProviderLoader } from "@medusajs/modules-sdk"
import { LoaderOptions, ModuleProvider, ModulesSdkTypes } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  lowerCaseFirst,
  promiseAll,
} from "@medusajs/utils"
import { NotificationProvider } from "@models"
import { NotificationProviderService } from "@services"
import {
  NotificationIdentifiersRegistrationName,
  NotificationProviderRegistrationPrefix,
} from "@types"
import { Lifetime, asFunction, asValue } from "awilix"

const registrationFn = async (klass, container, pluginOptions) => {
  container.register({
    [NotificationProviderRegistrationPrefix + pluginOptions.id]: asFunction(
      (cradle) => new klass(cradle, pluginOptions.options ?? {}),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(
    NotificationIdentifiersRegistrationName,
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
  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })

  await syncDatabaseProviders({
    container,
    providers: options?.providers || [],
  })
}

async function syncDatabaseProviders({
  container,
  providers,
}: {
  container: any
  providers: ModuleProvider[]
}) {
  const providerServiceRegistrationKey = lowerCaseFirst(
    NotificationProviderService.name
  )
  const providerService: ModulesSdkTypes.IMedusaInternalService<
    typeof NotificationProvider
  > = container.resolve(providerServiceRegistrationKey)

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER) ?? console
  const normalizedProviders = providers.map((provider) => {
    if (!provider.id) {
      throw new Error(
        "An entry in the provider config is required to initialize notification providers"
      )
    }

    const config = provider.options as { channels: string[] }
    return {
      id: provider.id,
      handle: provider.id,
      name: provider.id,
      is_enabled: true,
      channels: config?.channels ?? [],
    }
  })

  validateProviders(normalizedProviders)

  try {
    const providersInDb = await providerService.list({})
    const providersToDisable = providersInDb.filter(
      (dbProvider) =>
        !normalizedProviders.some(
          (normalizedProvider) => normalizedProvider.id === dbProvider.id
        )
    )

    const promises: Promise<any>[] = []

    if (normalizedProviders.length) {
      promises.push(providerService.upsert(normalizedProviders))
    }

    if (providersToDisable.length) {
      promises.push(
        providerService.update(
          providersToDisable.map((p) => ({
            id: p.id,
            update: { is_enabled: false },
          }))
        )
      )
    }

    await promiseAll(promises)
  } catch (error) {
    logger.error(`Error syncing the notification providers: ${error.message}`)
  }
}

function validateProviders(providers: { channels: string[] }[]) {
  const hasForChannel = {}
  providers.forEach((provider) => {
    provider.channels.forEach((channel) => {
      if (hasForChannel[channel]) {
        throw new Error(
          `Multiple providers are configured for the same channel: ${channel}`
        )
      }
      hasForChannel[channel] = true
    })
  })
}
