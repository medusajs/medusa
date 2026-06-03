import { AuthTypes, Context } from ".."

/**
 * The base interface that all MFA providers must implement. It defines the minimum
 * set of methods required to verify a multi-factor authentication code for an auth identity.
 *
 * Providers that issue and manage their own factors (such as TOTP) should implement
 * {@link AuthMfaProvider}, while providers that issue recovery codes should implement
 * {@link RecoveryCodeAuthMfaProvider}. Both of these interfaces extend `IAuthMfaProvider`.
 * 
 * @ignore
 * 
 * @since 2.15.6
 */
export interface IAuthMfaProvider {
  /**
   * The identifier of the MFA method that the provider implements, such as `totp` or `recovery_code`.
   */
  method: AuthTypes.AuthMfaChallengeMethod

  canVerifyForAuthIdentity(
    data: {
      auth_identity_id: string
    },
    sharedContext?: Context
  ): Promise<boolean>

  verify(
    data: {
      auth_identity_id: string
      code: string
    },
    sharedContext?: Context
  ): Promise<boolean>
}

/**
 * ### constructor
 *
 * The constructor allows you to access resources from the module's container using the first parameter,
 * and the provider's options using the second parameter.
 *
 * The Auth Module injects `authMfaFactorService` into your provider's container. This is the
 * data service for the `AuthMfaFactor` model, and you should store it as a class property so
 * the rest of the provider's methods can use it to retrieve and manage MFA factors (for
 * example, to look up enabled factors for an auth identity, or to create a pending factor
 * during setup).
 *
 * If you're creating a client or establishing a connection with a third-party service, do it in the constructor.
 *
 * #### Example
 *
 * ```ts
 * import { AuthMfaProvider } from "@medusajs/framework/types"
 * import { Logger, ModulesSdkTypes } from "@medusajs/framework/types"
 *
 * type InjectedDependencies = {
 *   logger: Logger
 *   authMfaFactorService: ModulesSdkTypes.IMedusaInternalService<any>
 * }
 *
 * type Options = {
 *   issuer?: string
 * }
 *
 * class MyAuthMfaProviderService implements AuthMfaProvider {
 *   static identifier = "my-mfa"
 *   readonly method = MyAuthMfaProviderService.identifier
 *
 *   protected logger_: Logger
 *   protected authMfaFactorService_: ModulesSdkTypes.IMedusaInternalService<any>
 *   protected options_: Options
 *   // assuming you're initializing a client
 *   protected client
 *
 *   constructor (
 *     { logger, authMfaFactorService }: InjectedDependencies,
 *     options: Options
 *   ) {
 *     this.logger_ = logger
 *     this.authMfaFactorService_ = authMfaFactorService
 *     this.options_ = options
 *
 *     // assuming you're initializing a client
 *     this.client = new Client(options)
 *   }
 *
 *   // ...
 * }
 *
 * export default MyAuthMfaProviderService
 * ```
 * 
 * ### Identifier
 * 
 * Every MFA auth module provider must have an `identifier` static property. The provider's ID
 * will be stored as `mfa_{identifier}`.
 * 
 * For example:
 * 
 * ```ts
 * class MyAuthMfaProviderService implements AuthMfaProvider {
 *   static identifier = "my-mfa"
 *   // ...
 * }
 * ```
 * 
 * @since 2.15.6
 */
export interface AuthMfaProvider extends IAuthMfaProvider {
  /**
   * The MFA method that the provider implements. For example, `totp`.
   */
  method: AuthTypes.AuthMfaProviderMethod

  /**
   * This method checks whether the auth identity has an enabled factor managed by this
   * provider. The Auth Module uses it to determine whether a verification attempt should
   * be routed to the provider.
   *
   * Use the injected `authMfaFactorService` to look up factors for the auth identity,
   * scoped to this provider's `method`. You can alternatively check with third-party services if the provider manages factors remotely.
   *
   * @param data - The auth identity to check.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns Whether the provider has an enabled factor for the auth identity.
   *
   * @example
   * class MyAuthMfaProvider implements AuthMfaProvider {
   *   // ...
   *   async canVerifyForAuthIdentity(
   *     data: { auth_identity_id: string },
   *     sharedContext?: Context
   *   ): Promise<boolean> {
   *     const [factor] = await this.authMfaFactorService_.list(
   *       {
   *         auth_identity_id: data.auth_identity_id,
   *         provider: this.method,
   *         status: "enabled",
   *       },
   *       { select: ["id"] },
   *       sharedContext
   *     )
   *
   *     return !!factor
   *   }
   * }
   */
  canVerifyForAuthIdentity(
    data: {
      /**
       * The ID of the auth identity to check.
       */
      auth_identity_id: string
    },
    sharedContext?: Context
  ): Promise<boolean>

