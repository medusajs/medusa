import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityDTO,
  AuthIdentityProviderService,
  EmailPassAuthProviderOptions,
  Logger,
} from "@medusajs/framework/types"
import {
  AbstractAuthModuleProvider,
  isString,
  MedusaError,
} from "@medusajs/framework/utils"
import Scrypt from "scrypt-kdf"
import { isPresent } from "@medusajs/utils"

type InjectedDependencies = {
  logger: Logger
}

type AuthIdentityParams = {
  email: string
  password: string
  actor_type?: string
  authIdentityService: AuthIdentityProviderService
}


type ProviderMetadata = {
  password?: unknown
  verified_at?: string | null
  requires_verification?: boolean
}

interface LocalServiceConfig extends EmailPassAuthProviderOptions {}

export class EmailPassAuthService extends AbstractAuthModuleProvider {
  static identifier = "emailpass"
  static DISPLAY_NAME = "Email/Password Authentication"

  protected config_: LocalServiceConfig
  protected logger_: Logger

  constructor(
    { logger }: InjectedDependencies,
    options: EmailPassAuthProviderOptions
  ) {
    // @ts-ignore
    super(...arguments)
    this.config_ = options
    this.logger_ = logger
  }

  protected async hashPassword(password: string) {
    const hashConfig = this.config_.hashConfig ?? { logN: 15, r: 8, p: 1 }
    const passwordHash = await Scrypt.kdf(password, hashConfig)
    return passwordHash.toString("base64")
  }

  async update(
    data: { password: string; entity_id: string },
    authIdentityService: AuthIdentityProviderService
  ) {
    const { password, entity_id } = data ?? {}

    if (!entity_id) {
      return {
        success: false,
        error: `Cannot update ${this.provider} provider identity without entity_id`,
      }
    }

    if (!password || !isString(password)) {
      return { success: true }
    }

    let authIdentity

    try {
      const passwordHash = await this.hashPassword(password)
      const providerMetadata = await this.getProviderMetadata_(
        entity_id,
        authIdentityService
      )

      authIdentity = await authIdentityService.update(entity_id, {
        provider_metadata: {
          ...providerMetadata,
          password: passwordHash,
        },
      })
    } catch (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      authIdentity: this.sanitizeAuthIdentity_(authIdentity),
    }
  }

  async authenticate(
    userData: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const { email, password } = userData.body ?? {}

    if (!password || !isString(password)) {
      return {
        success: false,
        error: "Password should be a string",
      }
    }

    if (!email || !isString(email)) {
      return {
        success: false,
        error: "Email should be a string",
      }
    }

    let authIdentity: AuthIdentityDTO | undefined

    try {
      authIdentity = await authIdentityService.retrieve({
        entity_id: email,
      })
    } catch (error) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        return {
          success: false,
          error: "Invalid email or password",
        }
      }

      return { success: false, error: error.message }
    }

    const providerIdentity = authIdentity.provider_identities?.find(
      (pi) => pi.provider === this.provider
    )!
    const passwordHash = providerIdentity.provider_metadata?.password

    if (isString(passwordHash)) {
      const buf = Buffer.from(passwordHash as string, "base64")
      const success = await Scrypt.verify(buf, password)

      if (success) {
        return {
          success,
          authIdentity: this.sanitizeAuthIdentity_(authIdentity),
        }
      }
    }

    return {
      success: false,
      error: "Invalid email or password",
    }
  }

  async register(
    userData: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const { email, password } = userData.body ?? {}

    if (!password || !isString(password)) {
      return {
        success: false,
        error: "Password should be a string",
      }
    }

    if (!email || !isString(email)) {
      return {
        success: false,
        error: "Email should be a string",
      }
    }

    try {
      const identity = await authIdentityService.retrieve({
        entity_id: email,
      })

      // If app_metadata is not defined or empty, it means no actor was assigned to the auth_identity yet (still "claimable")
      if (!isPresent(identity.app_metadata)) {
        const updatedAuthIdentity = await this.upsertAuthIdentity("update", {
          email,
          password,
          actor_type: userData.actor_type,
          authIdentityService,
        })

        return {
          success: true,
          authIdentity: updatedAuthIdentity,
        }
      }

      return {
        success: false,
        error: "Identity with email already exists",
      }
    } catch (error) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        const createdAuthIdentity = await this.upsertAuthIdentity("create", {
          email,
          password,
          actor_type: userData.actor_type,
          authIdentityService,
        })

        return {
          success: true,
          authIdentity: createdAuthIdentity,
        }
      }

      return { success: false, error: error.message }
    }
  }

  private async upsertAuthIdentity(
    type: "update" | "create",
    { email, password, actor_type, authIdentityService }: AuthIdentityParams
  ) {
    const passwordHash = await this.hashPassword(password)
    const providerMetadata: ProviderMetadata =
      type === "update"
        ? await this.getProviderMetadata_(email, authIdentityService)
        : {}

    providerMetadata.password = passwordHash

    if (
      this.requiresVerification_(actor_type) &&
      !providerMetadata.verified_at &&
      providerMetadata.requires_verification !== false
    ) {
      providerMetadata.requires_verification = true
    }

    const authIdentity =
      type === "create"
        ? await authIdentityService.create({
            entity_id: email,
            provider_metadata: providerMetadata,
          })
        : await authIdentityService.update(email, {
            provider_metadata: providerMetadata,
          })

    return this.sanitizeAuthIdentity_(authIdentity)
  }

  private requiresVerification_(actorType?: string): boolean {
    if (!actorType) {
      return false
    }

    return this.config_.require_verification?.includes(actorType) === true
  }

  private async getProviderMetadata_(
    entityId: string,
    authIdentityService: AuthIdentityProviderService
  ): Promise<ProviderMetadata> {
    const authIdentity = await authIdentityService.retrieve({
      entity_id: entityId,
    })
    const providerIdentity = this.getProviderIdentity_(authIdentity)

    return {
      ...(providerIdentity.provider_metadata ?? {}),
    }
  }

  private sanitizeAuthIdentity_(
    authIdentity: AuthIdentityDTO
  ): AuthIdentityDTO {
    const copy = JSON.parse(JSON.stringify(authIdentity))
    const providerIdentity = this.getProviderIdentity_(copy)

    delete providerIdentity.provider_metadata?.password

    return copy
  }

  private getProviderIdentity_(authIdentity: AuthIdentityDTO) {
    return authIdentity.provider_identities?.find(
      (pi) => pi.provider === this.provider
    )!
  }
}
