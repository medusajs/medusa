import { moduleProviderLoader } from "@medusajs/modules-sdk"
import { LoaderOptions, ModuleProvider, ModulesSdkTypes } from "@medusajs/types"
import { FileProviderService } from "@services"
import {
  FileProviderIdentifierRegistrationName,
  FileProviderRegistrationPrefix,
} from "@types"
import { Lifetime, asFunction, asValue } from "awilix"

const registrationFn = async (klass, container, pluginOptions) => {
  Object.entries(pluginOptions.config || []).map(([name, config]) => {
    const key = FileProviderService.getRegistrationIdentifier(klass, name)

    container.register({
      [FileProviderRegistrationPrefix + key]: asFunction(
        (cradle) => new klass(cradle, config),
        {
          lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
        }
      ),
    })

    container.registerAdd(FileProviderIdentifierRegistrationName, asValue(key))
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
  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })
}
