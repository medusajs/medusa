import * as defaultProviders from "@providers"

import {
  AuthModuleProviderConfig,
  AuthProviderScope,
  LoaderOptions,
  ModulesSdkTypes,
} from "@medusajs/types"
import {
  AwilixContainer,
  ClassOrFunctionReturning,
  Constructor,
  Resolver,
  asClass,
} from "awilix"

type AuthModuleProviders = {
  providers: AuthModuleProviderConfig[]
}

export default async ({
  container,
  options,
}: LoaderOptions<
  (
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  ) &
    AuthModuleProviders
>): Promise<void> => {
  const providerMap = new Map(
    options?.providers?.map((provider) => [provider.name, provider.scopes]) ??
      []
  )

  // if(options?.providers?.length) {
  // TODO: implement plugin provider registration
  // }

  const providersToLoad = Object.values(defaultProviders)

  for (const provider of providersToLoad) {
    container.register({
      [`auth_provider_${provider.PROVIDER}`]: asClass(
        provider as Constructor<any>
      )
        .singleton()
        .inject(() => ({ scopes: providerMap.get(provider.PROVIDER) ?? {} })),
    })
  }

  container.register({
    [`auth_providers`]: asArray(providersToLoad, providerMap),
  })
}

function asArray(
  resolvers: (ClassOrFunctionReturning<unknown> | Resolver<unknown>)[],
  providerScopeMap: Map<string, Record<string, AuthProviderScope>>
): { resolve: (container: AwilixContainer) => unknown[] } {
  return {
    resolve: (container: AwilixContainer) =>
      resolvers.map((resolver) =>
        asClass(resolver as Constructor<any>)
          .inject(() => ({
            // @ts-ignore
            scopes: providerScopeMap.get(resolver.PROVIDER) ?? {},
          }))
          .resolve(container)
      ),
  }
}