  /**
   * This method verifies a code submitted during an MFA challenge against the auth identity's
   * enabled factor for this provider (for example, by checking a TOTP code against the secret
   * stored on the factor).
   *
   * Use the injected `authMfaFactorService` to retrieve the enabled factor for the auth identity,
   * then validate the code against the factor's provider-specific metadata.
   * 
   * You can alternatively verify the code with third-party services if the provider manages factors remotely.
   *
   * @param data - The auth identity and code to verify.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns Whether the code was successfully verified.
   *
   * @example
   * class MyAuthMfaProvider implements AuthMfaProvider {
   *   // ...
   *   async verify(
   *     data: { auth_identity_id: string; code: string },
   *     sharedContext?: Context
   *   ): Promise<boolean> {
   *     const [factor] = await this.authMfaFactorService_.list(
   *       {
   *         auth_identity_id: data.auth_identity_id,
   *         provider: this.method,
   *         status: "enabled",
   *       },
   *       {},
   *       sharedContext
   *     )
   *
   *     // assuming you have a `verifyCode_` method that verifies the code
   *     return factor ? this.verifyCode_(factor, data.code) : false
   *   }
   * }
   */
  verify(
    data: {
      /**
       * The ID of the auth identity to verify the code for.
       */
      auth_identity_id: string
      /**
       * The MFA code to verify.
       */
      code: string
    },
    sharedContext?: Context
  ): Promise<boolean>

