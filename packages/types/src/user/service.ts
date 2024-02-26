import {
  CreateInviteDTO,
  CreateUserDTO,
  UpdateInviteDTO,
  UpdateUserDTO,
} from "./mutations"
import { FilterableUserProps, InviteDTO, UserDTO } from "./common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"

import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"

/**
 * The main service interface for the user module.
 */
export interface IUserModuleService extends IModuleService {
  /**
   * This method validates an invite token.
   *
   * @param {string} token - The token to validate.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InviteDTO>} The associated invite's details.
   */
  validateInviteToken(
    token: string,
    sharedContext?: Context
  ): Promise<InviteDTO>

  refreshInviteTokens(
    inviteIds: string[],
    sharedContext?: Context
  ): Promise<InviteDTO[]>

  /**
   * This method retrieves a user by its ID.
   *
   * @param {string} id - The ID of the retrieve.
   * @param {FindConfig<UserDTO>} config - The configurations determining how the user is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserDTO>} The retrieved user.
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
    config?: FindConfig<UserDTO>,
    sharedContext?: Context
  ): Promise<UserDTO>

  /**
   * This method retrieves a paginated list of users based on optional filters and configuration.
   *
   * @param {FilterableUserProps} filters - The filters to apply on the retrieved user.
   * @param {FindConfig<UserDTO>} config - The configurations determining how the user is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserDTO[]>} The list of users.
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
    filters?: FilterableUserProps,
    config?: FindConfig<UserDTO>,
    sharedContext?: Context
  ): Promise<UserDTO[]>

  /**
   * This method retrieves a paginated list of user along with the total count of available users satisfying the provided filters.
   *
   * @param {FilterableUserProps} filters - The filters to apply on the retrieved user.
   * @param {FindConfig<UserDTO>} config - The configurations determining how the user is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[UserDTO[], number]>} The list of users along with their total count.
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
    filters?: FilterableUserProps,
    config?: FindConfig<UserDTO>,
    sharedContext?: Context
  ): Promise<[UserDTO[], number]>

  /**
   * This method creates users.
   *
   * @param {CreateUserDTO[]} data - The users to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserDTO[]>} The created users.
   *
   * @example
   * {example-code}
   */
  create(data: CreateUserDTO[], sharedContext?: Context): Promise<UserDTO[]>

  /**
   * This method creates a user.
   *
   * @param {CreateUserDTO} data - The user to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserDTO>} The created user.
   *
   * @example
   * {example-code}
   */
  create(data: CreateUserDTO, sharedContext?: Context): Promise<UserDTO>

  /**
   * This method updates existing users.
   *
   * @param {UpdateUserDTO[]} data - The attributes to update in each user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserDTO[]>} The updated users.
   *
   * @example
   * {example-code}
   */
  update(data: UpdateUserDTO[], sharedContext?: Context): Promise<UserDTO[]>

  /**
   * This method updates an existing user.
   *
   * @param {UpdateUserDTO} data - The attributes to update in the user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserDTO>} The updated user.
   *
   * @example
   * {example-code}
   */
  update(data: UpdateUserDTO, sharedContext?: Context): Promise<UserDTO>

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

  softDelete<TReturnableLinkableKeys extends string = string>(
    userIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  restore<TReturnableLinkableKeys extends string = string>(
    userIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  retrieveInvite(
    id: string,
    config?: FindConfig<InviteDTO>,
    sharedContext?: Context
  ): Promise<InviteDTO>

  listInvites(
    filters?: FilterableUserProps,
    config?: FindConfig<InviteDTO>,
    sharedContext?: Context
  ): Promise<InviteDTO[]>

  listAndCountInvites(
    filters?: FilterableUserProps,
    config?: FindConfig<InviteDTO>,
    sharedContext?: Context
  ): Promise<[InviteDTO[], number]>

  createInvites(
    data: CreateInviteDTO[],
    sharedContext?: Context
  ): Promise<InviteDTO[]>

  createInvites(
    data: CreateInviteDTO,
    sharedContext?: Context
  ): Promise<InviteDTO>

  updateInvites(
    data: UpdateInviteDTO[],
    sharedContext?: Context
  ): Promise<InviteDTO[]>

  updateInvites(
    data: UpdateInviteDTO,
    sharedContext?: Context
  ): Promise<InviteDTO>

  deleteInvites(ids: string[], sharedContext?: Context): Promise<void>

  softDeleteInvites<TReturnableLinkableKeys extends string = string>(
    inviteIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  restoreInvites<TReturnableLinkableKeys extends string = string>(
    inviteIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
}
