import jwt from "jsonwebtoken"

import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthProviderDTO,
  AuthTypes,
  AuthUserDTO,
  Context,
  CreateAuthProviderDTO,
  CreateAuthUserDTO,
  DAL,
  InternalModuleDeclaration,
  JWTGenerationOptions,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  UpdateAuthUserDTO,
} from "@medusajs/types"

import { AuthProvider, AuthUser } from "@models"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

import {
  AbstractAuthModuleProvider,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { ServiceTypes } from "@types"

type AuthModuleOptions = {
  jwt_secret: string
}

type AuthJWTPayload = {
  id: string
  scope: string
}

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  authUserService: ModulesSdkTypes.InternalModuleService<any>
  authProviderService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [AuthProvider, AuthUser]

export default class AuthModuleService<
    TAuthUser extends AuthUser = AuthUser,
    TAuthProvider extends AuthProvider = AuthProvider
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    AuthTypes.AuthProviderDTO,
    {
      AuthUser: { dto: AuthUserDTO }
      AuthProvider: { dto: AuthProviderDTO }
    }
  >(AuthProvider, generateMethodForModels, entityNameToLinkableKeysMap)
  implements AuthTypes.IAuthModuleService
{
  __hooks = {
    onApplicationStart: async () => await this.createProvidersOnLoad(),
  }
  protected baseRepository_: DAL.RepositoryService
  protected authUserService_: ModulesSdkTypes.InternalModuleService<TAuthUser>
  protected authProviderService_: ModulesSdkTypes.InternalModuleService<TAuthProvider>
  protected options_: AuthModuleOptions

  constructor(
    {
      authUserService,
      authProviderService,
      baseRepository,
    }: InjectedDependencies,
    options: AuthModuleOptions,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.authUserService_ = authUserService
    this.authProviderService_ = authProviderService
    this.options_ = options
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  async createAuthProvider(
    data: CreateAuthProviderDTO[],
    sharedContext?: Context
  ): Promise<AuthProviderDTO[]>

  async createAuthProvider(
    data: CreateAuthProviderDTO,
    sharedContext?: Context
  ): Promise<AuthProviderDTO>

  @InjectManager("baseRepository_")
  async createAuthProvider(
    data: CreateAuthProviderDTO | CreateAuthProviderDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthProviderDTO | AuthTypes.AuthProviderDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const providers = await this.createAuthProviders_(input, sharedContext)

    const serializedProviders = await this.baseRepository_.serialize<
      AuthTypes.AuthProviderDTO[]
    >(providers, {
      populate: true,
    })

    return Array.isArray(data) ? serializedProviders : serializedProviders[0]
  }

  updateAuthProvider(
    data: AuthTypes.UpdateAuthProviderDTO[],
    sharedContext?: Context
  ): Promise<AuthProviderDTO[]>

  updateAuthProvider(
    data: AuthTypes.UpdateAuthProviderDTO,
    sharedContext?: Context
  ): Promise<AuthProviderDTO>

  @InjectManager("baseRepository_")
  async updateAuthProvider(
    data: AuthTypes.UpdateAuthProviderDTO[] | AuthTypes.UpdateAuthProviderDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthProviderDTO | AuthTypes.AuthProviderDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const providers = await this.updateAuthProvider_(input, sharedContext)

    const serializedProviders = await this.baseRepository_.serialize<
      AuthTypes.AuthProviderDTO[]
    >(providers, {
      populate: true,
    })

    return Array.isArray(data) ? serializedProviders : serializedProviders[0]
  }

  async updateAuthProvider_(
    data: AuthTypes.UpdateAuthProviderDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TAuthProvider[]> {
    return await this.authProviderService_.update(data, sharedContext)
  }

  createAuthUser(
    data: CreateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  createAuthUser(
    data: CreateAuthUserDTO,
    sharedContext?: Context
  ): Promise<AuthUserDTO>

  @InjectManager("baseRepository_")
  async createAuthUser(
    data: CreateAuthUserDTO[] | CreateAuthUserDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthUserDTO | AuthTypes.AuthUserDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const authUsers = await this.createAuthUsers_(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      AuthTypes.AuthUserDTO[]
    >(authUsers, {
      populate: true,
    })

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  updateAuthUser(
    data: UpdateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>

  updateAuthUser(
    data: UpdateAuthUserDTO,
    sharedContext?: Context
  ): Promise<AuthUserDTO>

  // TODO: should be pluralized, see convention about the methods naming or the abstract module service interface definition @engineering
  @InjectManager("baseRepository_")
  async updateAuthUser(
    data: UpdateAuthUserDTO | UpdateAuthUserDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthUserDTO | AuthTypes.AuthUserDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const updatedUsers = await this.updateAuthUsers_(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      AuthTypes.AuthUserDTO[]
    >(updatedUsers, {
      populate: true,
    })

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async updateAuthUsers_(
    data: UpdateAuthUserDTO[],
    @MedusaContext() sharedContext: Context
  ): Promise<TAuthUser[]> {
    return await this.authUserService_.update(data, sharedContext)
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
        `AuthenticationProvider with for provider: ${provider} wasn't registered in the module. Have you configured your options correctly?`
      )
    }

    containerProvider.validateScope(authScope)

    return containerProvider
  }

  async authenticate(
    provider: string,
    authenticationData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    try {
      await this.retrieveAuthProvider(provider, {})

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
      await this.retrieveAuthProvider(provider, {})

      const registeredProvider = this.getRegisteredAuthenticationProvider(
        provider,
        authenticationData
      )

      return await registeredProvider.validateCallback(authenticationData)
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @InjectTransactionManager("baseRepository_")
  protected async createAuthProviders_(
    data: any[],
    @MedusaContext() sharedContext: Context
  ): Promise<TAuthProvider[]> {
    return await this.authProviderService_.create(data, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async createAuthUsers_(
    data: CreateAuthUserDTO[],
    @MedusaContext() sharedContext: Context
  ): Promise<TAuthUser[]> {
    return await this.authUserService_.create(data, sharedContext)
  }

  private async createProvidersOnLoad() {
    const providersToLoad = this.__container__["auth_providers"]

    const providers = await this.authProviderService_.list({
      provider: providersToLoad.map((p) => p.provider),
    })

    const loadedProvidersMap = new Map(providers.map((p) => [p.provider, p]))

    const providersToCreate: ServiceTypes.CreateAuthProviderDTO[] = []

    for (const provider of providersToLoad) {
      if (loadedProvidersMap.has(provider.provider)) {
        continue
      }

      providersToCreate.push({
        provider: provider.provider,
        name: provider.displayName,
      })
    }

    await this.authProviderService_.create(providersToCreate)
  }
}
