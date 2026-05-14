import { AuthTypes, Context, Logger } from "@medusajs/framework/types"
import { AuthMfaProviderRegistrationPrefix } from "@types"

export interface IAuthMfaProvider {
  method: AuthTypes.AuthMfaChallengeMethod

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

export interface AuthMfaProvider extends IAuthMfaProvider {
  method: AuthTypes.AuthMfaProvider

  start(
    data: AuthTypes.AuthMfaStartDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthMfaStartResponse>

  verifySetup(
    data: AuthTypes.AuthMfaVerifyDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthMfaDTO>
}

export interface RecoveryCodeAuthMfaProvider extends IAuthMfaProvider {
  method: "recovery_code"

  generateCodes(
    data: { auth_identity_id: string; count: number },
    sharedContext?: Context
  ): Promise<string[]>
}

type InjectedDependencies = {
  logger?: Logger
  [key: `${typeof AuthMfaProviderRegistrationPrefix}${string}`]: IAuthMfaProvider
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

  protected retrieveProviderRegistration(
    method: string
  ): IAuthMfaProvider {
    try {
      return this.dependencies[
        `${AuthMfaProviderRegistrationPrefix}${method}`
      ] as IAuthMfaProvider
    } catch (err) {
      if (err.name === "AwilixResolutionError") {
        const errMessage = `
Unable to retrieve the MFA method with id: ${method}
Please make sure that the method is registered in the container and it is configured correctly in your project configuration file.`

        this.#logger.error(`AwilixResolutionError: ${err.message}`, err)

        throw new Error(errMessage)
      }

      const errMessage = `Unable to retrieve the MFA method with id: ${method}, the following error occurred: ${err.message}`
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
    data: AuthTypes.AuthMfaStartDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthMfaStartResponse> {
    const provider = this.retrieveProviderRegistration(method)

    if (!this.isAuthMfaProvider_(provider)) {
      throw new Error(`MFA provider "${method}" does not support setup`)
    }

    return await provider.start(data, sharedContext)
  }

  async verifySetup(
    method: string,
    data: AuthTypes.AuthMfaVerifyDTO,
    sharedContext?: Context
  ): Promise<AuthTypes.AuthMfaDTO> {
    const provider = this.retrieveProviderRegistration(method)

    if (!this.isAuthMfaProvider_(provider)) {
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
        `MFA method "${method}" does not support recovery code generation`
      )
    }

    return await provider.generateCodes(data, sharedContext)
  }

  protected isAuthMfaProvider_(
    provider: IAuthMfaProvider
  ): provider is AuthMfaProvider {
    return "start" in provider && "verifySetup" in provider
  }

  protected isRecoveryCodeProvider_(
    provider: IAuthMfaProvider
  ): provider is RecoveryCodeAuthMfaProvider {
    return "generateCodes" in provider
  }
}
