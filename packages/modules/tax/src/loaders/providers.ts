import { moduleProviderLoader } from "@medusajs/modules-sdk"
import { LoaderOptions, ModuleProvider, ModulesSdkTypes } from "@medusajs/types"
import { TaxProviderRegistrationPrefix } from "@types"
import * as providers from "../providers"

export default async ({
  container,
  options,
}: LoaderOptions<
  (
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  ) & { providers: ModuleProvider[] }
>): Promise<void> => {
  const taxProviders = [
    ...(options?.providers || []),
    ...Object.values(providers),
  ] as ModuleProvider[]

  await moduleProviderLoader({
    container,
    providers: taxProviders,
    options: {
      registrationPrefix: TaxProviderRegistrationPrefix,
    },
  })
}
