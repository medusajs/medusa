import { asFunction, asValue, Lifetime } from "@medusajs/framework/awilix"
import { moduleProviderLoader } from "@medusajs/framework/modules-sdk"
import {
  LoaderOptions,
  ModuleProviderExports,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  AuthIdentifiersRegistrationName,
  AuthMfaIdentifiersRegistrationName,
  AuthMfaProviderRegistrationPrefix,
  AuthModuleOptions,
  AuthProviderRegistrationPrefix,
  AuthVerificationIdentifiersRegistrationName,
  AuthVerificationProviderRegistrationPrefix,
  TotpMfaProviderOptions,
  TokenVerificationProviderOptions,
} from "@types"
import { RecoveryCodeMfaProvider } from "../providers/mfa/recovery-code"
import { TotpMfaProvider } from "../providers/mfa/totp"
import { TokenVerificationProvider } from "../providers/verification/token"
import { MedusaCloudAuthService } from "../providers/medusa-cloud-auth"

const validateCloudOptions = (options: AuthModuleOptions["cloud"]) => {
  const {
    oauth_authorize_endpoint,
    oauth_token_endpoint,
    oauth_audience,
    environment_handle,
    sandbox_handle,
    api_key,
    callback_url,
  } = options ?? {}

  if (!environment_handle && !sandbox_handle) {
    return false
  }

  if (
    !oauth_authorize_endpoint ||
    !oauth_token_endpoint ||
    !oauth_audience ||
    !api_key ||
    !callback_url
  ) {
    return false
  }

  return true
}

const registrationFn = async (klass, container, pluginOptions) => {
  container.register({
    [AuthProviderRegistrationPrefix + pluginOptions.id]: asFunction(
      (cradle) => new klass(cradle, pluginOptions.options ?? {}),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(
    AuthIdentifiersRegistrationName,
    asValue(pluginOptions.id)
  )
}

const mfaRegistrationFn = async (klass, container, pluginOptions) => {
  if (!klass?.identifier) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Trying to register an MFA provider without a provider identifier.`
    )
  }

  const id = pluginOptions.id ?? klass.identifier
  const key = AuthMfaProviderRegistrationPrefix + id

  container.register({
    [key]: asFunction(
      (cradle) => new klass(cradle, pluginOptions.options ?? {}),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(AuthMfaIdentifiersRegistrationName, asValue(id))
}

const verificationRegistrationFn = async (klass, container, pluginOptions) => {
  if (!klass?.identifier) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Trying to register a verification provider without a provider identifier.`
    )
  }

  const id = pluginOptions.id ?? klass.identifier
  const key = AuthVerificationProviderRegistrationPrefix + id

  container.register({
    [key]: asFunction(
      (cradle) => new klass(cradle, pluginOptions.options ?? {}),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(AuthVerificationIdentifiersRegistrationName, asValue(id))
}

const getMfaProviderOptions = (
  options: AuthModuleOptions | undefined,
  id: string
): Record<string, unknown> | undefined => {
  return options?.mfa?.providers?.find((provider) => provider.id === id)
    ?.options
}

const getVerificationProviderOptions = (
  options: AuthModuleOptions | undefined,
  id: string
): Record<string, unknown> | undefined => {
  return options?.verification?.providers?.find((provider) => provider.id === id)
    ?.options
}

type MfaProviderConfig = NonNullable<
  NonNullable<AuthModuleOptions["mfa"]>["providers"]
>[number]

type VerificationProviderConfig = NonNullable<
  NonNullable<AuthModuleOptions["verification"]>["providers"]
>[number]

const hasProviderResolver = <T extends { resolve?: unknown }>(
  provider: T
): provider is T & {
  resolve: string | ModuleProviderExports
} => {
  return !!provider.resolve
}

const validateMfaProviderConfigs = (
  providers: MfaProviderConfig[] = []
): void => {
  const configurableProviderIds = new Set([TotpMfaProvider.identifier])
  const invalidProvider = providers.find(
    (provider) => !provider.resolve && !configurableProviderIds.has(provider.id)
  )

  if (invalidProvider) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `MFA provider "${invalidProvider.id}" must include a provider resolver.`
    )
  }
}

const validateVerificationProviderConfigs = (
  providers: VerificationProviderConfig[] = []
): void => {
  const configurableProviderIds = new Set([TokenVerificationProvider.identifier])
  const invalidProvider = providers.find(
    (provider) =>
      !provider.resolve && !configurableProviderIds.has(provider.id)
  )

  if (invalidProvider) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      `Verification provider "${invalidProvider.id}" must include a provider resolver.`
    )
  }
}

export default async ({
  container,
  options,
}: LoaderOptions<
  (
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  ) &
    AuthModuleOptions
>): Promise<void> => {
  validateMfaProviderConfigs(options?.mfa?.providers)
  validateVerificationProviderConfigs(options?.verification?.providers)

  const totpOptions = getMfaProviderOptions(
    options,
    TotpMfaProvider.identifier
  ) as TotpMfaProviderOptions | undefined

  await mfaRegistrationFn(TotpMfaProvider, container, {
    options: {
      encryption_key: options?.mfa?.encryption_key,
      ...(totpOptions ?? {}),
    },
    id: TotpMfaProvider.identifier,
  })
  await mfaRegistrationFn(RecoveryCodeMfaProvider, container, {
    options: options?.mfa,
    id: RecoveryCodeMfaProvider.identifier,
  })

  await moduleProviderLoader({
    container,
    providers: (options?.mfa?.providers || []).filter(hasProviderResolver),
    registerServiceFn: mfaRegistrationFn,
  })

  const tokenOptions = getVerificationProviderOptions(
    options,
    TokenVerificationProvider.identifier
  ) as TokenVerificationProviderOptions | undefined

  await verificationRegistrationFn(TokenVerificationProvider, container, {
    options: tokenOptions ?? {},
    id: TokenVerificationProvider.identifier,
  })

  await moduleProviderLoader({
    container,
    providers: (options?.verification?.providers || []).filter(
      hasProviderResolver
    ),
    registerServiceFn: verificationRegistrationFn,
  })

  if (validateCloudOptions(options?.cloud) && !options?.cloud?.disabled) {
    await registrationFn(MedusaCloudAuthService, container, {
      options: options?.cloud,
      id: "cloud",
    })
  }

  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })
}
