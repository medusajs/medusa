import { moduleProviderLoader } from "@medusajs/framework/modules-sdk"
import {
  CreatePaymentProviderDTO,
  LoaderOptions,
  ModuleProvider,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { Lifetime, asFunction, asValue } from "awilix"

import { PaymentProviderService } from "@services"
import * as providers from "../providers"

const PROVIDER_REGISTRATION_KEY = "payment_providers"

const registrationFn = async (klass, container, pluginOptions) => {
  const key = `pp_${klass.PROVIDER}_${pluginOptions.id}`

  container.register({
    [key]: asFunction((cradle) => new klass(cradle, pluginOptions.options), {
      lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
    }),
  })

  container.registerAdd(PROVIDER_REGISTRATION_KEY, asValue(key))
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
    await registrationFn(provider, container, { id: "default" })
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
  const providersToLoad = container.resolve<string[]>(PROVIDER_REGISTRATION_KEY)
  const paymentProviderService = container.resolve<PaymentProviderService>(
    "paymentProviderService"
  )

  const existingProviders = await paymentProviderService.list(
    { id: providersToLoad },
    {}
  )

  const upsertData: CreatePaymentProviderDTO[] = []

  for (const { id } of existingProviders) {
    if (!providersToLoad.includes(id)) {
      upsertData.push({ id, is_enabled: false })
    }
  }

  for (const id of providersToLoad) {
    upsertData.push({ id, is_enabled: true })
  }

  await paymentProviderService.upsert(upsertData)
}
