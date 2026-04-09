import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityDTO,
  AuthIdentityProviderService,
  EmailPassAuthProviderOptions,
  Logger,
} from "@medusajs/framework/types"
import { AbstractAuthModuleProvider, isString, MedusaError, } from "@medusajs/framework/utils"
import Scrypt from "scrypt-kdf"
import { isPresent } from "@medusajs/utils"

type InjectedDependencies = {
  logger: Logger
}

type AuthIdentityParams = {
  email: string;
  password: string;
  authIdentityService: AuthIdentityProviderService
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
  data: { password?: string; email?: string; entity_id: string },
  authIdentityService: AuthIdentityProviderService
) {
  const { password, email, entity_id } = data ?? {}

  if (!entity_id) {
    return {
      success: false,
      error: `Cannot update ${this.provider} provider identity without entity_id`,
    }
  }

  let authIdentity
  const providerMetadataUpdate: Record<string, unknown> = {}
  const userMetadataUpdate: Record<string, unknown> = {}

  if (password && isString(password)) {
    providerMetadataUpdate.password = await this.hashPassword(password)
  }

  if (email && isString(email)) {
    userMetadataUpdate.email = email
  }

  try {
    const updateData: {
      provider_metadata?: Record<string, unknown>
      user_metadata?: Record<string, unknown>
    } = {}

    if (Object.keys(providerMetadataUpdate).length > 0) {
      updateData.provider_metadata = providerMetadataUpdate
    }

    if (Object.keys(userMetadataUpdate).length > 0) {
      updateData.user_metadata = userMetadataUpdate
    }

    authIdentity = await authIdentityService.update(entity_id, updateData)
  } catch (error) {
    return { success: false, error: error.message }
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
      const identity = await authIdentityService.retrieve({
        entity_id: email,
      })

      // If app_metadata is not defined or empty, it means no actor was assigned to the auth_identity yet (still "claimable")
      if (!isPresent(identity.app_metadata)) {
        const updatedAuthIdentity = await this.upsertAuthIdentity('update', {
          email,
          password,
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
        const createdAuthIdentity = await this.upsertAuthIdentity('create', {
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

  private async upsertAuthIdentity(type: 'update' | 'create', { email, password, authIdentityService }: AuthIdentityParams) {
    const passwordHash = await this.hashPassword(password)

    const authIdentity = type === 'create' ? await authIdentityService.create({
        entity_id: email,
        provider_metadata: {
          password: passwordHash,
        },
      }) : await authIdentityService.update(email, {
      provider_metadata: {
        password: passwordHash,
      },
    })

    const copy = JSON.parse(JSON.stringify(authIdentity))
    const providerIdentity = copy.provider_identities?.find(
      (pi) => pi.provider === this.provider
    )!
    delete providerIdentity.provider_metadata?.password

    return copy
  }
}
