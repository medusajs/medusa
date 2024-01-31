import { MedusaContainer } from "@medusajs/types"
import { promiseAll } from "@medusajs/utils"
import { Lifetime, asFunction } from "awilix"

type PluginDetails = {
  resolve: string
  name: string
  id: string
  options: Record<string, unknown>
  version: string
}

export async function moduleProviderLoader({
  container,
  providers,
  registerServiceFn,
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
  plugin: PluginDetails,
  registerServiceFn?: (klass, container, pluginDetails) => Promise<void>
) {
  let loadedProvider: any
  const loadedProviders = new Map<string, any>()

  if (loadedProviders.has(plugin.resolve)) {
    loadedProvider = loadedProviders.get(plugin.resolve)
  } else {
    try {
      const path = plugin.resolve
      loadedProvider = await import(path)
      loadedProvider = (loadedProvider as any).default
      loadedProviders.set(path, loadedProvider)
    } catch (error) {
      throw new Error(
        `Unable to find plugin "${plugin.resolve}". Perhaps you need to install its package?`
      )
    }
  }

  if (!loadedProvider?.services) {
    throw new Error(
      `No services found in plugin "${plugin.resolve}". Make sure your plugin exports a service.`
    )
  }

  const services = await promiseAll(
    loadedProvider.services.map(async (service) => {
      if (registerServiceFn) {
        // Used to register the specific type of service in the provider
        await registerServiceFn(service, container, plugin.options)
      } else {
        container.register({
          [service.name]: asFunction(
            (cradle) => new service(cradle, plugin.options),
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
