import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityDTO,
  AuthIdentityProviderService,
  EmailPassAuthProviderOptions,
  Logger,
  ResetPasswordInput,
} from "@medusajs/types"
import {
  AbstractAuthModuleProvider,
  isString,
  MedusaError,
} from "@medusajs/utils"
import jwt from "jsonwebtoken"
import Scrypt from "scrypt-kdf"

type InjectedDependencies = {
  logger: Logger
}

interface LocalServiceConfig extends EmailPassAuthProviderOptions {}

// 15 minutes in milliseconds
const DEFAULT_VALID_RESET_PASSWORD_TOKEN_DURATION = 60 * 15
export class EmailPassAuthService extends AbstractAuthModuleProvider {
  protected config_: LocalServiceConfig
  protected logger_: Logger

  constructor(
    { logger }: InjectedDependencies,
    options: EmailPassAuthProviderOptions
  ) {
    super(
      {},
      { provider: "emailpass", displayName: "Email/Password Authentication" }
    )
    this.config_ = options
    this.logger_ = logger
  }

  protected async hashPassword(password: string) {
    const hashConfig = this.config_.hashConfig ?? { logN: 15, r: 8, p: 1 }
    const passwordHash = await Scrypt.kdf(password, hashConfig)
    return passwordHash.toString("base64")
  }

  async generateResetPasswordToken(
    entityId: string,
    authIdentityService: AuthIdentityProviderService
  ): Promise<string> {
    const authIdentity = await authIdentityService.retrieve({
      entity_id: entityId,
    })

    const providerIdentity = authIdentity.provider_identities?.find(
      (pi) => pi.provider === this.provider
    )

    if (!providerIdentity) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Provider identity with entity_id ${entityId} and provider ${this.provider} not found`
      )
    }

    const secret = providerIdentity.provider_metadata?.password as string
    // TODO: Add config to provider module
    const expiry = DEFAULT_VALID_RESET_PASSWORD_TOKEN_DURATION
    const payload = {
      entity_id: entityId,
      provider_identity_id: providerIdentity.id,
    }

    const token = jwt.sign(payload, secret, {
      expiresIn: expiry,
    })

    return token
  }

  async resetPassword(
    resetPasswordData: ResetPasswordInput,
    authIdentityService: AuthIdentityProviderService
  ) {
    const { entityId: email, password } = resetPasswordData ?? {}

    if (!password || !isString(password)) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, `Invalid password`)
    }

    if (!email || !isString(email)) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, `Invalid email`)
    }

    const passwordHash = await this.hashPassword(password)

    let updatedAuthIdentity: AuthIdentityDTO | undefined

    const authIdentity = await authIdentityService.retrieve({
      entity_id: email,
    })

    const emailPassProvider = authIdentity.provider_identities?.find(
      (pi) => pi.provider === this.provider
    )

    if (!emailPassProvider) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Provider identity with entity_id ${email} and provider ${this.provider} not found`
      )
    }

    updatedAuthIdentity = await authIdentityService.updateProviderIdentity({
      id: emailPassProvider.id,
      provider_metadata: {
        ...emailPassProvider?.provider_metadata,
        password: passwordHash,
      },
    })

    return updatedAuthIdentity
  }

  protected async createAuthIdentity({ email, password, authIdentityService }) {
    const passwordHash = await this.hashPassword(password)

    const createdAuthIdentity = await authIdentityService.create({
      entity_id: email,
      provider_metadata: {
        password: passwordHash,
      },
    })

    const copy = JSON.parse(JSON.stringify(createdAuthIdentity))
    const providerIdentity = copy.provider_identities?.find(
      (pi) => pi.provider === this.provider
    )!
    delete providerIdentity.provider_metadata?.password

    return copy
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
        const copy = JSON.parse(JSON.stringify(authIdentity))
        const providerIdentity = copy.provider_identities?.find(
          (pi) => pi.provider === this.provider
        )!
        delete providerIdentity.provider_metadata?.password

        return {
          success,
          authIdentity: copy,
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
      await authIdentityService.retrieve({
        entity_id: email,
      })

      return {
        success: false,
        error: "Identity with email already exists",
      }
    } catch (error) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        const createdAuthIdentity = await this.createAuthIdentity({
          email,
          password,
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
}
