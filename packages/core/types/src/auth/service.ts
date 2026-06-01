import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthMfaChallengeDTO,
  AuthMfaDTO,
  AuthMfaSelector,
  AuthMfaStartResponse,
  AuthIdentityDTO,
  UseAuthMfaRecoveryCodeDTO,
  CreateAuthIdentityDTO,
  CreateAuthMfaChallengeDTO,
  AuthMfaStartDTO,
  CreateProviderIdentityDTO,
  DisableAuthMfaDTO,
  FilterableAuthIdentityProps,
  FilterableAuthMfaProps,
  FilterableProviderIdentityProps,
  GenerateAuthMfaRecoveryCodesDTO,
  GenerateAuthMfaRecoveryCodesResponse,
  ProviderIdentityDTO,
  UpdateAuthIdentityDTO,
  UpdateProviderIdentityDTO,
  VerifyAuthMfaChallengeDTO,
  AuthMfaVerifyDTO,
  ConfirmAuthVerificationDTO,
  ConfirmAuthVerificationResponse,
  CreateAuthVerificationTokenDTO,
  CreateAuthVerificationTokenResponse,
  RequestAuthVerificationDTO,
  RequestAuthVerificationResponse,
} from "./common"

/**
 * The main service interface for the Auth Module.
 */
export interface IAuthModuleService extends IModuleService {
  /**
   * This method is used to authenticate a user using a provider. The `authenticate` method of the
   * underlying provider is called, passing it the `providerData` parameter as a parameter. The method
   * returns the data returned by the provider.
   *
   * Refer to [this guide](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route) to learn more about the authentication flows.
   *
   * @param {string} provider - The ID of the provider to authenticate the user with.
   * @param {AuthenticationInput} providerData - The data to pass to the provider to authenticate the user.
   * @returns {Promise<AuthenticationResponse>} The details of the authentication result.
   *
   * @example
   * The following example is in the context of an API route, where
   * `req` is an instance of the `MedusaRequest` object:
   *
   * ```ts
   * const { success, authIdentity, location, error } =
   *   await authModuleService.authenticate("emailpass", {
   *     url: req.url,
   *     headers: req.headers,
   *     query: req.query,
   *     body: req.body,
   *     protocol: req.protocol,
   *   } as AuthenticationInput)
   * ```
   */
  authenticate(
    provider: string,
    providerData: AuthenticationInput
  ): Promise<AuthenticationResponse>

  /**
   * This method is used to register a user using a provider. The `register` method of the
   * underlying provider is called, passing it the `providerData` parameter as a parameter. The method
   * returns the data returned by the provider.
   *
   * Refer to [this guide](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route) to learn more about the authentication flows.
   *
   * @param {string} provider - The ID of the provider to register the user with.
   * @param {AuthenticationInput} providerData - The data to pass to the provider to register the user.
   * @returns {Promise<AuthenticationResponse>} The details of the registration result.
   *
   * @example
   * The following example is in the context of an API route, where
   * `req` is an instance of the `MedusaRequest` object:
   *
   * ```ts
   * const { success, authIdentity, location, error } =
   *   await authModuleService.register("emailpass", {
   *     url: req.url,
   *     headers: req.headers,
   *     query: req.query,
   *     body: req.body,
   *     protocol: req.protocol,
   *   } as AuthenticationInput)
   * ```
   */
  register(
    provider: string,
    providerData: AuthenticationInput
  ): Promise<AuthenticationResponse>

  /**
   * This method updates an auth identity's details using the provider that created it. It uses the `update` method of the
   * underlying provider, passing it the `providerData` parameter as a parameter. The method
   * returns the data returned by the provider.
   *
   * @param {string} provider - The ID of the provider to update the auth identity with.
   * @param {Record<string, unknown>} providerData - The data to pass to the provider to update the auth identity.
   * @returns {Promise<AuthenticationResponse>} The details of the update result.
   *
   * @example
   * The following example is in the context of an API route, where
   * `req` is an instance of the `MedusaRequest` object:
   *
   * ```ts
   * const { success, authIdentity, location, error } =
   *   await authModuleService.updateProvider("emailpass", {
   *     email: "user@example.com",
   *     password: "password",
   *     // The ID of a user, customer, or custom actor type that is being updated.
   *     // For example, `user_123`.
   *     entity_id: req.auth_context.actor_id,
   *   })
   * ```
   */
  updateProvider(
    provider: string,
    providerData: Record<string, unknown>
  ): Promise<AuthenticationResponse>

