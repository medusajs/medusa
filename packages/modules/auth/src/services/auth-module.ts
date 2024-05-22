import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthTypes,
  Context,
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
} from "@medusajs/types"

import { AuthIdentity } from "@models"

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
  authIdentityService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [AuthIdentity]

export default class AuthModuleService<
    TAuthIdentity extends AuthIdentity = AuthIdentity
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    AuthTypes.AuthIdentityDTO,
    {
      AuthIdentity: { dto: AuthTypes.AuthIdentityDTO }
    }
  >(AuthIdentity, generateMethodForModels, entityNameToLinkableKeysMap)
  implements AuthTypes.IAuthModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected authIdentityService_: ModulesSdkTypes.InternalModuleService<TAuthIdentity>

  constructor(
    { authIdentityService, baseRepository }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.authIdentityService_ = authIdentityService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  create(
    data: AuthTypes.CreateAuthIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO[]>

  create(
    data: AuthTypes.CreateAuthIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO>

  @InjectManager("baseRepository_")
  async create(
    data: AuthTypes.CreateAuthIdentityDTO[] | AuthTypes.CreateAuthIdentityDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthIdentityDTO | AuthTypes.AuthIdentityDTO[]> {
    const authIdentities = await this.authIdentityService_.create(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO[]>(
      authIdentities,
      {
        populate: true,
      }
    )
  }

  update(
    data: AuthTypes.UpdateAuthIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO[]>

  update(
    data: AuthTypes.UpdateAuthIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO>

  // TODO: should be pluralized, see convention about the methods naming or the abstract module service interface definition @engineering
  @InjectManager("baseRepository_")
  async update(
    data: AuthTypes.UpdateAuthIdentityDTO | AuthTypes.UpdateAuthIdentityDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthIdentityDTO | AuthTypes.AuthIdentityDTO[]> {
    const updatedUsers = await this.authIdentityService_.update(
      data,
      sharedContext
    )

    const serializedUsers = await this.baseRepository_.serialize<
      AuthTypes.AuthIdentityDTO[]
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
