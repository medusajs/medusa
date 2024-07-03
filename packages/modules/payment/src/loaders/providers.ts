import { moduleProviderLoader } from "@medusajs/modules-sdk"
import {
  CreatePaymentProviderDTO,
  LoaderOptions,
  ModuleProvider,
  ModulesSdkTypes,
} from "@medusajs/types"
import { Lifetime, asFunction, asValue } from "awilix"

import * as providers from "../providers"
import { PaymentProviderService } from "@services"

const registrationFn = async (klass, container, pluginOptions) => {
  Object.entries(pluginOptions.config || []).map(([name, config]) => {
    const key = `pp_${klass.PROVIDER}_${name}`

    container.register({
      [key]: asFunction((cradle) => new klass(cradle, config), {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }),
    })

    container.registerAdd("payment_providers", asValue(key))
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
  // Local providers
  for (const provider of Object.values(providers)) {
    await registrationFn(provider, container, { config: { default: {} } })
  }

  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })

  await registerProvidersInDb({ container })
}

const registerProvidersInDb = async ({
  container,
}: LoaderOptions): Promise<void> => {
  const providersToLoad = container.resolve<string[]>("payment_providers")
  const paymentProviderService = container.resolve<PaymentProviderService>(
    "paymentProviderService"
  )

  const providers = await paymentProviderService.list({
    id: providersToLoad,
  })

  const loadedProvidersMap = new Map(providers.map((p) => [p.id, p]))

  const providersToCreate: CreatePaymentProviderDTO[] = []
  for (const id of providersToLoad) {
    if (loadedProvidersMap.has(id)) {
      continue
    }

    providersToCreate.push({ id })
  }

  await paymentProviderService.create(providersToCreate)
}