  /**
   * When authenticating users with a third-party provider, such as Google, the user performs an
   * action to finish the authentication, such as enter their credentials in Google's sign-in
   * form.
   *
   * In those cases, you must create an API route or endpoint that's called by the third-party
   * provider when the user finishes performing the required action.
   *
   * In that API route, you can call this method to validate the third-party provider's
   * callback and authenticate the user.
   *
   * Learn more about this authentication flow in [this guide](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route#2-third-party-service-authenticate-flow).
   *
   * @param {string} provider - The ID of the provider to use to validate the callback.
   * @param {AuthenticationInput} providerData - The data to pass to the provider to validate the callback.
   * @returns {Promise<AuthenticationResponse>} The details of the authentication result.
   *
   * @example
   * The following example is in the context of an API route, where
   * `req` is an instance of the `MedusaRequest` object:
   *
   * ```ts
   * const { success, authIdentity, error } =
   *   await authModuleService.validateCallback("google", {
   *     url: req.url,
   *     headers: req.headers,
   *     query: req.query,
   *     body: req.body,
   *     protocol: req.protocol,
   *   } as AuthenticationInput)
   * ```
   *
   */
  validateCallback(
    provider: string,
    providerData: AuthenticationInput
  ): Promise<AuthenticationResponse>

  /**
   * This method starts multi-factor authentication (MFA) setup for an auth identity using the requested provider.
   *
   * @param {AuthMfaStartDTO} data - The data required to start multi-factor authentication (MFA) setup.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthMfaStartResponse>} The multi-factor authentication (MFA) setup response containing the configuration and setup details.
   * @since 2.15.3
   *
   * @example
   * ```ts
   * const mfaSetup = await authModuleService.startAuthMfa({
   *   auth_identity_id: "authusr_123",
   *   provider: "totp",
   *   label: "My App",
   *   issuer: "MyCompany"
   * })
   * ```
   */
  startAuthMfa(
    data: AuthMfaStartDTO,
    sharedContext?: Context
  ): Promise<AuthMfaStartResponse>

  /**
   * This method verifies a pending multi-factor authentication (MFA) setup.
   *
   * @param {AuthMfaVerifyDTO} data - The verification data including multi-factor authentication (MFA) configuration ID and code.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthMfaDTO>} The verified and enabled multi-factor authentication (MFA) configuration.
   * @since 2.15.3
   *
   * @example
   * ```ts
   * const mfaConfig = await authModuleService.verifyAuthMfa({
   *   id: "mfa_123",
   *   code: "123456"
   * })
   * ```
   */
  verifyAuthMfa(
    data: AuthMfaVerifyDTO,
    sharedContext?: Context
  ): Promise<AuthMfaDTO>

  /**
   * This method creates a multi-factor authentication (MFA) challenge for an auth identity with enabled multi-factor authentication (MFA) methods.
   *
   * @param {CreateAuthMfaChallengeDTO} data - The data required to create a multi-factor authentication (MFA) challenge.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthMfaChallengeDTO>} The created multi-factor authentication (MFA) challenge.
   * @since 2.15.3
   *
   * @example
   * ```ts
   * const challenge = await authModuleService.createAuthMfaChallenge({
   *   auth_identity_id: "authusr_123",
   *   actor_type: "user"
   * })
   * ```
   */
  createAuthMfaChallenge(
    data: CreateAuthMfaChallengeDTO,
    sharedContext?: Context
  ): Promise<AuthMfaChallengeDTO>

  /**
   * This method verifies a multi-factor authentication (MFA) challenge with one of the challenge's methods.
   *
   * @param {VerifyAuthMfaChallengeDTO} data - The verification data including challenge ID, method, and code.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthMfaChallengeDTO>} The completed multi-factor authentication (MFA) challenge.
   * @since 2.15.3
   *
   * @example
   * ```ts
   * const completedChallenge = await authModuleService.verifyAuthMfaChallenge({
   *   id: "challenge_123",
   *   method: "totp",
   *   code: "123456"
   * })
   * ```
   */
  verifyAuthMfaChallenge(
    data: VerifyAuthMfaChallengeDTO,
    sharedContext?: Context
  ): Promise<AuthMfaChallengeDTO>

  /**
   * This method disables multi-factor authentication (MFA) for a configured method.
   *
   * @param {DisableAuthMfaDTO} data - The data required to disable a multi-factor authentication (MFA) configuration.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthMfaDTO>} The disabled multi-factor authentication (MFA) configuration.
   * @since 2.15.3
   *
   * @example
   * ```ts
   * const disabledMfa = await authModuleService.disableAuthMfa({
   *   id: "mfa_123",
   *   method: "totp",
   *   code: "123456"
   * })
   * ```
   */
  disableAuthMfa(
    data: DisableAuthMfaDTO,
    sharedContext?: Context
  ): Promise<AuthMfaDTO>

