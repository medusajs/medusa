import { moduleProviderLoader } from "@medusajs/modules-sdk"
import { LoaderOptions, ModuleProvider, ModulesSdkTypes } from "@medusajs/types"
import { asFunction, asValue, Lifetime } from "awilix"
import { FulfillmentIdentifiersRegistrationName } from "@types"
import { lowerCaseFirst } from "@medusajs/utils"
import { FulfillmentProviderService } from "@services"
import { ContainerRegistrationKeys } from "@medusajs/utils/src"

const registrationFn = async (klass, container, pluginOptions) => {
  Object.entries(pluginOptions.config || []).map(([name, config]) => {
    const key = FulfillmentProviderService.getRegistrationIdentifier(
      klass,
      name
    )

    container.register({
      ["fp_" + key]: asFunction((cradle) => new klass(cradle, config), {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }),
    })

    container.registerAdd(FulfillmentIdentifiersRegistrationName, asValue(key))
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

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  try {
    const providerIdentifiers: string[] = (
      container.resolve(FulfillmentIdentifiersRegistrationName) ?? []
    ).filter(Boolean)

    const providerService: ModulesSdkTypes.InternalModuleService<any> =
      container.resolve(providerServiceRegistrationKey)

    const providers = await providerService.list({
      id: providerIdentifiers,
    })

    const loadedProvidersMap = new Map(providers.map((p) => [p.id, p]))

    const providersToCreate: any[] = []
    for (const identifier of providerIdentifiers) {
      if (loadedProvidersMap.has(identifier)) {
        continue
      }

      providersToCreate.push({ id: identifier })
    }

    await providerService.create(providersToCreate)
  } catch (error) {
    logger.error(`Error syncing providers: ${error.message}`)
  }
}
