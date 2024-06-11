import { moduleProviderLoader } from "@medusajs/modules-sdk"
import { LoaderOptions, ModuleProvider, ModulesSdkTypes } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  lowerCaseFirst,
  promiseAll,
} from "@medusajs/utils"
import { FulfillmentProviderService } from "@services"
import { FulfillmentIdentifiersRegistrationName } from "@types"

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
    options: {
      registrationPrefix: "fp_",
    },
  })

  await syncDatabaseProviders({
    container,
  })
}

async function syncDatabaseProviders({ container }) {
  const providerServiceRegistrationKey = lowerCaseFirst(
    FulfillmentProviderService.name
  )

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER) ?? console

  try {
    const providerIdentifiers: string[] = (
      container.resolve(FulfillmentIdentifiersRegistrationName) ?? []
    ).filter(Boolean)

    const providerService: ModulesSdkTypes.InternalModuleService<any> =
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
