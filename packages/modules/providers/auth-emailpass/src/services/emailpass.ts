import {
  Logger,
  EmailPassAuthProviderOptions,
  AuthenticationResponse,
  AuthenticationInput,
  AuthIdentityProviderService,
  AuthIdentityDTO,
} from "@medusajs/types"
import {
  AbstractAuthModuleProvider,
  MedusaError,
  isString,
} from "@medusajs/utils"
import Scrypt from "scrypt-kdf"

type InjectedDependencies = {
  logger: Logger
}

interface LocalServiceConfig extends EmailPassAuthProviderOptions {}

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
        const config = this.config_.hashConfig ?? { logN: 15, r: 8, p: 1 }
        const passwordHash = await Scrypt.kdf(password, config)

        const createdAuthIdentity = await authIdentityService.create({
          entity_id: email,
          provider_metadata: {
            password: passwordHash.toString("base64"),
          },
        })

        const copy = JSON.parse(JSON.stringify(createdAuthIdentity))
        const providerIdentity = copy.provider_identities?.find(
          (pi) => pi.provider === this.provider
        )!
        delete providerIdentity.provider_metadata?.password

        return {
          success: true,
          authIdentity: copy,
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
}
