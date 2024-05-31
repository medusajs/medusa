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
 * The main service interface for the User Module.
 */
export interface IUserModuleService extends IModuleService {
  /**
   * This method validates that a token belongs to an invite and returns that invite.
   * 
   * An error is thrown if the invite has expired or no invite matches the token.
   *
   * @param {string} token - The token to validate
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InviteDTO>} The token's invite.
   *
   * @example
   * const invite = await userModuleService.validateInviteToken(
   *   "eyJhbG..."
   * )
   */
  validateInviteToken(
    token: string,
    sharedContext?: Context
  ): Promise<InviteDTO>

  /**
   * This method updates the token and expiration date of invites.
   *
   * @param {string[]} inviteIds - The IDs of the invites to refresh.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InviteDTO[]>} The updated invites.
   *
   * @example
   * const invites = await userModuleService.refreshInviteTokens([
   *   "invite_123",
   *   "invite_321"
   * ])
   */
  refreshInviteTokens(
    inviteIds: string[],
    sharedContext?: Context
  ): Promise<InviteDTO[]>

  /**
   * This method retrieves a user by its ID.
   *
   * @param {string} id - The ID of the user.
   * @param {FindConfig<UserDTO>} config - The configurations determining how the user is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserDTO>} The retrieved user.
   *
   * @example
   * const user = await userModuleService.retrieve("user_123")
   */
  retrieve(
    id: string,
    config?: FindConfig<UserDTO>,
    sharedContext?: Context
  ): Promise<UserDTO>

  /**
   * This method retrieves a paginated list of users based on optional filters and configuration.
   *
   * @param {FilterableUserProps} filters - The filters to apply on the retrieved users.
   * @param {FindConfig<UserDTO>} config - The configurations determining how the user is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserDTO[]>} The list of users.
   *
   * @example
   * To retrieve a list of users using their IDs:
   *
   * ```ts
   * const users = await userModuleService.list({
   *   id: ["user_123", "user_321"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const users = await userModuleService.list(
   *   {
   *     id: ["user_123", "user_321"]
   *   },
   *   {
   *     take: 20,
   *     skip: 2
   *   }
   * )
   * ```
   */
  list(
    filters?: FilterableUserProps,
    config?: FindConfig<UserDTO>,
    sharedContext?: Context
  ): Promise<UserDTO[]>

  /**
   * This method retrieves a paginated list of users along with the total count of available users satisfying the provided filters.
   *
   * @param {FilterableUserProps} filters - The filters to apply on the retrieved users.
   * @param {FindConfig<UserDTO>} config - The configurations determining how the user is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a user.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[UserDTO[], number]>} The list of users along with their total count.
   *
   * @example
   * To retrieve a list of users using their IDs:
   *
   * ```ts
   * const [users, count] = await userModuleService.listAndCount({
   *   id: ["user_123", "user_321"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [users, count] = await userModuleService.listAndCount(
   *   {
   *     id: ["user_123", "user_321"]
   *   },
   *   {
   *     take: 20,
   *     skip: 2
   *   }
   * )
   * ```
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
   * const users = await userModuleService.create([
   *   {
   *     email: "john@doe.com"
   *   },
   *   {
   *     email: "john2@doe.com"
   *   }
   * ])
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
   * const user = await userModuleService.create({
   *   email: "john@doe.com"
   * })
   */
  create(data: CreateUserDTO, sharedContext?: Context): Promise<UserDTO>

  /**
   * This method updates existing users.
   *
   * @param {UpdateUserDTO[]} data - The attributes to update in the users.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<UserDTO[]>} The updated users.
   *
   * @example
   * const users = await userModuleService.update([
   *   {
   *     id: "user_123",
   *     first_name: "John"
   *   },
   *   {
   *     id: "user_321",
   *     last_name: "Doe"
   *   }
   * ])
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
   * const user = await userModuleService.update({
   *   id: "user_123",
   *   first_name: "John"
   * })
   */
  update(data: UpdateUserDTO, sharedContext?: Context): Promise<UserDTO>

  /**
   * This method deletes users by their IDs.
   *
   * @param {string[]} ids - The IDs of the users.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the users are deleted successfully.
   *
   * @example
   * await userModuleService.delete([
   *   "user_123", "user_321"
   * ])
   */
  delete(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes a user by its IDs.
   *
   * @param {string[]} userIds - The IDs of users to soft-delete
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await userModuleService.softDelete([
   *   "user_123", "user_321"
   * ])
   */
  softDelete<TReturnableLinkableKeys extends string = string>(
    userIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted users by their IDs.
   *
   * @param {string[]} userIds - The IDs of users to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the users. You can pass to its `returnLinkableKeys`
   * property any of the user's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await userModuleService.restore([
   *   "user_123", "user_321"
   * ])
   */
  restore<TReturnableLinkableKeys extends string = string>(
    userIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method retrieves an invite by its ID.
   *
   * @param {string} id - The ID of the invite.
   * @param {FindConfig<InviteDTO>} config - The configurations determining how the invite is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a invite.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InviteDTO>} The retrieved invite.
   *
   * @example
   * const invite = await userModuleService.retrieveInvite(
   *   "invite_123"
   * )
   */
  retrieveInvite(
    id: string,
    config?: FindConfig<InviteDTO>,
    sharedContext?: Context
  ): Promise<InviteDTO>

