import {
  AuthIdentityDTO,
  AuthenticationInput,
  AuthenticationResponse,
  CreateAuthIdentityDTO,
  FilterableAuthIdentityProps,
  UpdateAuthIdentityDTO,
} from "./common"
import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"

/**
 * @ignore
 */
export type JWTGenerationOptions = {
  expiresIn?: string | number
}

/**
 * The main service interface for the Auth Module.
 */
export interface IAuthModuleService extends IModuleService {
  /**
   * This method is used to authenticate a user using a provider. The `authenticate` method of the
   * underlying provider is called, passing it the `providerData` parameter as a parameter. The method
   * returns the data returned by the provider.
   *
   * Refer to [this guide](https://docs.medusajs.com/experimental/auth/auth-flows) to learn more about the authentication flows.
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
   *     authScope: "admin",
   *     protocol: req.protocol,
   *   } as AuthenticationInput)
   * ```
   */
  authenticate(
    provider: string,
    providerData: AuthenticationInput
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
   * Learn more about this authentication flow in [this guide](https://docs.medusajs.com/experimental/auth/auth-flows#authentication-with-third-party-service).
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
   * const { success, authIdentity, error, successRedirectUrl } =
   *   await authModuleService.validateCallback("google", {
   *     url: req.url,
   *     headers: req.headers,
   *     query: req.query,
   *     body: req.body,
   *     authScope: "admin",
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
   * This method retrieves an auth identity by its ID.
   *
   * @param {string} id - The ID of the auth identity.
   * @param {FindConfig<AuthIdentityDTO>} config - The configurations determining how the auth identity is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a auth identity.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthIdentityDTO>} The retrieved auth identity.
   *
   * @example
   * const authIdentity = await authModuleService.retrieve("authusr_1")
   */
  retrieve(
    id: string,
    config?: FindConfig<AuthIdentityDTO>,
    sharedContext?: Context
  ): Promise<AuthIdentityDTO>

  /**
   * This method retrieves a paginated list of auth identitys based on optional filters and configuration.
   *
   * @param {FilterableAuthIdentityProps} filters - The filters to apply on the retrieved auth identitys.
   * @param {FindConfig<AuthIdentityDTO>} config - The configurations determining how the auth identity is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a auth identity.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthIdentityDTO[]>} The list of auth identitys.
   *
   * @example
   * To retrieve a list of auth identitys using their IDs:
   *
   * ```ts
   * const authIdentities = await authModuleService.list({
   *   id: ["authusr_123", "authusr_321"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const authIdentities = await authModuleService.list(
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
  list(
    filters?: FilterableAuthIdentityProps,
    config?: FindConfig<AuthIdentityDTO>,
    sharedContext?: Context
  ): Promise<AuthIdentityDTO[]>

  /**
   * This method retrieves a paginated list of auth identitys along with the total count of available auth identitys satisfying the provided filters.
   *
   * @param {FilterableAuthIdentityProps} filters - The filters to apply on the retrieved auth identitys.
   * @param {FindConfig<AuthIdentityDTO>} config - The configurations determining how the auth identity is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a auth identity.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[AuthIdentityDTO[], number]>} The list of auth identitys along with their total count.
   *
   * @example
   * To retrieve a list of auth identitys using their IDs:
   *
   * ```ts
   * const [authIdentities, count] =
   *   await authModuleService.listAndCount({
   *     id: ["authusr_123", "authusr_321"],
   *   })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [authIdentities, count] =
   *   await authModuleService.listAndCount(
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
  listAndCount(
    filters?: FilterableAuthIdentityProps,
    config?: FindConfig<AuthIdentityDTO>,
    sharedContext?: Context
  ): Promise<[AuthIdentityDTO[], number]>

  /**
   * This method creates auth identitys.
   *
   * @param {CreateAuthIdentityDTO[]} data - The auth identitys to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthIdentityDTO[]>} The created auth identitys.
   *
   * @example
   * const authIdentities = await authModuleService.create([
   *   {
   *     provider: "emailpass",
   *     entity_id: "user@example.com",
   *     scope: "admin",
   *   },
   *   {
   *     provider: "google",
   *     entity_id: "user@gmail.com",
   *     scope: "email profile",
   *   },
   * ])
   */
  create(
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
   * const authIdentity = await authModuleService.create({
   *   provider: "emailpass",
   *   entity_id: "user@example.com",
   *   scope: "admin",
   * })
   */
  create(
    data: CreateAuthIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthIdentityDTO>

  /**
   * This method updates existing auths.
   *
   * @param {UpdateAuthIdentityDTO[]} data - The attributes to update in the auth identitys.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthIdentityDTO[]>} The updated auths.
   *
   * @example
   * const authIdentities = await authModuleService.update([
   *   {
   *     id: "authusr_123",
   *     app_metadata: {
   *       test: true,
   *     },
   *   },
   * ])
   */
  update(
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
   * const authIdentity = await authModuleService.update({
   *   id: "authusr_123",
   *   app_metadata: {
   *     test: true,
   *   },
   * })
   */
  update(
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
   * await authModuleService.delete(["authusr_123", "authusr_321"])
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>
}
