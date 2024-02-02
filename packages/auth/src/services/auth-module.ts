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

import EmailPasswordProvider from "./email-password"
import GoogleProvider from "./google"
import { AuthUser } from "@models"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

import {
  AbstractAuthModuleProvider,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"

type AuthModuleOptions = {
  providers: {
    name: "emailpass" | "google"
    scopes: string[] | { [key: string]: Record<string, unknown> }
  }[]
}

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  authUserService: ModulesSdkTypes.InternalModuleService<any>
  authProviderService: ModulesSdkTypes.InternalModuleService<any>
  emailPasswordProvider: EmailPasswordProvider
  googleProvider: GoogleProvider
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
  protected options_: AuthModuleOptions
  protected googleProvider_: GoogleProvider
  protected emailPasswordProvider_: EmailPasswordProvider

  constructor(
    {
      authUserService,
      baseRepository,
      googleProvider,
      emailPasswordProvider,
    }: InjectedDependencies,
    options: AuthModuleOptions,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.authUserService_ = authUserService
    this.options_ = options
    this.googleProvider_ = googleProvider
    this.emailPasswordProvider_ = emailPasswordProvider
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
    const input = Array.isArray(data) ? data : [data]

    const authUsers = await this.createAuthUsers_(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      AuthTypes.AuthUserDTO[]
    >(authUsers, {
      populate: true,
    })

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
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
    // Find the relevant provider and configur
    const providerConfig = this.options_.providers.find(
      (p) => p.name === provider
    )
    if (!providerConfig) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `AuthenticationProvider with for provider: ${provider} wasn't registered in the module. Have you configured your options correctly?`
      )
    }

    let scopeConfig = Array.isArray(providerConfig.scopes)
      ? providerConfig.scopes.find((s) => s === authScope)
      : providerConfig.scopes[authScope]

    if (!scopeConfig) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `AuthenticationProvider with for provider: ${provider} wasn't registered in the module. Have you configured your options correctly?`
      )
    }

    scopeConfig = typeof scopeConfig === "object" ? scopeConfig : {}

    let authProvider: AbstractAuthModuleProvider
    switch (provider) {
      case "emailpass":
        authProvider = this.emailPasswordProvider_.withConfig(
          authScope,
          scopeConfig
        )
        break
      case "google":
        authProvider = this.googleProvider_.withConfig(authScope, scopeConfig)
        break
      // TODO: implement more providers
      default:
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `AuthenticationProvider with for provider: ${provider} wasn't registered in the module. Have you configured your options correctly?`
        )
    }

    return authProvider
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

  @InjectTransactionManager("baseRepository_")
  protected async createAuthUsers_(
    data: CreateAuthUserDTO[],
    @MedusaContext() sharedContext: Context
  ): Promise<TAuthUser[]> {
    return await this.authUserService_.create(data, sharedContext)
  }
}
