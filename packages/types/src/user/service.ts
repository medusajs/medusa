import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"
import { FilterableUserProps, UserDTO } from "./common"
import { CreateUserDTO, UpdateUserDTO } from "./mutations"

export interface IUserModuleService extends IModuleService {
  retrieveUser(
    id: string,
    config?: FindConfig<UserDTO>,
    sharedContext?: Context
  ): Promise<UserDTO>

  listUsers(
    filters?: FilterableUserProps,
    config?: FindConfig<UserDTO>,
    sharedContext?: Context
  ): Promise<UserDTO[]>

  listAndCountUsers(
    filters?: FilterableUserProps,
    config?: FindConfig<UserDTO>,
    sharedContext?: Context
  ): Promise<[UserDTO[], number]>

  createUser(data: CreateUserDTO[], sharedContext?: Context): Promise<UserDTO[]>

  createUser(data: CreateUserDTO, sharedContext?: Context): Promise<UserDTO>

  updateUser(data: UpdateUserDTO[], sharedContext?: Context): Promise<UserDTO[]>

  updateUser(data: UpdateUserDTO, sharedContext?: Context): Promise<UserDTO>

  deleteUser(ids: string[], sharedContext?: Context): Promise<void>
}
