import {
  AuthUserDTO,
  AuthenticationInput,
  AuthenticationResponse,
  CreateAuthUserDTO,
  FilterableAuthUserProps,
  UpdateAuthUserDTO,
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
   * const { success, authUser, location, error } =
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
   * const { success, authUser, error, successRedirectUrl } =
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
   * This method retrieves an auth user by its ID.
   *
   * @param {string} id - The ID of the auth user.
   * @param {FindConfig<AuthUserDTO>} config - The configurations determining how the auth user is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a auth user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthUserDTO>} The retrieved auth user.
   *
   * @example
   * const authUser = await authModuleService.retrieve("authusr_1")
   */
  retrieve(
    id: string,
    config?: FindConfig<AuthUserDTO>,
    sharedContext?: Context
  ): Promise<AuthUserDTO>

  /**
   * This method retrieves a paginated list of auth users based on optional filters and configuration.
   *
   * @param {FilterableAuthUserProps} filters - The filters to apply on the retrieved auth users.
   * @param {FindConfig<AuthUserDTO>} config - The configurations determining how the auth user is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a auth user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthUserDTO[]>} The list of auth users.
   *
   * @example
   * To retrieve a list of auth users using their IDs:
   *
   * ```ts
   * const authUsers = await authModuleService.list({
   *   id: ["authusr_123", "authusr_321"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const authUsers = await authModuleService.list(
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
    filters?: FilterableAuthUserProps,
    config?: FindConfig<AuthUserDTO>,
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  /**
   * This method retrieves a paginated list of auth users along with the total count of available auth users satisfying the provided filters.
   *
   * @param {FilterableAuthUserProps} filters - The filters to apply on the retrieved auth users.
   * @param {FindConfig<AuthUserDTO>} config - The configurations determining how the auth user is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a auth user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[AuthUserDTO[], number]>} The list of auth users along with their total count.
   *
   * @example
   * To retrieve a list of auth users using their IDs:
   *
   * ```ts
   * const [authUsers, count] =
   *   await authModuleService.listAndCount({
   *     id: ["authusr_123", "authusr_321"],
   *   })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [authUsers, count] =
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
    filters?: FilterableAuthUserProps,
    config?: FindConfig<AuthUserDTO>,
    sharedContext?: Context
  ): Promise<[AuthUserDTO[], number]>

  /**
   * This method creates auth users.
   *
   * @param {CreateAuthUserDTO[]} data - The auth users to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthUserDTO[]>} The created auth users.
   *
   * @example
   * const authUsers = await authModuleService.create([
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
    data: CreateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  /**
   * This method creates an auth user.
   *
   * @param {CreateAuthUserDTO} data - The auth user to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthUserDTO>} The created auth user.
   *
   * @example
   * const authUser = await authModuleService.create({
   *   provider: "emailpass",
   *   entity_id: "user@example.com",
   *   scope: "admin",
   * })
   */
  create(data: CreateAuthUserDTO, sharedContext?: Context): Promise<AuthUserDTO>

  /**
   * This method updates existing auths.
   *
   * @param {UpdateAuthUserDTO[]} data - The attributes to update in the auth users.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthUserDTO[]>} The updated auths.
   *
   * @example
   * const authUsers = await authModuleService.update([
   *   {
   *     id: "authusr_123",
   *     app_metadata: {
   *       test: true,
   *     },
   *   },
   * ])
   */
  update(
    data: UpdateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  /**
   * This method updates an existing auth.
   *
   * @param {UpdateAuthUserDTO} data - The attributes to update in the auth user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthUserDTO>} The updated auth.
   *
   * @example
   * const authUser = await authModuleService.update({
   *   id: "authusr_123",
   *   app_metadata: {
   *     test: true,
   *   },
   * })
   */
  update(data: UpdateAuthUserDTO, sharedContext?: Context): Promise<AuthUserDTO>

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
