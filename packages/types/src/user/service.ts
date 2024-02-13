import {
  CreateInviteDTO,
  CreateUserDTO,
  UpdateInviteDTO,
  UpdateUserDTO,
} from "./mutations"
import { FilterableUserProps, InviteDTO, UserDTO } from "./common"

import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { RestoreReturn, SoftDeleteReturn } from "../dal"

export interface IUserModuleService extends IModuleService {
  retrieve(
    id: string,
    config?: FindConfig<UserDTO>,
    sharedContext?: Context
  ): Promise<UserDTO>

  list(
    filters?: FilterableUserProps,
    config?: FindConfig<UserDTO>,
    sharedContext?: Context
  ): Promise<UserDTO[]>

  listAndCount(
    filters?: FilterableUserProps,
    config?: FindConfig<UserDTO>,
    sharedContext?: Context
  ): Promise<[UserDTO[], number]>

  create(data: CreateUserDTO[], sharedContext?: Context): Promise<UserDTO[]>

  create(data: CreateUserDTO, sharedContext?: Context): Promise<UserDTO>

  update(data: UpdateUserDTO[], sharedContext?: Context): Promise<UserDTO[]>

  update(data: UpdateUserDTO, sharedContext?: Context): Promise<UserDTO>

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

  softDelete<TReturnableLinkableKeys extends string = string>(
    inviteIds: string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>

  restore<TReturnableLinkableKeys extends string = string>(
    inviteIds: string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<TReturnableLinkableKeys, string[]> | void>
}
