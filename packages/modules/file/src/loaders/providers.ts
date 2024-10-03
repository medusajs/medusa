import { moduleProviderLoader } from "@medusajs/framework/modules-sdk"
import {
  LoaderOptions,
  ModuleProvider,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { FileProviderService } from "@services"
import {
  FileProviderIdentifierRegistrationName,
  FileProviderRegistrationPrefix,
} from "@types"
import { asFunction, asValue, Lifetime } from "awilix"

const registrationFn = async (klass, container, pluginOptions) => {
  const key = FileProviderService.getRegistrationIdentifier(
    klass,
    pluginOptions.id
  )

  container.register({
    [FileProviderRegistrationPrefix + key]: asFunction(
      (cradle) => new klass(cradle, pluginOptions.options ?? {}),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(FileProviderIdentifierRegistrationName, asValue(key))
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
