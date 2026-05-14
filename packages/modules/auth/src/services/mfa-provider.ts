import { AuthTypes, Context, Logger } from "@medusajs/framework/types"
import { AuthMfaProviderRegistrationPrefix } from "@types"

export type AuthMfaProviderMethod = "totp" | "recovery_code" | (string & {})

export interface AuthMfaProvider {
  method: AuthMfaProviderMethod

  canVerifyForAuthIdentity(
    data: { auth_identity_id: string },
    sharedContext?: Context
  ): Promise<boolean>

  verify(
    data: {
      auth_identity_id: string
      code: string
    },
    sharedContext?: Context
  ): Promise<boolean>
}

export interface SetupAuthMfaProvider extends AuthMfaProvider {
  start(
    data: AuthTypes.StartAuthMfaDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.StartAuthMfaResponse>

  verifySetup(
    data: AuthTypes.VerifyAuthMfaDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthMfaDTO>
}

export interface RecoveryCodeAuthMfaProvider extends AuthMfaProvider {
  generateCodes(
    data: { auth_identity_id: string; count: number },
    sharedContext?: Context
  ): Promise<string[]>
}

type InjectedDependencies = {
  logger?: Logger
  [key: `${typeof AuthMfaProviderRegistrationPrefix}${string}`]: AuthMfaProvider
}

export default class AuthMfaProviderService {
  protected dependencies: InjectedDependencies
  #logger: Logger

  constructor(container: InjectedDependencies) {
    this.dependencies = container
    this.#logger = container["logger"]
      ? container.logger
      : (console as unknown as Logger)
  }

  protected retrieveProviderRegistration(method: string): AuthMfaProvider {
    try {
      return this.dependencies[
        `${AuthMfaProviderRegistrationPrefix}${method}`
      ] as AuthMfaProvider
    } catch (err) {
      if (err.name === "AwilixResolutionError") {
        const errMessage = `
Unable to retrieve the MFA provider with id: ${method}
Please make sure that the provider is registered in the container and it is configured correctly in your project configuration file.`

        this.#logger.error(`AwilixResolutionError: ${err.message}`, err)

        throw new Error(errMessage)
      }

      const errMessage = `Unable to retrieve the MFA provider with id: ${method}, the following error occurred: ${err.message}`
      this.#logger.error(errMessage)

      throw new Error(errMessage)
    }
  }

  async canVerifyForAuthIdentity(
    method: string,
    data: { auth_identity_id: string },
    sharedContext?: Context
  ): Promise<boolean> {
    return await this.retrieveProviderRegistration(
      method
    ).canVerifyForAuthIdentity(data, sharedContext)
  }

  async verify(
    method: string,
    data: { auth_identity_id: string; code: string },
    sharedContext?: Context
  ): Promise<boolean> {
    return await this.retrieveProviderRegistration(method).verify(
      data,
      sharedContext
    )
  }

  async start(
    method: string,
    data: AuthTypes.StartAuthMfaDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.StartAuthMfaResponse> {
    const provider = this.retrieveProviderRegistration(method)

    if (!this.isSetupProvider_(provider)) {
      throw new Error(`MFA provider "${method}" does not support setup`)
    }

    return await provider.start(data, sharedContext)
  }

  async verifySetup(
    method: string,
    data: AuthTypes.VerifyAuthMfaDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthMfaDTO> {
    const provider = this.retrieveProviderRegistration(method)

    if (!this.isSetupProvider_(provider)) {
      throw new Error(
        `MFA provider "${method}" does not support setup verification`
      )
    }

    return await provider.verifySetup(data, sharedContext)
  }

  async generateCodes(
    method: string,
    data: { auth_identity_id: string; count: number },
    sharedContext?: Context
  ): Promise<string[]> {
    const provider = this.retrieveProviderRegistration(method)

    if (!this.isRecoveryCodeProvider_(provider)) {
      throw new Error(
        `MFA provider "${method}" does not support recovery code generation`
      )
    }

    return await provider.generateCodes(data, sharedContext)
  }

  protected isSetupProvider_(
    provider: AuthMfaProvider
  ): provider is SetupAuthMfaProvider {
    return "start" in provider && "verifySetup" in provider
  }

  protected isRecoveryCodeProvider_(
    provider: AuthMfaProvider
  ): provider is RecoveryCodeAuthMfaProvider {
    return "generateCodes" in provider
  }
}
