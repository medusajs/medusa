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
    moduleDetails: any
  ) => Promise<void>
}) {
  if (!providers?.length) {
    return
  }

  await promiseAll(
    providers.map(async (moduleDetails) => {
      await loadModuleProvider(container, moduleDetails, registerServiceFn)
    })
  )
}

export async function loadModuleProvider(
  container: MedusaContainer,
  provider: ModuleProvider,
  registerServiceFn?: (klass, container, moduleDetails) => Promise<void>
) {
  let loadedProvider: any
  const moduleName = provider.resolve ?? ""

  try {
    loadedProvider = provider.resolve

    if (isString(provider.resolve)) {
      loadedProvider = await import(provider.resolve)
    }
  } catch (error) {
    throw new Error(
      `Unable to find module ${moduleName} -- perhaps you need to install its package?`
    )
  }

  loadedProvider = (loadedProvider as any).default ?? loadedProvider

  if (!loadedProvider?.services?.length) {
    throw new Error(
      `${provider.resolve} doesn't seem to have a main service exported -- make sure your module has a default export of a service.`
    )
  }

  const services = await promiseAll(
    loadedProvider.services.map(async (service) => {
      const name = lowerCaseFirst(service.name)
      if (registerServiceFn) {
        // Used to register the specific type of service in the provider
        await registerServiceFn(service, container, {
          id: provider.id,
          options: provider.options,
        })
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