  /**
   * This method initiates the MFA setup flow for an auth identity. It typically creates a
   * pending factor and returns the data the user needs in order to complete the setup, such
   * as a TOTP secret and `otpauth_url` that can be rendered as a QR code.
   *
   * The Auth Module uses this method when an auth identity starts enrolling into MFA with
   * the provider.
   * 
   * To create the factor in a pending state within Medusa, use the injected `authMfaFactorService` and
   * set the `status` of the factor to `"pending"` when creating it. You can store any provider-specific data 
   * needed for the setup in the factor's `provider_metadata`.
   * 
   * Alternatively, you can manage the entire setup flow with third-party services if the provider manages factors remotely.
   * In that case, make sure to return any data needed to complete the setup in the response, and to create a pending factor 
   * in Medusa once the setup is verified in `verifySetup`.
   *
   * @param data - The details of the MFA factor to set up.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns The data required to complete the MFA setup, including the pending factor.
   *
   * @example
   * class MyAuthMfaProvider implements AuthMfaProvider {
   *   // ...
   *   async start(
   *     data: AuthTypes.AuthMfaStartDTO,
   *     sharedContext?: Context
   *   ): Promise<AuthTypes.AuthMfaStartResponse> {
   *     const secret = this.generateSecret_()
   *     const factor = await this.authMfaFactorService_.create(
   *       {
   *         auth_identity_id: data.auth_identity_id,
   *         provider: this.method,
   *         status: "pending",
   *         provider_metadata: { secret },
   *       },
   *       sharedContext
   *     )
   *
   *     return {
   *       mfa: await this.serializeFactor_(factor),
   *       secret,
   *       otpauth_url: this.buildOtpAuthUrl_(secret, data),
   *     }
   *   }
   * }
   */
  start(
    data: AuthTypes.AuthMfaStartDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthMfaStartResponse>

  /**
   * This method verifies a code submitted during the MFA setup flow and, if valid, activates
   * the pending factor.
   *
   * The Auth Module uses this method after {@link start} to confirm that the user has correctly
   * configured their authenticator before the factor is enabled.
   * 
   * You can retrieve the pending factor created in `start` using the injected `authMfaFactorService`, 
   * verify the submitted code against the provider-specific metadata stored on the factor, and 
   * then update the factor's status to `"enabled"` if the verification is successful.
   * 
   * Alternatively, you can manage the entire setup flow with third-party services if the provider manages factors remotely.
   * In that case, make sure to verify the setup with the third-party service in this method, and to update the factor's status 
   * to `"enabled"` in Medusa once the setup is verified.
   *
   * @param data - The details of the factor and the code to verify.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns The verified (and now enabled) MFA factor.
   *
   * @example
   * class MyAuthMfaProvider implements AuthMfaProvider {
   *   // ...
   *   async verifySetup(
   *     data: AuthTypes.AuthMfaVerifyDTO,
   *     sharedContext?: Context
   *   ): Promise<AuthTypes.AuthMfaDTO> {
   *     const factor = await this.authMfaFactorService_.retrieve(
   *       data.id,
   *       {},
   *       sharedContext
   *     )
   *
   *     if (!this.verifyCode_(factor, data.code)) {
   *       throw new Error("Invalid MFA code")
   *     }
   *
   *     const enabled = await this.authMfaFactorService_.update(
   *       { id: factor.id, status: "enabled" },
   *       sharedContext
   *     )
   *
   *     return await this.serializeFactor_(enabled)
   *   }
   * }
   */
  verifySetup(
    data: AuthTypes.AuthMfaVerifyDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthMfaDTO>
}

/**
 *
 * ### constructor
 *
 * The constructor allows you to access resources from the module's container using the first parameter,
 * and the provider's options using the second parameter.
 *
 * If you're creating a client or establishing a connection with a third-party service, do it in the constructor.
 *
 * #### Example
 *
 * The Auth Module injects `authMfaRecoveryCodeService` into your provider's container. This
 * is the data service for the `AuthMfaRecoveryCode` model, and you should store it as a class
 * property so the rest of the provider's methods can use it to retrieve and manage the
 * stored recovery codes for an auth identity (for example, when generating, verifying, or
 * invalidating codes).
 *
 * ```ts
 * import { RecoveryCodeAuthMfaProvider } from "@medusajs/framework/types"
 * import { Logger, ModulesSdkTypes } from "@medusajs/framework/types"
 *
 * type InjectedDependencies = {
 *   logger: Logger
 *   authMfaRecoveryCodeService: ModulesSdkTypes.IMedusaInternalService<any>
 * }
 *
 * class MyRecoveryCodeProviderService implements RecoveryCodeAuthMfaProvider {
 *   static identifier = "recovery_code"
 *   readonly method = "recovery_code" as const
 *
 *   protected logger_: Logger
 *   protected authMfaRecoveryCodeService_: ModulesSdkTypes.IMedusaInternalService<any>
 *
 *   constructor ({
 *     logger,
 *     authMfaRecoveryCodeService,
 *   }: InjectedDependencies) {
 *     this.logger_ = logger
 *     this.authMfaRecoveryCodeService_ = authMfaRecoveryCodeService
 *   }
 *
 *   // ...
 * }
 *
 * export default MyRecoveryCodeProviderService
 * ```
 * 
 * ### Identifier
 * 
 * Every Recovery Code MFA auth module provider must have an `identifier` static property set to `recovery_code`.
 * The provider's ID will be stored as `mfa_{identifier}`.
 * 
 * For example:
 * 
 * ```ts
 * class MyRecoveryCodeProviderService implements RecoveryCodeAuthMfaProvider {
 *   static identifier = "recovery_code"
 *   // ...
 * }
 * ```
 * 
 * @since 2.15.6
 */
export interface RecoveryCodeAuthMfaProvider extends IAuthMfaProvider {
  /**
   * The identifier of the MFA method that the provider implements. For recovery code providers,
   * this is always `recovery_code`.
   */
  method: "recovery_code"

  /**
   * This method checks whether the auth identity has any recovery codes stored with this
   * provider. The Auth Module uses it to determine whether the auth identity can fall back
   * to recovery code verification.
   *
   * Use the injected `authMfaRecoveryCodeService` to look up stored recovery codes for the
   * auth identity. Alternatively, you can check with third-party services if the provider manages 
   * recovery codes remotely.
   *
   * @param data - The auth identity to check.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns Whether the auth identity has at least one recovery code stored.
   *
   * @example
   * class MyRecoveryCodeProvider implements RecoveryCodeAuthMfaProvider {
   *   // ...
   *   async canVerifyForAuthIdentity(
   *     data: { auth_identity_id: string },
   *     sharedContext?: Context
   *   ): Promise<boolean> {
   *     const [code] = await this.authMfaRecoveryCodeService_.list(
   *       { auth_identity_id: data.auth_identity_id },
   *       { select: ["id"] },
   *       sharedContext
   *     )
   *
   *     return !!code
   *   }
   * }
   */
  canVerifyForAuthIdentity(
    data: {
      /**
       * The ID of the auth identity to check.
       */
      auth_identity_id: string
    },
    sharedContext?: Context
  ): Promise<boolean>

  /**
   * This method verifies a recovery code submitted by the user. It looks up the stored hashes
   * for the auth identity, finds the one matching the submitted code, and consumes that code
   * by deleting it so it can only be used once.
   *
   * Use the injected `authMfaRecoveryCodeService` to retrieve and delete the matching recovery
   * code. Alternatively, you can verify and consume the code with third-party services if the provider manages
   * recovery codes remotely.
   *
   * @param data - The auth identity and recovery code to verify.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns Whether the recovery code was matched and consumed.
   *
   * @example
   * class MyRecoveryCodeProvider implements RecoveryCodeAuthMfaProvider {
   *   // ...
   *   async verify(
   *     data: { auth_identity_id: string; code: string },
   *     sharedContext?: Context
   *   ): Promise<boolean> {
   *     const recoveryCodes = await this.authMfaRecoveryCodeService_.list(
   *       { auth_identity_id: data.auth_identity_id },
   *       { select: ["id", "code_hash"] },
   *       sharedContext
   *     )
   *
   *     let match: (typeof recoveryCodes)[number] | undefined
   *
   *     for (const candidate of recoveryCodes) {
   *       if (await this.verifyHash_(candidate.code_hash, data.code)) {
   *         match = candidate
   *         break
   *       }
   *     }
   *
   *     if (!match) {
   *       return false
   *     }
   *
   *     // consume the code so it can't be reused
   *     await this.authMfaRecoveryCodeService_.delete(match.id, sharedContext)
   *
   *     return true
   *   }
   * }
   */
  verify(
    data: {
      /**
       * The ID of the auth identity to verify the code for.
       */
      auth_identity_id: string
      /**
       * The recovery code submitted by the user.
       */
      code: string
    },
    sharedContext?: Context
  ): Promise<boolean>

  /**
   * This method generates a new batch of recovery codes for the given auth identity. Any
   * previously generated codes for the auth identity should be invalidated, so that only the
   * latest batch can be used.
   *
   * The Auth Module uses this method when an auth identity enrolls into recovery codes, or when
   * the user requests a fresh set of codes.
   * 
   * You can use the injected `authMfaRecoveryCodeService` to store the generated codes as hashes, and 
   * to invalidate existing codes by deleting them. Alternatively, you can manage recovery codes remotely.
   *
   * @param data - The auth identity and the number of codes to generate.
   * @param sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns The generated recovery codes in plain text. These should be shown to the user only once.
   *
   * @example
   * class MyRecoveryCodeProvider implements RecoveryCodeAuthMfaProvider {
   *   // ...
   *   async generateCodes(
   *     data: { auth_identity_id: string; count: number },
   *     sharedContext?: Context
   *   ): Promise<string[]> {
   *     // invalidate any previously generated codes
   *     const existing = await this.authMfaRecoveryCodeService_.list(
   *       { auth_identity_id: data.auth_identity_id },
   *       { select: ["id"] },
   *       sharedContext
   *     )
   *
   *     if (existing.length) {
   *       await this.authMfaRecoveryCodeService_.delete(
   *         existing.map((c) => c.id),
   *         sharedContext
   *       )
   *     }
   *
   *     const codes = Array.from({ length: data.count }, () => this.generateCode_())
   *
   *     await this.authMfaRecoveryCodeService_.create(
   *       await Promise.all(
   *         codes.map(async (code) => ({
   *           auth_identity_id: data.auth_identity_id,
   *           code_hash: await this.hashCode_(code),
   *         }))
   *       ),
   *       sharedContext
   *     )
   *
   *     return codes
   *   }
   * }
   */
  generateCodes(
    data: {
      /**
       * The ID of the auth identity to generate the codes for.
       */
      auth_identity_id: string
      /**
       * The number of recovery codes to generate.
       */
      count: number
    },
    sharedContext?: Context
  ): Promise<string[]>
}
