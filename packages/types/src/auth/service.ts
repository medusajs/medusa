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
 * The main service interface for the authentication module.
 */
export interface IAuthModuleService extends IModuleService {
  /**
   * This method represents the completion of an asynchronous operation
   *
   * @param {string} provider - The provider to use for authentication.
   * @param {AuthenticationInput} providerData - The authentication data necessary to pass to the provider
   * @returns {Promise<AuthenticationResponse>} The authentication's result.
   *
   * @example
   * {example-code}
   */
  authenticate(
    provider: string,
    providerData: AuthenticationInput
  ): Promise<AuthenticationResponse>

  /**
   * This method Represents the completion of an asynchronous operation
   *
   * @param {string} provider - {summary}
   * @param {AuthenticationInput} providerData - {summary}
   * @returns {Promise<AuthenticationResponse>} Represents the completion of an asynchronous operation
   *
   * @example
   * {example-code}
   */
  validateCallback(
    provider: string,
    providerData: AuthenticationInput
  ): Promise<AuthenticationResponse>

  /**
   * This method retrieves the user by its ID.
   *
   * @param {string} id - The ID of the retrieve.
   * @param {FindConfig<AuthUserDTO>} config - The configurations determining how the auth user is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a auth user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthUserDTO>} The retrieved user.
   *
   * @example
   * A simple example that retrieves a {type name} by its ID:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  retrieve(
    id: string,
    config?: FindConfig<AuthUserDTO>,
    sharedContext?: Context
  ): Promise<AuthUserDTO>

  /**
   * This method retrieves a paginated list of users based on optional filters and configuration.
   *
   * @param {FilterableAuthUserProps} filters - The filters to apply on the retrieved auth user.
   * @param {FindConfig<AuthUserDTO>} config - The configurations determining how the auth user is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a auth user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthUserDTO[]>} The list of users.
   *
   * @example
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  list(
    filters?: FilterableAuthUserProps,
    config?: FindConfig<AuthUserDTO>,
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  /**
   * This method retrieves a paginated list of user along with the total count of available users satisfying the provided filters.
   *
   * @param {FilterableAuthUserProps} filters - The filters to apply on the retrieved auth user.
   * @param {FindConfig<AuthUserDTO>} config - The configurations determining how the auth user is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a auth user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[AuthUserDTO[], number]>} The list of users along with their total count.
   *
   * @example
   * To retrieve a list of {type name} using their IDs:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * To specify relations that should be retrieved within the {type name}:
   *
   * ```ts
   * {example-code}
   * ```
   *
   * By default, only the first `{default limit}` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * {example-code}
   * ```
   *
   *
   */
  listAndCount(
    filters?: FilterableAuthUserProps,
    config?: FindConfig<AuthUserDTO>,
    sharedContext?: Context
  ): Promise<[AuthUserDTO[], number]>

  /**
   * This method creates users
   *
   * @param {CreateAuthUserDTO[]} data - The auth user to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthUserDTO[]>} The created users.
   *
   * @example
   * {example-code}
   */
  create(
    data: CreateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  /**
   * This method creates a user
   *
   * @param {CreateAuthUserDTO} data - The auth user to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthUserDTO>} The created user.
   *
   * @example
   * {example-code}
   */
  create(data: CreateAuthUserDTO, sharedContext?: Context): Promise<AuthUserDTO>

  /**
   * This method updates existing users.
   *
   * @param {UpdateAuthUserDTO[]} data - The attributes to update in the auth user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthUserDTO[]>} The updated users.
   *
   * @example
   * {example-code}
   */
  update(
    data: UpdateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  /**
   * This method updates existing user.
   *
   * @param {UpdateAuthUserDTO} data - The attributes to update in the auth user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<AuthUserDTO>} The updated user.
   *
   * @example
   * {example-code}
   */
  update(data: UpdateAuthUserDTO, sharedContext?: Context): Promise<AuthUserDTO>

  /**
   * This method deletes users by their IDs.
   *
   * @param {string[]} ids - The list of IDs of users to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the users are deleted.
   *
   * @example
   * {example-code}
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>
}
