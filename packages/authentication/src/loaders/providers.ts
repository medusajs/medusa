import * as defaultProviders from "@providers"

import {
  AwilixContainer,
  ClassOrFunctionReturning,
  Constructor,
  Resolver,
  asClass,
} from "awilix"
import { LoaderOptions, ModulesSdkTypes } from "@medusajs/types"

export default async ({
  container,
}: LoaderOptions<
  | ModulesSdkTypes.ModuleServiceInitializeOptions
  | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  // if(options.providers?.length) {
  // TODO: implement plugin provider registration
  // }

  const providersToLoad = Object.values(defaultProviders)

  for (const provider of providersToLoad) {
    container.register({
      [`auth_provider_${provider.PROVIDER}`]: asClass(
        provider as Constructor<any>
      ).singleton(),
    })
  }

  container.register({
    [`auth_providers`]: asArray(providersToLoad),
  })
}

function asArray(
  resolvers: (ClassOrFunctionReturning<unknown> | Resolver<unknown>)[]
): { resolve: (container: AwilixContainer) => unknown[] } {
  return {
    resolve: (container: AwilixContainer) =>
      resolvers.map((resolver) => container.build(resolver)),
  }
}
