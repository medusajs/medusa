import EmailPassProvider from "@medusajs/auth-emailpass"
import { moduleProviderLoader } from "@medusajs/modules-sdk"
import { LoaderOptions, ModuleProvider, ModulesSdkTypes } from "@medusajs/types"
import { AuthProviderRegistrationPrefix } from "@types"

export default async ({
  container,
  options,
}: LoaderOptions<
  (
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  ) & { providers: ModuleProvider[] }
>): Promise<void> => {
  // TODO: Temporary settings used by the starter, remove once the auth module is updated
  const isLegacyOptions =
    options?.providers?.length && !!(options?.providers[0] as any)?.name

  // Note: For now we want to inject some providers out of the box
  const providerConfig = [
    {
      resolve: EmailPassProvider,
      options: {
        config: {
          emailpass: {},
        },
      },
    },
    ...(isLegacyOptions ? [] : options?.providers ?? []),
  ]

  await moduleProviderLoader({
    container,
    providers: providerConfig,
    options: {
      registrationPrefix: AuthProviderRegistrationPrefix,
    },
  })
}
