import {
  Logger,
  ModuleProviderExports,
  ModuleServiceInitializeOptions,
} from "@medusajs/framework/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export const AuthIdentifiersRegistrationName = "auth_providers_identifier"

export const AuthProviderRegistrationPrefix = "au_"

export const AuthMfaIdentifiersRegistrationName =
  "auth_mfa_providers_identifier"

export const AuthMfaProviderRegistrationPrefix = "mfa_"

export type AuthMfaDisablePolicy = "challenge" | "session"

export type AuthModuleOptions = Partial<ModuleServiceInitializeOptions> & {
  /**
   * Providers to be registered
   */
  providers?: {
    /**
     * The module provider to be registered
     */
    resolve: string | ModuleProviderExports
    /**
     * The id of the provider
     */
    id: string
    /**
     * key value pair of the configuration to be passed to the provider constructor
     */
    options?: Record<string, unknown>
  }[]
  /**
   * Options for the default Medusa Cloud Auth provider
   * @private
   */
  cloud?: MedusaCloudAuthProviderOptions
  /**
   * MFA configuration.
   */
  mfa?: {
    /**
     * Key used to encrypt MFA secrets at rest.
     */
    encryption_key?: string
    /**
     * Number of recovery codes generated for an auth identity.
     */
    recovery_code_count?: number
    /**
     * Number of seconds an MFA challenge remains valid.
     */
    challenge_ttl_seconds?: number
    /**
     * Number of failed verification attempts allowed for an MFA challenge.
     */
    challenge_max_attempts?: number
    /**
     * Policy used when disabling MFA. Defaults to "session".
     */
    disable_policy?: AuthMfaDisablePolicy
    /**
     * Additional MFA providers to register.
     */
    providers?: {
      /**
       * The module provider to be registered
       */
      resolve?: string | ModuleProviderExports
      /**
       * The id of the provider
       */
      id: string
      /**
       * key value pair of the configuration to be passed to the provider constructor
       */
      options?: Record<string, unknown>
    }[]
  }
}

export type TotpMfaProviderOptions = {
  encryption_key?: string
  issuer?: string
  digits?: number
  period?: number
  window?: number
}

export interface MedusaCloudAuthProviderOptions {
  oauth_authorize_endpoint: string
  oauth_token_endpoint: string
  environment_handle: string
  sandbox_handle: string
  api_key: string
  callback_url: string
  disabled: boolean
}

declare module "@medusajs/types" {
  interface ModuleOptions {
    "@medusajs/auth": AuthModuleOptions
    "@medusajs/medusa/auth": AuthModuleOptions
  }
}