  /**
   * This method retrieves a configured multi-factor authentication (MFA) configuration by its ID or filters.
   *
   * @param {string | AuthMfaSelector} selector - The ID of the multi-factor authentication (MFA) configuration
   * or the filters to select the multi-factor authentication (MFA) configuration.
   * @param {FindConfig<AuthMfaDTO>} config - The configurations determining how the multi-factor authentication (MFA) configuration is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a multi-factor authentication (MFA) configuration.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @return {Promise<AuthMfaDTO>} The retrieved multi-factor authentication (MFA) configuration.
   * @since 2.15.3
   *
   * @example
   * To retrieve a multi-factor authentication (MFA) configuration by its ID:
   *
   * ```ts
   * const mfaConfig = await authModuleService.retrieveAuthMfa("mfa_123")
   * ```
   *
   * To retrieve a multi-factor authentication (MFA) configuration using filters:
   *
   * ```ts
   * const mfaConfig = await authModuleService.retrieveAuthMfa({
   *   auth_identity_id: "authusr_123",
   *   provider: "totp",
   * })
   * ```
   */
  retrieveAuthMfa(
    selector: string | AuthMfaSelector,
    config?: FindConfig<AuthMfaDTO>,
    sharedContext?: Context
  ): Promise<AuthMfaDTO>

  /**
   * This method retrieves a paginated list of multi-factor authentication (MFA) configurations based on optional filters and configuration.
   *
   * @param {FilterableAuthMfaProps} filters - The filters to apply on the retrieved multi-factor authentication (MFA) configurations.
   * @param {FindConfig<AuthMfaDTO>} config - The configurations determining how the multi-factor authentication (MFA) configurations are retrieved.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthMfaDTO[]>} The list of multi-factor authentication (MFA) configurations.
   * @since 2.15.3
   *
   * @example
   * To retrieve a list of multi-factor authentication (MFA) configurations using their IDs:
   *
   * ```ts
   * const mfaConfigs = await authModuleService.listAuthMfa({
   *   id: ["mfa_123", "mfa_321"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const mfaConfigs = await authModuleService.listAuthMfa(
   *   {
   *     id: ["mfa_123", "mfa_321"],
   *   },
   *   {
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listAuthMfa(
    filters?: FilterableAuthMfaProps,
    config?: FindConfig<AuthMfaDTO>,
    sharedContext?: Context
  ): Promise<AuthMfaDTO[]>

  /**
   * This method creates a new set of single-use recovery codes for an auth
   * identity and invalidates any existing recovery codes.
   *
   * @param {GenerateAuthMfaRecoveryCodesDTO} data - The data required to generate recovery codes.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<GenerateAuthMfaRecoveryCodesResponse>} The response containing generated recovery codes.
   * @since 2.15.3
   *
   * @example
   * ```ts
   * const { codes } = await authModuleService.generateAuthMfaRecoveryCodes({
   *   auth_identity_id: "authusr_123",
   *   count: 8
   * })
   * ```
   */
  generateAuthMfaRecoveryCodes(
    data: GenerateAuthMfaRecoveryCodesDTO,
    sharedContext?: Context
  ): Promise<GenerateAuthMfaRecoveryCodesResponse>

  /**
   * This method uses a recovery code for an auth identity.
   *
   * @param {UseAuthMfaRecoveryCodeDTO} data - The data required to use a recovery code.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the recovery code is successfully used.
   * @since 2.15.3
   *
   * @example
   * ```ts
   * await authModuleService.useAuthMfaRecoveryCode({
   *   auth_identity_id: "authusr_123",
   *   code: "recovery123"
   * })
   * ```
   */
  useAuthMfaRecoveryCode(
    data: UseAuthMfaRecoveryCodeDTO,
    sharedContext?: Context
  ): Promise<void>

  createAuthVerificationToken(
    data: CreateAuthVerificationTokenDTO,
    sharedContext?: Context
  ): Promise<CreateAuthVerificationTokenResponse>

  requestAuthVerification(
    data: RequestAuthVerificationDTO,
    sharedContext?: Context
  ): Promise<RequestAuthVerificationResponse>

  confirmAuthVerification(
    data: ConfirmAuthVerificationDTO,
    sharedContext?: Context
  ): Promise<ConfirmAuthVerificationResponse>

