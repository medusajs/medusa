import { moduleProviderLoader } from "@zjedene-medusa/framework/modules-sdk"

import {
  CreateTaxProviderDTO,
  LoaderOptions,
  ModuleProvider,
  ModulesSdkTypes,
} from "@zjedene-medusa/framework/types"
import { asFunction, asValue, Lifetime } from "@zjedene-medusa/framework/awilix"

import { MedusaError } from "@zjedene-medusa/framework/utils"
import * as providers from "../providers"
import TaxProviderService from "../services/tax-provider"

const PROVIDER_REGISTRATION_KEY = "tax_providers" as const

const registrationFn = async (klass, container, pluginOptions) => {
  if (!klass?.identifier) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Trying to register a tax provider without a provider identifier.`
    )
  }

  const key = `tp_${klass.identifier}${
    pluginOptions.id ? `_${pluginOptions.id}` : ""
  }`

  container.register({
    [key]: asFunction((cradle) => new klass(cradle, pluginOptions.options), {
      lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
    }),
  })

  container.registerAdd(PROVIDER_REGISTRATION_KEY, asValue(key))
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
  // Local providers
  for (const provider of Object.values(providers)) {
    await registrationFn(provider, container, {})
  }

  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })

  await registerProvidersInDb({ container })
}

const registerProvidersInDb = async ({
  container,
}: LoaderOptions): Promise<void> => {
  const providersToLoad = container.resolve<string[]>(PROVIDER_REGISTRATION_KEY)
  const taxProviderService =
    container.resolve<TaxProviderService>("taxProviderService")

  const existingProviders = await taxProviderService.list(
    { id: providersToLoad },
    {}
  )

  const upsertData: CreateTaxProviderDTO[] = []

  for (const { id } of existingProviders) {
    if (!providersToLoad.includes(id)) {
      upsertData.push({ id, is_enabled: false })
    }
  }

  for (const id of providersToLoad) {
    upsertData.push({ id, is_enabled: true })
  }

  await taxProviderService.upsert(upsertData)
}
