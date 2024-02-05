import {
  Context,
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  UserTypes,
  CreateUserDTO,
  UpdateUserDTO,
  UserDTO,
  ModulesSdkTypes,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

import { User } from "@models"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  userService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = []

export default class UserModuleService<TUser extends User = User>
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    UserDTO,
    {}
  >(User, generateMethodForModels, entityNameToLinkableKeysMap)
  implements UserTypes.IUserModuleService
{
  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  protected baseRepository_: DAL.RepositoryService

  protected readonly userService_: ModulesSdkTypes.InternalModuleService<TUser>

  constructor(
    { userService, baseRepository }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.userService_ = userService
  }

  create(data: CreateUserDTO[], sharedContext?: Context): Promise<UserDTO[]>
  create(data: CreateUserDTO, sharedContext?: Context): Promise<UserDTO>

  @InjectManager("baseRepository_")
  async create(
    data: CreateUserDTO[] | CreateUserDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.UserDTO | UserTypes.UserDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const users = await this.create_(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      UserTypes.UserDTO[]
    >(users, {
      populate: true,
    })

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: CreateUserDTO[],
    @MedusaContext() sharedContext: Context
  ): Promise<TUser[]> {
    return await this.userService_.create(data, sharedContext)
  }

  update(data: UpdateUserDTO[], sharedContext?: Context): Promise<UserDTO[]>
  update(data: UpdateUserDTO, sharedContext?: Context): Promise<UserDTO>

  @InjectManager("baseRepository_")
  async update(
    data: UpdateUserDTO | UpdateUserDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.UserDTO | UserTypes.UserDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const updatedUsers = await this.update_(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      UserTypes.UserDTO[]
    >(updatedUsers, {
      populate: true,
    })

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: UpdateUserDTO[],
    @MedusaContext() sharedContext: Context
  ): Promise<TUser[]> {
    return await this.userService_.update(data, sharedContext)
  }
}
