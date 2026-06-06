import { moduleProviderLoader } from "@zjedene-medusa/framework/modules-sdk"
import {
  LoaderOptions,
  ModuleProvider,
  ModulesSdkTypes,
} from "@zjedene-medusa/framework/types"
import { asFunction, asValue, Lifetime } from "@zjedene-medusa/framework/awilix"
import ProviderService, {
  AnalyticsProviderIdentifierRegistrationName,
  AnalyticsProviderRegistrationPrefix,
} from "../services/provider-service"

const registrationFn = async (klass, container, pluginOptions) => {
  const key = ProviderService.getRegistrationIdentifier(klass, pluginOptions.id)

  container.register({
    [AnalyticsProviderRegistrationPrefix + key]: asFunction(
      (cradle) => new klass(cradle, pluginOptions.options ?? {}),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(
    AnalyticsProviderIdentifierRegistrationName,
    asValue(key)
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
  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })
}
