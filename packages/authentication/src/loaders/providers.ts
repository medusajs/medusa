import { LoaderOptions, ModulesSdkTypes } from "@medusajs/types"
import { asClass } from "awilix"
import * as defaultProviders from "@providers"
import { AuthProviderService } from "@services"
import { ServiceTypes } from "@types"

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

  const authProviderService: AuthProviderService =
    container.cradle["authProviderService"]

  const providers = await authProviderService.list({
    provider: providersToLoad.map((p) => p.PROVIDER),
  })

  const loadedProviders = new Map(providers.map((p) => [p.provider, p]))

  const providersToCreate: ServiceTypes.CreateAuthProviderDTO[] = []

  for (const provider of providersToLoad) {
    container.registerAdd("providers", asClass(provider).singleton())

    container.register({
      [`provider_${provider.PROVIDER}`]: asClass(provider).singleton(),
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
