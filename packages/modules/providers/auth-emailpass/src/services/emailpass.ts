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

type InjectedDependencies = {
  logger: Logger
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
    data: { email: string; password: string },
    authIdentityService: AuthIdentityProviderService
  ) {
    const { email, password } = data ?? {}

    if (!email || !isString(email)) {
      return {
        success: false,
        error: `Cannot update ${this.provider} provider identity without email`,
      }
    }

    if (!password || !isString(password)) {
      return { success: true }
    }

    let authIdentity

    try {
      const passwordHash = await this.hashPassword(password)

      authIdentity = await authIdentityService.update(email, {
        provider_metadata: {
          password: passwordHash,
        },
      })
    } catch (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      authIdentity,
    }
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