  /**
   * This method retrieves a paginated list of invites based on optional filters and configuration.
   *
   * @param {FilterableUserProps} filters - The filters to apply on the retrieved invites.
   * @param {FindConfig<InviteDTO>} config - The configurations determining how the invite is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a invite.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InviteDTO[]>} The list of invites.
   *
   * @example
   * To retrieve a list of invites using their IDs:
   *
   * ```ts
   * const invites = await userModuleService.listInvites({
   *   id: ["invite_123", "invite_321"]
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const invites = await userModuleService.listInvites(
   *   {
   *     id: ["invite_123", "invite_321"]
   *   },
   *   {
   *     take: 20,
   *     skip: 2
   *   }
   * )
   * ```
   */
  listInvites(
    filters?: FilterableUserProps,
    config?: FindConfig<InviteDTO>,
    sharedContext?: Context
  ): Promise<InviteDTO[]>

  /**
   * This method retrieves a paginated list of invites along with the total count of available invites satisfying the provided filters.
   *
   * @param {FilterableUserProps} filters - The filters to apply on the retrieved invites.
   * @param {FindConfig<InviteDTO>} config - The configurations determining how the invite is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a invite.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[InviteDTO[], number]>} The list of invites along with their total count.
   *
   * @example
   * To retrieve a list of invites using their IDs:
   *
   * ```ts
   * const [invites, count] = await userModuleService
   *   .listAndCountInvites({
   *     id: ["invite_123", "invite_321"]
   *   })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [invites, count] = await userModuleService
   *   .listAndCountInvites(
   *     {
   *       id: ["invite_123", "invite_321"]
   *     },
   *     {
   *       take: 20,
   *       skip: 2
   *     }
   *   )
   * ```
   */
  listAndCountInvites(
    filters?: FilterableUserProps,
    config?: FindConfig<InviteDTO>,
    sharedContext?: Context
  ): Promise<[InviteDTO[], number]>

  /**
   * This method creates invites.
   *
   * @param {CreateInviteDTO[]} data - The invites to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InviteDTO[]>} The created invites.
   *
   * @example
   * const invites = await userModuleService.createInvites([
   *   {
   *     email: "john@doe.com"
   *   },
   *   {
   *     email: "john2@doe.com"
   *   }
   * ])
   */
  createInvites(
    data: CreateInviteDTO[],
    sharedContext?: Context
  ): Promise<InviteDTO[]>

  /**
   * This method creates a invite.
   *
   * @param {CreateInviteDTO} data - The invite to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InviteDTO>} The created invite.
   *
   * @example
   * const invite = await userModuleService.createInvites({
   *   email: "john@doe.com"
   * })
   */
  createInvites(
    data: CreateInviteDTO,
    sharedContext?: Context
  ): Promise<InviteDTO>

  /**
   * This method updates existing invites.
   *
   * @param {UpdateInviteDTO[]} data - The attributes to update in the invites.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InviteDTO[]>} The updated invites.
   *
   * @example
   * const invites = await userModuleService.updateInvites([
   *   {
   *     id: "invite_123",
   *     accepted: true
   *   },
   *   {
   *     id: "invite_321",
   *     metadata: {
   *       test: true
   *     }
   *   }
   * ])
   */
  updateInvites(
    data: UpdateInviteDTO[],
    sharedContext?: Context
  ): Promise<InviteDTO[]>

  /**
   * This method updates an existing invite.
   *
   * @param {UpdateInviteDTO} data - The attributes to update in the invite.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<InviteDTO>} The updated invite.
   *
   * @example
   * const invite = await userModuleService.updateInvites({
   *   id: "invite_123",
   *   accepted: true
   * })
   */
  updateInvites(
    data: UpdateInviteDTO,
    sharedContext?: Context
  ): Promise<InviteDTO>

  /**
   * This method deletes invites by their IDs.
   *
   * @param {string[]} ids - The IDs of the invites.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the invites are deleted successfully.
   *
   * @example
   * await userModuleService.deleteInvites([
   *   "invite_123", "invite_321"
   * ])
   */
  deleteInvites(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes invites by their IDs.
   *
   * @param {string[]} inviteIds - The IDs of the invites to soft-delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were also soft deleted.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await userModuleService.softDeleteInvites([
   *   "invite_123", "invite_321"
   * ])
   */
  softDeleteInvites<TReturnableLinkableKeys extends string = string>(
    inviteIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  /**
   * This method restores soft deleted invites by their IDs.
   *
   * @param {string[]} inviteIds - The IDs of invites to restore.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the invites. You can pass to its `returnLinkableKeys`
   * property any of the invite's relation attribute names.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<TReturnableLinkableKeys, string[]>>} An object that includes the IDs of related records that were restored.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await userModuleService.restoreInvites([
   *   "invite_123", "invite_321"
   * ])
   */
  restoreInvites<TReturnableLinkableKeys extends string = string>(
    inviteIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
}
