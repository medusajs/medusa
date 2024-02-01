import jwt from "jsonwebtoken"

import {
  UserTypes,
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
} from "@medusajs/types"

import { User } from "@models"

import { joinerConfig } from "../joiner-config"
import { UserService } from "@services"

import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"
import {
  UserDTO,
  CreateUserDTO,
  FilterableUserProps,
  UpdateUserDTO,
} from "@medusajs/types"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  userService: UserService<any>
}

export default class UserModuleService<TUser extends User = User>
  implements UserTypes.IUserModuleService
{
  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  protected baseRepository_: DAL.RepositoryService

  protected readonly userService_: UserService<any>

  constructor(
    { userService, baseRepository }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.userService_ = userService
  }

  @InjectManager("baseRepository_")
  async retrieveUser(
    id: string,
    config: FindConfig<UserDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserDTO> {
    const user = await this.userService_.retrieve(id, config, sharedContext)

    return await this.baseRepository_.serialize<UserTypes.UserDTO>(user, {
      exclude: ["password_hash"],
    })
  }

  @InjectManager("baseRepository_")
  async listUsers(
    filters: FilterableUserProps = {},
    config: FindConfig<UserDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserDTO[]> {
    const users = await this.userService_.list(filters, config, sharedContext)

    return await this.baseRepository_.serialize<UserTypes.UserDTO[]>(users, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listAndCountUsers(
    filters: FilterableUserProps = {},
    config: FindConfig<UserDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[UserDTO[], number]> {
    const [users, count] = await this.userService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<UserTypes.UserDTO[]>(users, {
        populate: true,
      }),
      count,
    ]
  }

  createUser(data: CreateUserDTO[], sharedContext?: Context): Promise<UserDTO[]>
  createUser(data: CreateUserDTO, sharedContext?: Context): Promise<UserDTO>

  @InjectManager("baseRepository_")
  async createUser(
    data: CreateUserDTO[] | CreateUserDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.UserDTO | UserTypes.UserDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const users = await this.createUsers_(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      UserTypes.UserDTO[]
    >(users, {
      populate: true,
    })

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async createUsers_(
    data: CreateUserDTO[],
    @MedusaContext() sharedContext: Context
  ): Promise<TUser[]> {
    return await this.userService_.create(data, sharedContext)
  }

  updateUser(data: UpdateUserDTO[], sharedContext?: Context): Promise<UserDTO[]>
  updateUser(data: UpdateUserDTO, sharedContext?: Context): Promise<UserDTO>

  @InjectManager("baseRepository_")
  async updateUser(
    data: UpdateUserDTO | UpdateUserDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.UserDTO | UserTypes.UserDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const updatedUsers = await this.updateUsers_(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      UserTypes.UserDTO[]
    >(updatedUsers, {
      populate: true,
    })

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateUsers_(
    data: UpdateUserDTO[],
    @MedusaContext() sharedContext: Context
  ): Promise<TUser[]> {
    return await this.userService_.update(data, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  async deleteUser(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.userService_.delete(ids, sharedContext)
  }
}
