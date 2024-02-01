import {
  AuthenticationResponse,
  AuthenticationTypes,
  AuthProviderDTO,
  AuthUserDTO,
  CartTypes,
  Context,
  CreateAuthProviderDTO,
  CreateAuthUserDTO,
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  UpdateAuthUserDTO,
} from "@medusajs/types"

import { AuthProvider, AuthUser } from "@models"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

import {
  AbstractAuthenticationModuleProvider,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  authUserService: ModulesSdkTypes.InternalModuleService<any>
  authProviderService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [AuthProvider, AuthUser]

export default class AuthenticationModuleService<
    TAuthUser extends AuthUser = AuthUser,
    TAuthProvider extends AuthProvider = AuthProvider
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    CartTypes.CartDTO,
    {
      AuthUser: { dto: AuthenticationTypes.AuthUserDTO }
      AuthProvider: { dto: AuthenticationTypes.AuthProviderDTO }
    }
  >(AuthProvider, generateMethodForModels, entityNameToLinkableKeysMap)
  implements AuthenticationTypes.IAuthenticationModuleService
{
  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  __hooks = {
    onApplicationStart: async () => await this.createProvidersOnLoad(),
  }

  protected baseRepository_: DAL.RepositoryService

  protected authUserService_: ModulesSdkTypes.InternalModuleService<TAuthUser>
  protected authProviderService_: ModulesSdkTypes.InternalModuleService<TAuthProvider>

  constructor(
    {
      authUserService,
      authProviderService,
      baseRepository,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.authUserService_ = authUserService
    this.authProviderService_ = authProviderService
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
  ): Promise<
    AuthenticationTypes.AuthProviderDTO | AuthenticationTypes.AuthProviderDTO[]
  > {
    const input = Array.isArray(data) ? data : [data]

    const providers = await this.createAuthProviders_(input, sharedContext)

    const serializedProviders = await this.baseRepository_.serialize<
      | AuthenticationTypes.AuthProviderDTO
      | AuthenticationTypes.AuthProviderDTO[]
    >(providers, {
      populate: true,
    })

    return serializedProviders
  }

  @InjectTransactionManager("baseRepository_")
  protected async createAuthProviders_(
    data: any[],
    @MedusaContext() sharedContext: Context
  ): Promise<TAuthProvider[]> {
    return await this.authProviderService_.create(data, sharedContext)
  }

  updateAuthProvider(
    data: AuthenticationTypes.UpdateAuthProviderDTO[],
    sharedContext?: Context
  ): Promise<AuthProviderDTO[]>
  updateAuthProvider(
    data: AuthenticationTypes.UpdateAuthProviderDTO,
    sharedContext?: Context
  ): Promise<AuthProviderDTO>

  @InjectManager("baseRepository_")
  async updateAuthProvider(
    data:
      | AuthenticationTypes.UpdateAuthProviderDTO[]
      | AuthenticationTypes.UpdateAuthProviderDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    AuthenticationTypes.AuthProviderDTO | AuthenticationTypes.AuthProviderDTO[]
  > {
    const input = Array.isArray(data) ? data : [data]

    const providers = await this.updateAuthProvider_(input, sharedContext)

    const serializedProviders = await this.baseRepository_.serialize<
      AuthenticationTypes.AuthProviderDTO[]
    >(providers, {
      populate: true,
    })

    return Array.isArray(data) ? serializedProviders : serializedProviders[0]
  }

  async updateAuthProvider_(
    data: AuthenticationTypes.UpdateAuthProviderDTO[],
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
  ): Promise<
    AuthenticationTypes.AuthUserDTO | AuthenticationTypes.AuthUserDTO[]
  > {
    const input = Array.isArray(data) ? data : [data]

    const authUsers = await this.createAuthUsers_(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      AuthenticationTypes.AuthUserDTO[]
    >(authUsers, {
      populate: true,
    })

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async createAuthUsers_(
    data: CreateAuthUserDTO[],
    @MedusaContext() sharedContext: Context
  ): Promise<TAuthUser[]> {
    return await this.authUserService_.create(data, sharedContext)
  }

  updateAuthUser(
    data: UpdateAuthUserDTO[],
    sharedContext?: Context
  ): Promise<AuthUserDTO[]>
  updateAuthUser(
    data: UpdateAuthUserDTO,
    sharedContext?: Context
  ): Promise<AuthUserDTO>

  @InjectManager("baseRepository_")
  async updateAuthUser(
    data: UpdateAuthUserDTO | UpdateAuthUserDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<
    AuthenticationTypes.AuthUserDTO | AuthenticationTypes.AuthUserDTO[]
  > {
    const input = Array.isArray(data) ? data : [data]

    const updatedUsers = await this.updateAuthUsers_(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      AuthenticationTypes.AuthUserDTO[]
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
    provider: string
  ): AbstractAuthenticationModuleProvider {
    let containerProvider: AbstractAuthenticationModuleProvider
    try {
      containerProvider = this.__container__[`auth_provider_${provider}`]
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `AuthenticationProvider with for provider: ${provider} wasn't registered in the module. Have you configured your options correctly?`
      )
    }

    return containerProvider
  }

  @InjectTransactionManager("baseRepository_")
  async authenticate(
    provider: string,
    authenticationData: Record<string, unknown>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthenticationResponse> {
    let registeredProvider

    try {
      await this.retrieveAuthProvider(provider, {})

      registeredProvider = this.getRegisteredAuthenticationProvider(provider)

      return await registeredProvider.authenticate(authenticationData)
    } catch (error) {
      return { success: false, error: error.message }
    }
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
