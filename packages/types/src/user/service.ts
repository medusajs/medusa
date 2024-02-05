import { CreateUserDTO, UpdateUserDTO } from "./mutations"
import { FilterableUserProps, UserDTO } from "./common"

import { Context } from "../shared-context"
import { FindConfig } from "../common"
import { IModuleService } from "../modules-sdk"

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
}
