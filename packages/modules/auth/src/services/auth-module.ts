import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityDTO,
  AuthIdentityProviderService,
  AuthTypes,
  Context,
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  ResetPasswordInput,
} from "@medusajs/types"

import { AuthIdentity, ProviderIdentity } from "@models"

import { joinerConfig } from "../joiner-config"

import {
  InjectManager,
  MedusaContext,
  MedusaError,
  MedusaService,
} from "@medusajs/utils"
import AuthProviderService from "./auth-provider"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  authIdentityService: ModulesSdkTypes.IMedusaInternalService<any>
  providerIdentityService: ModulesSdkTypes.IMedusaInternalService<any>
  authProviderService: AuthProviderService
}
export default class AuthModuleService
  extends MedusaService<{
    AuthIdentity: { dto: AuthTypes.AuthIdentityDTO }
    ProviderIdentity: { dto: AuthTypes.ProviderIdentityDTO }
  }>({ AuthIdentity, ProviderIdentity })
  implements AuthTypes.IAuthModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected authIdentityService_: ModulesSdkTypes.IMedusaInternalService<AuthIdentity>
  protected providerIdentityService_: ModulesSdkTypes.IMedusaInternalService<ProviderIdentity>
  protected readonly authProviderService_: AuthProviderService

  constructor(
    {
      authIdentityService,
      providerIdentityService,
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
    this.providerIdentityService_ = providerIdentityService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  // @ts-expect-error
  createAuthIdentities(
    data: AuthTypes.CreateAuthIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO[]>

  createAuthIdentities(
    data: AuthTypes.CreateAuthIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO>

  @InjectManager("baseRepository_")
  async createAuthIdentities(
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

  // TODO: Update to follow convention
  updateAuthIdentites(
    data: AuthTypes.UpdateAuthIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO[]>

  updateAuthIdentites(
    data: AuthTypes.UpdateAuthIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO>

  @InjectManager("baseRepository_")
  async updateAuthIdentites(
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

  async register(
    provider: string,
    authenticationData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    try {
      return await this.authProviderService_.register(
        provider,
        authenticationData,
        this.getAuthIdentityProviderService(provider)
      )
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  // @ts-expect-error
  createProviderIdentities(
    data: AuthTypes.CreateProviderIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthTypes.ProviderIdentityDTO[]>

  createProviderIdentities(
    data: AuthTypes.CreateProviderIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.ProviderIdentityDTO>

  @InjectManager("baseRepository_")
  async createProviderIdentities(
    data:
      | AuthTypes.CreateProviderIdentityDTO[]
      | AuthTypes.CreateProviderIdentityDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.ProviderIdentityDTO | AuthTypes.ProviderIdentityDTO[]> {
    const providerIdentities = await this.providerIdentityService_.create(
      data,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      AuthTypes.ProviderIdentityDTO | AuthTypes.ProviderIdentityDTO[]
    >(providerIdentities)
  }

  updateProviderIdentites(
    data: AuthTypes.UpdateProviderIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthTypes.ProviderIdentityDTO[]>

  updateProviderIdentites(
    data: AuthTypes.UpdateProviderIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.ProviderIdentityDTO>

  @InjectManager("baseRepository_")
  async updateProviderIdentites(
    data:
      | AuthTypes.UpdateProviderIdentityDTO
      | AuthTypes.UpdateProviderIdentityDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.ProviderIdentityDTO | AuthTypes.ProviderIdentityDTO[]> {
    const updatedProviders = await this.providerIdentityService_.update(
      data,
      sharedContext
    )

    const serializedProviders = await this.baseRepository_.serialize<
      AuthTypes.ProviderIdentityDTO[]
    >(updatedProviders)

    return Array.isArray(data) ? serializedProviders : serializedProviders[0]
  }

  async authenticate(
    provider: string,
    authenticationData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    try {
      return await this.authProviderService_.authenticate(
        provider,
        authenticationData,
        this.getAuthIdentityProviderService(provider)
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
        this.getAuthIdentityProviderService(provider)
      )
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async resetPassword(
    provider: string,
    resetPasswordData: ResetPasswordInput
  ): Promise<AuthIdentityDTO> {
    return await this.authProviderService_.resetPassword(
      provider,
      resetPasswordData,
      this.getAuthIdentityProviderService(provider)
    )
  }

  async generateResetPasswordToken(
    provider: string,
    entityId: string
  ): Promise<string> {
    return await this.authProviderService_.generateResetPasswordToken(
      provider,
      entityId,
      this.getAuthIdentityProviderService(provider)
    )
  }

  getAuthIdentityProviderService(
    provider: string
  ): AuthIdentityProviderService {
    return {
      retrieve: async ({ entity_id }) => {
        const authIdentities = await this.authIdentityService_.list(
          {
            provider_identities: {
              entity_id,
              provider,
            },
          },
          {
            relations: ["provider_identities"],
          }
        )

        if (!authIdentities.length) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `AuthIdentity with entity_id "${entity_id}" not found`
          )
        }

        if (authIdentities.length > 1) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Multiple authIdentities found for entity_id "${entity_id}"`
          )
        }

        return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO>(
          authIdentities[0]
        )
      },

      create: async (data: {
        entity_id: string
        provider_metadata?: Record<string, unknown>
        user_metadata?: Record<string, unknown>
      }) => {
        const normalizedRequest = {
          provider_identities: [
            {
              entity_id: data.entity_id,
              provider_metadata: data.provider_metadata,
              user_metadata: data.user_metadata,
              provider,
            },
          ],
        }

        const createdAuthIdentity = await this.authIdentityService_.create(
          normalizedRequest
        )

        return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO>(
          createdAuthIdentity
        )
      },
      updateProviderIdentity: async (data: {
        id: string
        provider_metadata?: Record<string, unknown>
        user_metadata?: Record<string, unknown>
      }) => {
        const normalizedRequest = {
          id: data.id,
          provider_metadata: data.provider_metadata,
          user_metadata: data.user_metadata,
        }

        const updatedAuthIdentity = await this.updateProviderIdentites(
          normalizedRequest
        )

        return await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO>(
          updatedAuthIdentity
        )
      },
    }
  }
}
