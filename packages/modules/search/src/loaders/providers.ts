import { asFunction, asValue, Lifetime } from "@medusajs/framework/awilix"
import { moduleProviderLoader } from "@medusajs/framework/modules-sdk"
import { LoaderOptions } from "@medusajs/framework/types"
import { SearchProviderService } from "@services"
import {
  SearchModuleOptions,
  SearchProviderIdentifiersRegistrationName,
  SearchProviderRegistrationPrefix,
} from "@types"
import { MedusaSearchService } from "../providers"

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
  const { api_key, endpoint, environment_handle } = options?.cloud ?? {}

  // Register Medusa Cloud search when cloud options are present, same pattern
  // as payment's Medusa Payments and notification's cloud email.
  if (api_key && endpoint && environment_handle) {
    await registrationFn(MedusaSearchService, container, {
      options: {
        api_key,
        endpoint,
        environment_handle,
      },
      id: "default",
    })
  }

  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })
}
