import jwt from "jsonwebtoken"

import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthTypes,
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  MedusaContainer,
  ModuleJoinerConfig,
  JWTGenerationOptions,
} from "@medusajs/types"

import { AuthProvider, AuthUser } from "@models"

import { joinerConfig } from "../joiner-config"
import { AuthProviderService, AuthUserService } from "@services"

import {
  AbstractAuthModuleProvider,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
} from "@medusajs/utils"
import {
  AuthProviderDTO,
  AuthUserDTO,
  CreateAuthProviderDTO,
  CreateAuthUserDTO,
  FilterableAuthProviderProps,
  FilterableAuthUserProps,
  UpdateAuthUserDTO,
} from "@medusajs/types"
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
  authUserService: AuthUserService<any>
  authProviderService: AuthProviderService<any>
}

export default class AuthModuleService<
  TAuthUser extends AuthUser = AuthUser,
  TAuthProvider extends AuthProvider = AuthProvider
> implements AuthTypes.IAuthModuleService
{
  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  __hooks = {
    onApplicationStart: async () => await this.createProvidersOnLoad(),
  }

  protected __container__: MedusaContainer
  protected baseRepository_: DAL.RepositoryService

  protected authUserService_: AuthUserService<TAuthUser>
  protected authProviderService_: AuthProviderService<TAuthProvider>
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
    this.__container__ = arguments[0]
    this.baseRepository_ = baseRepository
    this.authUserService_ = authUserService
    this.authProviderService_ = authProviderService
    this.options_ = options
  }

  async retrieveAuthProvider(
    provider: string,
    config: FindConfig<AuthProviderDTO> = {},
    sharedContext: Context = {}
  ): Promise<AuthProviderDTO> {
    const authProvider = await this.authProviderService_.retrieve(
      provider,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<AuthTypes.AuthProviderDTO>(
      authProvider,
      { populate: true }
    )
  }

  async listAuthProviders(
    filters: FilterableAuthProviderProps = {},
    config: FindConfig<AuthProviderDTO> = {},
    sharedContext: Context = {}
  ): Promise<AuthProviderDTO[]> {
    const authProviders = await this.authProviderService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<AuthTypes.AuthProviderDTO[]>(
      authProviders,
      { populate: true }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCountAuthProviders(
    filters: FilterableAuthProviderProps = {},
    config: FindConfig<AuthProviderDTO>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[AuthTypes.AuthProviderDTO[], number]> {
    const [authProviders, count] = await this.authProviderService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<AuthTypes.AuthProviderDTO[]>(
        authProviders,
        { populate: true }
      ),
      count,
    ]
  }

  async generateJwtToken(
    authUserId: string,
    scope: string,
    options: JWTGenerationOptions = {}
  ): Promise<string> {
    const authUser = await this.authUserService_.retrieve(authUserId)
    return jwt.sign({ id: authUser.id, scope }, this.options_.jwt_secret, {
      expiresIn: options.expiresIn || "1d",
    })
  }

  async retrieveAuthUserFromJwtToken(
    token: string,
    scope: string
  ): Promise<AuthUserDTO> {
    let decoded: AuthJWTPayload
    try {
      const verifiedToken = jwt.verify(token, this.options_.jwt_secret)
      decoded = verifiedToken as AuthJWTPayload
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "The provided JWT token is invalid"
      )
    }

    if (decoded.scope !== scope) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "The provided JWT token is invalid"
      )
    }

    const authUser = await this.authUserService_.retrieve(decoded.id)
    return await this.baseRepository_.serialize<AuthTypes.AuthUserDTO>(
      authUser,
      { populate: true }
    )
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

  @InjectTransactionManager("baseRepository_")
  protected async createAuthProviders_(
    data: any[],
    @MedusaContext() sharedContext: Context
  ): Promise<TAuthProvider[]> {
    return await this.authProviderService_.create(data, sharedContext)
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

  @InjectTransactionManager("baseRepository_")
  async deleteAuthProvider(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.authProviderService_.delete(ids, sharedContext)
  }

  @InjectManager("baseRepository_")
  async retrieveAuthUser(
    id: string,
    config: FindConfig<AuthUserDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthUserDTO> {
    const authUser = await this.authUserService_.retrieve(
      id,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<AuthTypes.AuthUserDTO>(
      authUser,
      {
        exclude: ["password_hash"],
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAuthUsers(
    filters: FilterableAuthUserProps = {},
    config: FindConfig<AuthUserDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthUserDTO[]> {
    const authUsers = await this.authUserService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<AuthTypes.AuthUserDTO[]>(
      authUsers,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCountAuthUsers(
    filters: FilterableAuthUserProps = {},
    config: FindConfig<AuthUserDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[AuthUserDTO[], number]> {
    const [authUsers, count] = await this.authUserService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<AuthTypes.AuthUserDTO[]>(authUsers, {
        populate: true,
      }),
      count,
    ]
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

  @InjectTransactionManager("baseRepository_")
  async deleteAuthUser(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.authUserService_.delete(ids, sharedContext)
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
