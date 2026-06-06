import { Lifetime, asFunction, asValue } from "@zjedene-medusa/framework/awilix"
import { moduleProviderLoader } from "@zjedene-medusa/framework/modules-sdk"
import { LoaderOptions, ModulesSdkTypes } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  lowerCaseFirst,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import { NotificationProvider } from "@models"
import { NotificationProviderService } from "@services"
import {
  NotificationIdentifiersRegistrationName,
  NotificationModuleOptions,
  NotificationProviderRegistrationPrefix,
} from "@types"
import { MedusaCloudEmailNotificationProvider } from "../providers/medusa-cloud-email"

const validateCloudOptions = (options: NotificationModuleOptions["cloud"]) => {
  const { api_key, endpoint, environment_handle, sandbox_handle } =
    options ?? {}

  if (!environment_handle && !sandbox_handle) {
    return false
  }

  if (!api_key || !endpoint) {
    return false
  }

  return true
}

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
  ) &
    NotificationModuleOptions
>): Promise<void> => {
  let providers = options?.providers || []

  // We add the Medusa Cloud Email provider if there is no other email provider configured
  const hasEmailProvider = options?.providers?.some((provider) =>
    provider.options?.channels?.some((channel) => channel === "email")
  )
  if (!hasEmailProvider) {
    const shouldRegisterMedusaCloudEmailProvider = validateCloudOptions(
      options?.cloud
    )

    if (shouldRegisterMedusaCloudEmailProvider) {
      await registrationFn(MedusaCloudEmailNotificationProvider, container, {
        options: options?.cloud,
        id: "cloud",
      })
      const provider = {
        id: "cloud",
        resolve: "",
        options: {
          ...options?.cloud,
          channels: ["email"],
        },
      }
      providers = [...providers, provider]
    }
  }

  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })

  await syncDatabaseProviders({
    container,
    providers: providers,
  })
}

async function syncDatabaseProviders({
  container,
  providers,
}: {
  container: any
  providers: Exclude<NotificationModuleOptions["providers"], undefined>
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

    return {
      id: provider.id,
      handle: provider.id,
      name: provider.id,
      is_enabled: true,
      channels: provider.options?.channels ?? [],
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
            is_enabled: false,
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
