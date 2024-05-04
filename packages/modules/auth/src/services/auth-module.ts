import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthTypes,
  AuthUserDTO,
  Context,
  CreateAuthUserDTO,
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  UpdateAuthUserDTO,
} from "@medusajs/types"

import { AuthUser } from "@models"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

import {
  AbstractAuthModuleProvider,
  InjectManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  authUserService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [AuthUser]

export default class AuthModuleService<TAuthUser extends AuthUser = AuthUser>
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    AuthTypes.AuthUserDTO,
    {
      AuthUser: { dto: AuthUserDTO }
    }
  >(AuthUser, generateMethodForModels, entityNameToLinkableKeysMap)
  implements AuthTypes.IAuthModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected authUserService_: ModulesSdkTypes.InternalModuleService<TAuthUser>

  constructor(
    { authUserService, baseRepository }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.authUserService_ = authUserService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  create(
    data: CreateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  create(data: CreateAuthUserDTO, sharedContext?: Context): Promise<AuthUserDTO>

  @InjectManager("baseRepository_")
  async create(
    data: CreateAuthUserDTO[] | CreateAuthUserDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthUserDTO | AuthTypes.AuthUserDTO[]> {
    const authUsers = await this.authUserService_.create(data, sharedContext)

    return await this.baseRepository_.serialize<AuthTypes.AuthUserDTO[]>(
      authUsers,
      {
        populate: true,
      }
    )
  }

  update(
    data: UpdateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  update(data: UpdateAuthUserDTO, sharedContext?: Context): Promise<AuthUserDTO>

  // TODO: should be pluralized, see convention about the methods naming or the abstract module service interface definition @engineering
  @InjectManager("baseRepository_")
  async update(
    data: UpdateAuthUserDTO | UpdateAuthUserDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthUserDTO | AuthTypes.AuthUserDTO[]> {
    const updatedUsers = await this.authUserService_.update(data, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      AuthTypes.AuthUserDTO[]
    >(updatedUsers, {
      populate: true,
    })

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  protected getRegisteredAuthenticationProvider(
    provider: string,
    { authScope }: AuthenticationInput
  ): AbstractAuthModuleProvider {
    let containerProvider: AbstractAuthModuleProvider
    try {
      containerProvider = this.__container__[`auth_provider_${provider}`]
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `AuthenticationProvider: ${provider} wasn't registered in the module. Have you configured your options correctly?`
      )
    }

    return containerProvider.withScope(authScope)
  }

  async authenticate(
    provider: string,
    authenticationData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    try {
      const registeredProvider = this.getRegisteredAuthenticationProvider(
        provider,
        authenticationData
      )

      return await registeredProvider.authenticate(authenticationData)
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async validateCallback(
    provider: string,
    authenticationData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    try {
      const registeredProvider = this.getRegisteredAuthenticationProvider(
        provider,
        authenticationData
      )

      return await registeredProvider.validateCallback(authenticationData)
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
