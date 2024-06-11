import { MedusaContainer, ModuleProvider } from "@medusajs/types"
import { isString, promiseAll } from "@medusajs/utils"
import { Lifetime, asFunction, asValue } from "awilix"

const defaultProviderLoader = ({
  providerPrefix, // e.g. pp_ for payment providers
  klass,
  container,
  providerOptions,
}) => {
  Object.entries(providerOptions.config || []).map(([name, config]) => {
    if (!klass.identifier) {
      throw new Error(
        `The provider ${klass.constructor.name} is missing an identifier`
      )
    }

    const key = `${providerPrefix}${klass.identifier}_${name}` // e.g. pp_stripe_blik

    container.register({
      [key]: asFunction((cradle) => new klass(cradle, config), {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }),
    })

    container.registerAdd(`${providerPrefix}_providers`, asValue(key)) // e.g. pp_providers for payment providers
  })
}

export async function moduleProviderLoader({
  container,
  providers,
  registerServiceFn,
  options = {},
}: {
  container: MedusaContainer
  providers: ModuleProvider[]
  registerServiceFn?: (
    klass,
    container: MedusaContainer,
    moduleDetails: any
  ) => Promise<void>
  options?: {
    registrationPrefix?: string
  }
}) {
  if (!providers?.length) {
    return
  }

  await promiseAll(
    providers.map(async (moduleDetails) => {
      await loadModuleProvider({
        container,
        provider: moduleDetails,
        registerServiceFn,
        options,
      })
    })
  )
}

export async function loadModuleProvider({
  container,
  provider,
  registerServiceFn,
  options,
}: {
  container: MedusaContainer
  provider: ModuleProvider
  registerServiceFn?: (klass, container, moduleDetails) => Promise<void>
  options: {
    registrationPrefix?: string
  }
}) {
  let loadedProvider: any

  const providerName = provider.resolve ?? provider.provider_name ?? ""

  try {
    loadedProvider = provider.resolve

    if (isString(provider.resolve)) {
      loadedProvider = await import(provider.resolve)
    }
  } catch (error) {
    throw new Error(
      `Unable to find provider ${providerName} -- perhaps you need to install its package?`
    )
  }

  loadedProvider = (loadedProvider as any).default ?? loadedProvider

  if (!loadedProvider?.services?.length) {
    throw new Error(
      `${provider.resolve} doesn't seem to have a main service exported -- make sure your provider package has a default export of a service.`
    )
  }

  const services = await promiseAll(
    loadedProvider.services.map(async (service) => {
      if (registerServiceFn) {
        // Used to register the specific type of service in the provider
        await registerServiceFn(service, container, provider.options)
      } else {
        defaultProviderLoader({
          providerPrefix: options.registrationPrefix || "",
          klass: service,
          container,
          providerOptions: provider.options,
        })
      }

      return service
    })
  )

  return services
}
