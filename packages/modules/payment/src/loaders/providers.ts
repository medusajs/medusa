import { asFunction, asValue, Lifetime } from "@zjedene-medusa/framework/awilix"
import { moduleProviderLoader } from "@zjedene-medusa/framework/modules-sdk"
import {
  CreatePaymentProviderDTO,
  LoaderOptions,
  ModuleProvider,
  ModulesSdkTypes,
} from "@zjedene-medusa/framework/types"
import { MedusaError } from "@zjedene-medusa/framework/utils"

import { PaymentProviderService } from "@services"
import * as providers from "../providers"

const PROVIDER_REGISTRATION_KEY = "payment_providers"

const registrationFn = async (klass, container, pluginOptions) => {
  if (!klass?.identifier) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Trying to register a payment provider without a provider identifier.`
    )
  }

  const key = `pp_${klass.identifier}${
    pluginOptions.id ? `_${pluginOptions.id}` : ""
  }`

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
  ) & {
    providers: ModuleProvider[]
    cloud: {
      api_key?: string
      endpoint?: string
      environment_handle?: string
      sandbox_handle?: string
      webhook_secret?: string
    }
  }
>): Promise<void> => {
  await registrationFn(providers.SystemPaymentProvider, container, {
    id: "default",
  })

  // We only want to register medusa payments if the options for it have been provided.
  const {
    api_key,
    endpoint,
    environment_handle,
    sandbox_handle,
    webhook_secret,
  } = options?.cloud ?? {}

  if (
    api_key &&
    endpoint &&
    webhook_secret &&
    (environment_handle || sandbox_handle)
  ) {
    await registrationFn(providers.MedusaPaymentsProvider, container, {
      options: {
        api_key,
        endpoint,
        environment_handle,
        sandbox_handle,
        webhook_secret,
      },
      id: "default",
    })
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
