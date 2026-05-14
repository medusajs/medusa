import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  AuthTypes,
  Context,
  DAL,
  FindConfig,
  ICacheService,
  InferEntityType,
  InternalModuleDeclaration,
  Logger,
  ModuleJoinerConfig,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import {
  InjectTransactionManager,
  InjectManager,
  MedusaContext,
  MedusaError,
  MedusaService,
  generateEntityId,
} from "@medusajs/framework/utils"
import {
  AuthIdentity,
  AuthMfaFactor,
  AuthMfaRecoveryCode,
  ProviderIdentity,
} from "@models"
import { AuthModuleOptions } from "@types"
import { joinerConfig } from "../joiner-config"
import AuthProviderService from "./auth-provider"
import AuthMfaProviderService from "./mfa-provider"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  authIdentityService: ModulesSdkTypes.IMedusaInternalService<any>
  authMfaFactorService: ModulesSdkTypes.IMedusaInternalService<any>
  authMfaRecoveryCodeService: ModulesSdkTypes.IMedusaInternalService<any>
  providerIdentityService: ModulesSdkTypes.IMedusaInternalService<any>
  authProviderService: AuthProviderService
  authMfaProviderService: AuthMfaProviderService
  logger?: Logger
  cache?: ICacheService
}
export default class AuthModuleService
  extends MedusaService<{
    AuthIdentity: { dto: AuthTypes.AuthIdentityDTO }
    ProviderIdentity: { dto: AuthTypes.ProviderIdentityDTO }
  }>({ AuthIdentity, ProviderIdentity })
  implements AuthTypes.IAuthModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected authIdentityService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof AuthIdentity>
  >
  protected authMfaFactorService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof AuthMfaFactor>
  >
  protected authMfaRecoveryCodeService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof AuthMfaRecoveryCode>
  >
  protected providerIdentityService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof ProviderIdentity>
  >
  protected readonly authProviderService_: AuthProviderService
  protected readonly authMfaProviderService_: AuthMfaProviderService
  protected readonly cache_: ICacheService | undefined
  protected readonly moduleOptions_: AuthModuleOptions

  constructor(
    {
      authIdentityService,
      authMfaFactorService,
      authMfaRecoveryCodeService,
      providerIdentityService,
      authProviderService,
      authMfaProviderService,
      baseRepository,
      cache,
    }: InjectedDependencies,
    moduleOptions: AuthModuleOptions = {},
    protected readonly moduleDeclaration?: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.authIdentityService_ = authIdentityService
    this.authMfaFactorService_ = authMfaFactorService
    this.authMfaRecoveryCodeService_ = authMfaRecoveryCodeService
    this.authProviderService_ = authProviderService
    this.authMfaProviderService_ = authMfaProviderService
    this.providerIdentityService_ = providerIdentityService
    this.cache_ = cache
    this.moduleOptions_ = moduleOptions
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

  @InjectManager()
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
  // @ts-expect-error
  updateAuthIdentities(
    data: AuthTypes.UpdateAuthIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO[]>

  // @ts-expect-error
  updateAuthIdentities(
    data: AuthTypes.UpdateAuthIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthIdentityDTO>

  @InjectManager()
  // @ts-expect-error
  async updateAuthIdentities(
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

    return serializedUsers
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

  // @ts-expect-error
  createProviderIdentities(
    data: AuthTypes.CreateProviderIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.ProviderIdentityDTO>

  @InjectManager()
  // @ts-expect-error
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

  // @ts-expect-error
  updateProviderIdentities(
    data: AuthTypes.UpdateProviderIdentityDTO[],
    sharedContext?: Context
  ): Promise<AuthTypes.ProviderIdentityDTO[]>

  // @ts-expect-error
  updateProviderIdentities(
    data: AuthTypes.UpdateProviderIdentityDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.ProviderIdentityDTO>

  @InjectManager()
  // @ts-expect-error
  async updateProviderIdentities(
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

    return serializedProviders
  }

  async updateProvider(
    provider: string,
    data: Record<string, unknown>
  ): Promise<AuthenticationResponse> {
    try {
      return await this.authProviderService_.update(
        provider,
        data,
        this.getAuthIdentityProviderService(provider)
      )
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async authenticate(
    provider: string,
    authenticationData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    try {
      const response = await this.authProviderService_.authenticate(
        provider,
        authenticationData,
        this.getAuthIdentityProviderService(provider)
      )

      return await this.applyMfaRequirement_(response, {
        actor_type: authenticationData.actor_type,
        auth_provider: provider,
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async validateCallback(
    provider: string,
    authenticationData: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    try {
      const response = await this.authProviderService_.validateCallback(
        provider,
        authenticationData,
        this.getAuthIdentityProviderService(provider)
      )

      return await this.applyMfaRequirement_(response, {
        actor_type: authenticationData.actor_type,
        auth_provider: provider,
      })
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @InjectManager()
  async startAuthMfa(
    data: AuthTypes.AuthMfaStartDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaStartResponse> {
    return await this.startAuthMfa_(data, sharedContext)
  }

  @InjectTransactionManager()
  protected async startAuthMfa_(
    data: AuthTypes.AuthMfaStartDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaStartResponse> {
    await this.authIdentityService_.retrieve(
      data.auth_identity_id,
      {},
      sharedContext
    )

    return await this.authMfaProviderService_.start(
      data.provider,
      data,
      sharedContext
    )
  }

  @InjectManager()
  async verifyAuthMfa(
    data: AuthTypes.AuthMfaVerifyDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaDTO> {
    return await this.verifyAuthMfa_(data, sharedContext)
  }

  @InjectTransactionManager()
  protected async verifyAuthMfa_(
    data: AuthTypes.AuthMfaVerifyDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaDTO> {
    const factor = await this.authMfaFactorService_.retrieve(
      data.id,
      {},
      sharedContext
    )

    return await this.authMfaProviderService_.verifySetup(
      factor.provider,
      data,
      sharedContext
    )
  }

  @InjectManager()
  async createAuthMfaChallenge(
    data: AuthTypes.CreateAuthMfaChallengeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaChallengeDTO> {
    return await this.createAuthMfaChallenge_(data, sharedContext)
  }

  @InjectTransactionManager()
  protected async createAuthMfaChallenge_(
    data: AuthTypes.CreateAuthMfaChallengeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaChallengeDTO> {
    await this.authIdentityService_.retrieve(
      data.auth_identity_id,
      {},
      sharedContext
    )

    const methods = await this.getAvailableMfaChallengeMethods_(
      data.auth_identity_id,
      sharedContext
    )

    if (!methods.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Auth identity does not have any enabled MFA methods"
      )
    }

    const challengeConfig = this.getMfaChallengeConfig_()
    const challenge: AuthTypes.AuthMfaChallengeDTO = {
      id: generateEntityId(undefined, "authmfachal"),
      auth_identity_id: data.auth_identity_id,
      actor_type: data.actor_type ?? null,
      auth_provider: data.auth_provider ?? null,
      methods,
      expires_at: new Date(Date.now() + challengeConfig.ttlSeconds * 1000),
      attempts: 0,
      max_attempts: challengeConfig.maxAttempts,
      completed_at: null,
      metadata: data.metadata ?? null,
    }

    await this.setMfaChallenge_(challenge, challengeConfig.ttlSeconds)

    return challenge
  }

  @InjectManager()
  async verifyAuthMfaChallenge(
    data: AuthTypes.VerifyAuthMfaChallengeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaChallengeDTO> {
    return await this.verifyAuthMfaChallenge_(data, sharedContext)
  }

  protected async verifyAuthMfaChallenge_(
    data: AuthTypes.VerifyAuthMfaChallengeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaChallengeDTO> {
    const challenge = await this.retrieveMfaChallenge_(data.id)

    this.assertMfaChallengeCanBeVerified_(challenge, data.method)

    const valid = await this.authMfaProviderService_.verify(
      data.method,
      {
        auth_identity_id: challenge.auth_identity_id!,
        code: data.code,
      },
      sharedContext
    )

    if (!valid) {
      const attempts = challenge.attempts + 1

      await this.setMfaChallenge_({
        ...challenge,
        attempts,
      })

      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        attempts >= challenge.max_attempts
          ? "MFA challenge has too many failed attempts"
          : "Invalid MFA challenge code"
      )
    }

    const completedChallenge: AuthTypes.AuthMfaChallengeDTO = {
      ...challenge,
      completed_at: new Date(),
    }

    await this.setMfaChallenge_(completedChallenge)

    return completedChallenge
  }

  @InjectManager()
  async disableAuthMfa(
    data: AuthTypes.DisableAuthMfaDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaDTO> {
    const factor = await this.authMfaFactorService_.retrieve(
      data.id,
      {},
      sharedContext
    )

    if (this.getMfaDisablePolicy_() === "challenge") {
      if (!data.method || !data.code) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "MFA verification code is required to disable MFA"
        )
      }

      const valid = await this.authMfaProviderService_.verify(
        data.method,
        {
          auth_identity_id: factor.auth_identity_id,
          code: data.code,
        },
        sharedContext
      )

      if (!valid) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Invalid MFA verification code"
        )
      }
    }

    const disabledFactor = await this.authMfaFactorService_.update(
      {
        id: data.id,
        status: "disabled",
      },
      sharedContext
    )

    return await this.serializeMfaFactor_(disabledFactor)
  }

  @InjectManager()
  async listAuthMfa(
    filters: AuthTypes.FilterableAuthMfaProps = {},
    config: FindConfig<AuthTypes.AuthMfaDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaDTO[]> {
    const factors = await this.authMfaFactorService_.list(
      filters,
      config,
      sharedContext
    )

    return await Promise.all(
      factors.map((factor) => this.serializeMfaFactor_(factor))
    )
  }

  @InjectManager()
  async generateAuthMfaRecoveryCodes(
    data: AuthTypes.GenerateAuthMfaRecoveryCodesDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.GenerateAuthMfaRecoveryCodesResponse> {
    return await this.generateAuthMfaRecoveryCodes_(data, sharedContext)
  }

  @InjectTransactionManager()
  protected async generateAuthMfaRecoveryCodes_(
    data: AuthTypes.GenerateAuthMfaRecoveryCodesDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<AuthTypes.GenerateAuthMfaRecoveryCodesResponse> {
    const count =
      data.count ?? this.moduleOptions_.mfa?.recovery_code_count ?? 10

    if (!Number.isInteger(count) || count < 1 || count > 50) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Recovery code count must be between 1 and 50"
      )
    }

    await this.authIdentityService_.retrieve(
      data.auth_identity_id,
      {},
      sharedContext
    )

    const codes = await this.authMfaProviderService_.generateCodes(
      "recovery_code",
      {
        auth_identity_id: data.auth_identity_id,
        count,
      },
      sharedContext
    )

    return { codes }
  }

  @InjectManager()
  async useAuthMfaRecoveryCode(
    data: AuthTypes.UseAuthMfaRecoveryCodeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    return await this.useAuthMfaRecoveryCode_(data, sharedContext)
  }

  @InjectTransactionManager()
  protected async useAuthMfaRecoveryCode_(
    data: AuthTypes.UseAuthMfaRecoveryCodeDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const valid = await this.authMfaProviderService_.verify(
      "recovery_code",
      data,
      sharedContext
    )

    if (!valid) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Recovery code is invalid or already used"
      )
    }
  }

  protected async applyMfaRequirement_(
    response: AuthenticationResponse,
    context: Pick<
      AuthTypes.CreateAuthMfaChallengeDTO,
      "actor_type" | "auth_provider"
    >
  ): Promise<AuthenticationResponse> {
    if (!response.success || !response.authIdentity || response.location) {
      return response
    }

    const methods = await this.getAvailableMfaChallengeMethods_(
      response.authIdentity.id
    )

    if (!methods.length) {
      return response
    }

    const mfaChallenge = await this.createAuthMfaChallenge_({
      auth_identity_id: response.authIdentity.id,
      actor_type: context.actor_type ?? null,
      auth_provider: context.auth_provider ?? null,
    })

    return {
      success: true,
      mfa_challenge: mfaChallenge,
    }
  }

  protected async getAvailableMfaChallengeMethods_(
    authIdentityId: string,
    sharedContext: Context = {}
  ): Promise<AuthTypes.AuthMfaChallengeMethod[]> {
    const factors = await this.authMfaFactorService_.list(
      {
        auth_identity_id: authIdentityId,
        status: "enabled",
      },
      { select: ["provider"] },
      sharedContext
    )

    const factorMethods = Array.from(
      new Set(
        factors.map((factor) => factor.provider as AuthTypes.AuthMfaProvider)
      )
    )

    if (!factorMethods.length) {
      return factorMethods
    }

    const methods: AuthTypes.AuthMfaChallengeMethod[] = []

    for (const method of factorMethods) {
      const canVerify =
        await this.authMfaProviderService_.canVerifyForAuthIdentity(
          method,
          {
            auth_identity_id: authIdentityId,
          },
          sharedContext
        )

      if (canVerify) {
        methods.push(method)
      }
    }

    if (!methods.length) {
      return methods
    }

    const hasRecoveryCodes =
      await this.authMfaProviderService_.canVerifyForAuthIdentity(
        "recovery_code",
        {
          auth_identity_id: authIdentityId,
        },
        sharedContext
      )

    if (hasRecoveryCodes) {
      methods.push("recovery_code")
    }

    return methods
  }

  protected async serializeMfaFactor_(
    factor: InferEntityType<typeof AuthMfaFactor>
  ): Promise<AuthTypes.AuthMfaDTO> {
    const serialized = await this.baseRepository_.serialize<
      AuthTypes.AuthMfaDTO & {
        provider_metadata?: Record<string, unknown>
      }
    >(factor)

    delete serialized.provider_metadata

    return serialized
  }

  protected assertMfaChallengeCanBeVerified_(
    challenge: AuthTypes.AuthMfaChallengeDTO,
    method: AuthTypes.AuthMfaChallengeMethod
  ): void {
    if (challenge.completed_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "MFA challenge has already been completed"
      )
    }

    if (new Date(challenge.expires_at).getTime() <= Date.now()) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "MFA challenge has expired"
      )
    }

    if (challenge.attempts >= challenge.max_attempts) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "MFA challenge has too many failed attempts"
      )
    }

    if (
      !challenge.methods.includes(method)
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `MFA challenge does not support method "${method}"`
      )
    }
  }

  protected getMfaChallengeConfig_(): {
    ttlSeconds: number
    maxAttempts: number
  } {
    const ttlSeconds = this.moduleOptions_.mfa?.challenge_ttl_seconds ?? 300
    const maxAttempts = this.moduleOptions_.mfa?.challenge_max_attempts ?? 5

    if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "MFA challenge TTL must be a positive integer"
      )
    }

    if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "MFA challenge max attempts must be a positive integer"
      )
    }

    return {
      ttlSeconds,
      maxAttempts,
    }
  }

  protected getMfaDisablePolicy_(): "challenge" | "session" {
    const policy = this.moduleOptions_.mfa?.disable_policy ?? "session"

    if (policy !== "challenge" && policy !== "session") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'MFA disable policy must be either "challenge" or "session"'
      )
    }

    return policy
  }

  protected async retrieveMfaChallenge_(
    id: string
  ): Promise<AuthTypes.AuthMfaChallengeDTO> {
    const challenge = await this.getCache_().get<AuthTypes.AuthMfaChallengeDTO>(
      this.getMfaChallengeCacheKey_(id)
    )

    if (!challenge) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `MFA challenge with id "${id}" was not found`
      )
    }

    return {
      ...challenge,
      expires_at: new Date(challenge.expires_at),
      completed_at: challenge.completed_at
        ? new Date(challenge.completed_at)
        : null,
    }
  }

  protected async setMfaChallenge_(
    challenge: AuthTypes.AuthMfaChallengeDTO,
    ttlSeconds?: number
  ): Promise<void> {
    const ttl =
      ttlSeconds ??
      Math.ceil((new Date(challenge.expires_at).getTime() - Date.now()) / 1000)

    if (ttl < 1) {
      return
    }

    await this.getCache_().set(
      this.getMfaChallengeCacheKey_(challenge.id),
      challenge,
      ttl
    )
  }

  protected getMfaChallengeCacheKey_(id: string): string {
    return `auth:mfa:challenge:${id}`
  }

  protected getCache_(): ICacheService {
    if (!this.cache_) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Cache module dependency is required when using MFA challenges"
      )
    }

    return this.cache_
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
      update: async (
        entity_id: string,
        data: {
          provider_metadata?: Record<string, unknown>
          user_metadata?: Record<string, unknown>
        }
      ) => {
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

        const providerIdentityData = authIdentities[0].provider_identities.find(
          (pi) => pi.provider === provider
        )

        if (!providerIdentityData) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `ProviderIdentity with entity_id "${entity_id}" not found`
          )
        }

        const updatedProviderIdentity =
          await this.providerIdentityService_.update({
            id: providerIdentityData.id,
            ...data,
          })

        const serializedResponse =
          await this.baseRepository_.serialize<AuthTypes.AuthIdentityDTO>(
            authIdentities[0]
          )
        const serializedProviderIdentity =
          await this.baseRepository_.serialize<AuthTypes.ProviderIdentityDTO>(
            updatedProviderIdentity
          )

        serializedResponse.provider_identities = [
          ...(serializedResponse.provider_identities?.filter(
            (p) => p.provider !== provider
          ) ?? []),
          serializedProviderIdentity,
        ]

        return serializedResponse
      },
      setState: async (key: string, value: Record<string, unknown>) => {
        if (!this.cache_) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Cache module dependency is required when using OAuth providers that require state"
          )
        }

        // 20 minutes. Can be made configurable if necessary, but this is a good default.
        this.cache_.set(key, value, 1200)
      },
      getState: async (key: string) => {
        if (!this.cache_) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Cache module dependency is required when using OAuth providers that require state"
          )
        }

        return await this.cache_.get(key)
      },
    }
  }
}
