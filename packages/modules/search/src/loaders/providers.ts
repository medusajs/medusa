import { asFunction, asValue, Lifetime } from "@medusajs/framework/awilix"
import { moduleProviderLoader } from "@medusajs/framework/modules-sdk"
import { LoaderOptions } from "@medusajs/framework/types"
import { SearchProviderService } from "@services"
import {
  SearchModuleOptions,
  SearchProviderIdentifiersRegistrationName,
  SearchProviderRegistrationPrefix,
} from "@types"

const registrationFn = async (klass, container, pluginOptions) => {
  const key = SearchProviderService.getRegistrationIdentifier(
    klass,
    pluginOptions.id
  )

  container.register({
    [SearchProviderRegistrationPrefix + key]: asFunction(
      (cradle) => new klass(cradle, pluginOptions.options ?? {}),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(SearchProviderIdentifiersRegistrationName, asValue(key))
}

export default async ({
  container,
  options,
}: LoaderOptions<SearchModuleOptions>): Promise<void> => {
  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })
}