  /**
   * This method retrieves an auth identity by its ID.
   *
   * @param {string} id - The ID of the auth identity.
   * @param {FindConfig<AuthIdentityDTO>} config - The configurations determining how the auth identity is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a auth identity.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthIdentityDTO>} The retrieved auth identity.
   *
   * @example
   * const authIdentity = await authModuleService.retrieveAuthIdentity("authusr_1")
   */
  retrieveAuthIdentity(
    id: string,
    config?: FindConfig<AuthIdentityDTO>,
    sharedContext?: Context
  ): Promise<AuthIdentityDTO>

  /**
   * This method retrieves a paginated list of auth identities based on optional filters and configuration.
   *
   * @param {FilterableAuthIdentityProps} filters - The filters to apply on the retrieved auth identities.
   * @param {FindConfig<AuthIdentityDTO>} config - The configurations determining how the auth identity is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a auth identity.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthIdentityDTO[]>} The list of auth identities.
   *
   * @example
   * To retrieve a list of auth identities using their IDs:
   *
   * ```ts
   * const authIdentities = await authModuleService.listAuthIdentities({
   *   id: ["authusr_123", "authusr_321"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const authIdentities = await authModuleService.listAuthIdentities(
   *   {
   *     id: ["authusr_123", "authusr_321"],
   *   },
   *   {
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listAuthIdentities(
    filters?: FilterableAuthIdentityProps,
    config?: FindConfig<AuthIdentityDTO>,
    sharedContext?: Context
  ): Promise<AuthIdentityDTO[]>

  /**
   * This method retrieves a paginated list of auth identities along with the total count of available auth identities satisfying the provided filters.
   *
   * @param {FilterableAuthIdentityProps} filters - The filters to apply on the retrieved auth identities.
   * @param {FindConfig<AuthIdentityDTO>} config - The configurations determining how the auth identity is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a auth identity.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[AuthIdentityDTO[], number]>} The list of auth identities along with their total count.
   *
   * @example
   * To retrieve a list of auth identities using their IDs:
   *
   * ```ts
   * const [authIdentities, count] =
   *   await authModuleService.listAndCountAuthIdentities({
   *     id: ["authusr_123", "authusr_321"],
   *   })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [authIdentities, count] =
   *   await authModuleService.listAndCountAuthIdentities(
   *     {
   *       id: ["authusr_123", "authusr_321"],
   *     },
   *     {
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountAuthIdentities(
    filters?: FilterableAuthIdentityProps,
    config?: FindConfig<AuthIdentityDTO>,
    sharedContext?: Context
  ): Promise<[AuthIdentityDTO[], number]>

  /**
   * This method creates auth identities.
   *
   * @param {CreateAuthIdentityDTO[]} data - The auth identities to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthIdentityDTO[]>} The created auth identities.
   *
   * @example
   * const authIdentities = await authModuleService.createAuthIdentities([
   *   {
   *     provider_identities: [{
   *      provider: "emailpass",
   *      entity_id: "user@example.com",
   *     }]
   *   },
   *   {
   *     provider_identities: [{
   *      provider: "google",
   *      entity_id: "user@gmail.com",
   *     }]
   *   },
   * ])
   */
  createAuthIdentities(
    data: CreateAuthIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthIdentityDTO[]>

  /**
   * This method creates an auth identity.
   *
   * @param {CreateAuthIdentityDTO} data - The auth identity to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthIdentityDTO>} The created auth identity.
   *
   * @example
   * const authIdentity = await authModuleService.createAuthIdentities({
   *     provider_identities: [{
   *      provider: "emailpass",
   *      entity_id: "user@example.com",
   *     }]
   * })
   */
  createAuthIdentities(
    data: CreateAuthIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthIdentityDTO>

  /**
   * This method updates existing auths.
   *
   * @param {UpdateAuthIdentityDTO[]} data - The attributes to update in the auth identities.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthIdentityDTO[]>} The updated auths.
   *
   * @example
   * const authIdentities = await authModuleService.updateAuthIdentities([
   *   {
   *     id: "authusr_123",
   *   },
   * ])
   */
  updateAuthIdentities(
    data: UpdateAuthIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthIdentityDTO[]>

  /**
   * This method updates an existing auth.
   *
   * @param {UpdateAuthIdentityDTO} data - The attributes to update in the auth identity.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthIdentityDTO>} The updated auth.
   *
   * @example
   * const authIdentity = await authModuleService.updateAuthIdentities({
   *   id: "authusr_123",
   * })
   */
  updateAuthIdentities(
    data: UpdateAuthIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthIdentityDTO>

  /**
   * This method deletes a auth by its ID.
   *
   * @param {string[]} ids - The IDs of the auth.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when {summary}
   *
   * @example
   * await authModuleService.deleteAuthIdentities(["authusr_123", "authusr_321"])
   */
  deleteAuthIdentities(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method retrieves a provider identity by its ID.
   *
   * @param {string} id - The ID of the provider identity.
   * @param {FindConfig<ProviderIdentityDTO>} config - The configurations determining how the provider identity is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a provider identity.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProviderIdentityDTO>} The retrieved provider identity.
   *
   * @example
   * const providerIdentity = await authModuleService.retrieveProviderIdentity("provider_123")
   */
  retrieveProviderIdentity(
    id: string,
    config?: FindConfig<ProviderIdentityDTO>,
    sharedContext?: Context
  ): Promise<ProviderIdentityDTO>

  /**
   * This method retrieves a paginated list of provider identities based on optional filters and configuration.
   *
   * @param {FilterableProviderIdentityProps} filters - The filters to apply on the retrieved provider identities.
   * @param {FindConfig<ProviderIdentityDTO>} config - The configurations determining how the provider identity is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a provider identity.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProviderIdentityDTO[]>} The list of provider identities.
   *
   * @example
   * To retrieve a list of provider identities using their IDs:
   *
   * ```ts
   * const providerIdentities = await authModuleService.listProviderIdentities({
   *   id: ["provider_123", "provider_234"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const providerIdentities = await authModuleService.listProviderIdentities(
   *   {
   *     id: ["provider_123", "provider_234"],
   *   },
   *   {
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listProviderIdentities(
    filters?: FilterableProviderIdentityProps,
    config?: FindConfig<ProviderIdentityDTO>,
    sharedContext?: Context
  ): Promise<ProviderIdentityDTO[]>

  /**
   * This method creates provider identities.
   *
   * @param {CreateProviderIdentityDTO[]} data - The provider identities to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProviderIdentityDTO[]>} The created provider identities.
   *
   * @example
   * const providerIdentities = await authModuleService.createProviderIdentities([
   *   {
   *      provider: "emailpass",
   *      entity_id: "user@example.com",
   *      auth_identity_id: "uid_1"
   *   },
   *   {
   *      provider: "github",
   *      entity_id: "github_handle",
   *      auth_identity_id: "uid_1"
   *   },
   * ])
   */
  createProviderIdentities(
    data: CreateProviderIdentityDTO[],
    sharedContext?: Context
  ): Promise<ProviderIdentityDTO[]>

  /**
   * This method creates a provider identity.
   *
   * @param {CreateProviderIdentityDTO} data - The provider identity to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProviderIdentityDTO>} The created provider identity.
   *
   * @example
   * const providerIdentity = await authModuleService.createProviderIdentities({
   *     provider: "github",
   *     entity_id: "github_handle",
   *     auth_identity_id: "uid_1"
   * })
   */
  createProviderIdentities(
    data: CreateProviderIdentityDTO,
    sharedContext?: Context
  ): Promise<ProviderIdentityDTO>

  /**
   * This method updates existing provider identities.
   *
   * @param {UpdateProviderIdentityDTO[]} data - The attributes to update in the provider identities.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProviderIdentityDTO[]>} The updated provider identities.
   *
   * @example
   * const providerIdentities = await authModuleService.updateProviderIdentities([
   *   {
   *     id: "provider_123",
   *   },
   * ])
   */
  updateProviderIdentities(
    data: UpdateProviderIdentityDTO[],
    sharedContext?: Context
  ): Promise<ProviderIdentityDTO[]>

  /**
   * This method updates an existing provider identity.
   *
   * @param {UpdateProviderIdentityDTO} data - The attributes to update in the provider identity.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ProviderIdentityDTO>} The updated provider identity.
   *
   * @example
   * const providerIdentity = await authModuleService.updateProviderIdentities({
   *   id: "provider_123",
   * })
   */
  updateProviderIdentities(
    data: UpdateProviderIdentityDTO,
    sharedContext?: Context
  ): Promise<ProviderIdentityDTO>

  /**
   * This method deletes a provider identity by its ID.
   *
   * @param {string[]} ids - The IDs of the provider identity.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when {summary}
   *
   * @example
   * await authModuleService.deleteProviderIdentities(["provider_123", "provider_234"])
   */
  deleteProviderIdentities(
    ids: string[],
    sharedContext?: Context
  ): Promise<void>
}
