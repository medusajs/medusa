import { moduleProviderLoader } from "@medusajs/modules-sdk"
import { LoaderOptions, ModuleProvider, ModulesSdkTypes } from "@medusajs/types"
import { PaymentProviderRegistrationPrefix } from "src/types"
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
  const paymentProviders = [
    ...(options?.providers || []),
    ...Object.values(providers),
  ] as ModuleProvider[]

  await moduleProviderLoader({
    container,
    providers: paymentProviders,
    options: {
      registrationPrefix: PaymentProviderRegistrationPrefix,
    },
  })
}
