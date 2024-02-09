import { moduleProviderLoader } from "@medusajs/modules-sdk"

import {
  CreatePaymentProviderDTO,
  LoaderOptions,
  ModuleProvider,
  ModulesSdkTypes,
} from "@medusajs/types"
import { Lifetime, asFunction } from "awilix"

import * as providers from "../providers"

const registrationFn = async (klass, container, pluginOptions) => {
  container.register({
    [`pp_${klass.identifier}`]: asFunction(
      (cradle) => new klass(cradle, pluginOptions),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(
    "payment_providers",
    asFunction((cradle) => new klass(cradle, pluginOptions), {
      lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
    })
  )
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
  const pluginProviders =
    options?.providers?.filter((provider) => provider.resolve) || []

  // Local providers
  for (const provider of Object.values(providers)) {
    // TODO: pass options
    await registrationFn(provider, container, {})
  }

  await moduleProviderLoader({
    container,
    providers: pluginProviders,
    registerServiceFn: registrationFn,
  })

  // TODO: temp impl. until  #6311

  const providersToLoad = container["payment_providers"]
  const paymentProviderService = container["paymentProviderService"]

  const providers_ = await paymentProviderService.list({
    // @ts-ignore TODO
    id: providersToLoad.map((p) => p.getIdentifier()),
  })

  const loadedProvidersMap = new Map(providers_.map((p) => [p.id, p]))
  const providersToCreate: CreatePaymentProviderDTO[] = []

  for (const provider of providersToLoad) {
    if (loadedProvidersMap.has(provider.getIdentifier())) {
      continue
    }

    providersToCreate.push({
      id: provider.getIdentifier(),
    })
  }

  await paymentProviderService.create(providersToCreate)
}
