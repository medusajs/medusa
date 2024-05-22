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

import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"
import AuthProviderService from "./auth-provider"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  authIdentityService: ModulesSdkTypes.InternalModuleService<any>
  authProviderService: AuthProviderService
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
  protected readonly authProviderService_: AuthProviderService

  constructor(
    {
      authIdentityService,
      authProviderService,
      baseRepository,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.authIdentityService_ = authIdentityService
    this.authProviderService_ = authProviderService
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

  async authenticate(
    provider: string,
    authenticationData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    try {
      return await this.authProviderService_.authenticate(
        provider,
        authenticationData,
        {
          retrieve: async ({ entity_id, provider }) => {
            const authIdentity = await this.authIdentityService_.retrieve({
              entity_id,
              provider,
            })

            return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO>(
              authIdentity
            )
          },
          create: async (data: AuthTypes.CreateAuthIdentityDTO) => {
            const createdAuthIdentity = await this.authIdentityService_.create(
              data
            )

            return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO>(
              createdAuthIdentity
            )
          },
        }
      )
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async validateCallback(
    provider: string,
    authenticationData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    try {
      return await this.authProviderService_.validateCallback(
        provider,
        authenticationData,
        {
          retrieve: async ({ entity_id, provider }) => {
            const authIdentity = await this.authIdentityService_.retrieve({
              entity_id,
              provider,
            })

            return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO>(
              authIdentity
            )
          },
          create: async (data: AuthTypes.CreateAuthIdentityDTO) => {
            const createdAuthIdentity = await this.authIdentityService_.create(
              data
            )

            return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO>(
              createdAuthIdentity
            )
          },
        }
      )
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
