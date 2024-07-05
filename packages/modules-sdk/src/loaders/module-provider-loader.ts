import { MedusaContainer, ModuleProvider } from "@medusajs/types"
import { isString, lowerCaseFirst, promiseAll } from "@medusajs/utils"
import { Lifetime, asFunction } from "awilix"

export async function moduleProviderLoader({
  container,
  providers,
  registerServiceFn,
}: {
  container: MedusaContainer
  providers: ModuleProvider[]
  registerServiceFn?: (
    klass,
    container: MedusaContainer,
    pluginDetails: any
  ) => Promise<void>
}) {
  if (!providers?.length) {
    return
  }

  await promiseAll(
    providers.map(async (pluginDetails) => {
      await loadModuleProvider(container, pluginDetails, registerServiceFn)
    })
  )
}

export async function loadModuleProvider(
  container: MedusaContainer,
  provider: ModuleProvider,
  registerServiceFn?: (klass, container, pluginDetails) => Promise<void>
) {
  let loadedProvider: any

  const pluginName = provider.resolve ?? provider.provider_name ?? ""

  try {
    loadedProvider = provider.resolve

    if (isString(provider.resolve)) {
      loadedProvider = await import(provider.resolve)
    }
  } catch (error) {
    throw new Error(
      `Unable to find plugin ${pluginName} -- perhaps you need to install its package?`
    )
  }

  loadedProvider = (loadedProvider as any).default ?? loadedProvider

  if (!loadedProvider?.services?.length) {
    throw new Error(
      `No services found in plugin ${provider.resolve} -- make sure your plugin has a default export of services.`
    )
  }

  const services = await promiseAll(
    loadedProvider.services.map(async (service) => {
      const name = lowerCaseFirst(service.name)
      if (registerServiceFn) {
        // Used to register the specific type of service in the provider
        await registerServiceFn(service, container, provider.options)
      } else {
        container.register({
          [name]: asFunction(
            (cradle) => new service(cradle, provider.options),
            {
              lifetime: service.LIFE_TIME || Lifetime.SCOPED,
            }
          ),
        })
      }

      return service
    })
  )

  return services
}
