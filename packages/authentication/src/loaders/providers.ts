import * as defaultProviders from "@providers"

import { LoaderOptions, ModulesSdkTypes } from "@medusajs/types"

import { AuthProviderService } from "@services"
import { ServiceTypes } from "@types"
import { asClass } from "awilix"

export default async ({
  container,
  options,
}: LoaderOptions<
  | ModulesSdkTypes.ModuleServiceInitializeOptions
  | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  // if(options.providers?.length) {
  // TODO: implement plugin provider registration
  // }

  const providersToLoad = Object.values(defaultProviders)

  const authProviderService: AuthProviderService = container.resolve(
    "authProviderService"
  )
  let providers

  try {
    providers = await authProviderService.list({
      provider: providersToLoad.map((p) => p.PROVIDER),
    })
  } catch (error) {
    if (error.name === "TableNotFoundException") {
      // we are running loaders in migrations (or fail at a later point)
      return
    }
  }

  const loadedProviders = new Map(providers.map((p) => [p.provider, p]))

  const providersToCreate: ServiceTypes.CreateAuthProviderDTO[] = []

  for (const provider of providersToLoad) {
    container.register({
      [`auth_provider_${provider.PROVIDER}`]: asClass(provider).singleton(),
    })

    if (loadedProviders.has(provider.PROVIDER)) {
      continue
    }

    providersToCreate.push({
      provider: provider.PROVIDER,
      name: provider.DISPLAY_NAME,
    })
  }

  await authProviderService.create(providersToCreate)
}
