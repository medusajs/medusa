import { moduleProviderLoader } from "@medusajs/modules-sdk"
import { LoaderOptions, ModuleProvider, ModulesSdkTypes } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  lowerCaseFirst,
  promiseAll,
} from "@medusajs/utils"
import { FulfillmentProviderService } from "@services"
import { FulfillmentIdentifiersRegistrationName } from "@types"
import { Lifetime, asFunction, asValue } from "awilix"

const registrationFn = async (klass, container, pluginOptions) => {
  const key = FulfillmentProviderService.getRegistrationIdentifier(
    klass,
    pluginOptions.id
  )

  container.register({
    ["fp_" + key]: asFunction(
      (cradle) => new klass(cradle, pluginOptions.options),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(FulfillmentIdentifiersRegistrationName, asValue(key))
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
  container.registerAdd(
    FulfillmentIdentifiersRegistrationName,
    asValue(undefined)
  )

  // Local providers
  // TODO

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
    FulfillmentProviderService.name
  )

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER) ?? console

  try {
    const providerIdentifiers: string[] = (
      container.resolve(FulfillmentIdentifiersRegistrationName) ?? []
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
