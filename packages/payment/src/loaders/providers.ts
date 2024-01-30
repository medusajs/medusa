import {
  AbstractPaymentProcessor,
  moduleProviderLoader,
} from "@medusajs/medusa"

import { LoaderOptions, ModulesSdkTypes } from "@medusajs/types"
import { Lifetime, asFunction } from "awilix"

type PaymentModuleProviders = {
  providers: {
    resolve: string
    provider_id: string // e.g. stripe-usd
    options: Record<string, unknown>
  }[]
}

const loadPaymentProviderService = async (klass, container, pluginOptions) => {
  if (!AbstractPaymentProcessor.isPaymentProcessor(klass.prototype)) {
    return
  }

  container.register({
    [`payment_provider_${klass.prototype}`]: asFunction(
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
  ) &
    PaymentModuleProviders
>): Promise<void> => {
  await moduleProviderLoader({
    container,
    providers: options!.providers,
    registerServiceFn: loadPaymentProviderService,
  })
}
