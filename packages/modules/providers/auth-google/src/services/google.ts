import {
  Logger,
  GoogleAuthProviderOptions,
  AuthenticationResponse,
  AuthenticationInput,
  AuthIdentityProviderService,
} from "@medusajs/types"
import { AbstractAuthModuleProvider, MedusaError } from "@medusajs/utils"
import jwt, { JwtPayload } from "jsonwebtoken"

type InjectedDependencies = {
  logger: Logger
}

interface LocalServiceConfig extends GoogleAuthProviderOptions {}

// TODO: Add state param that is stored in Redis, to prevent CSRF attacks
export class GoogleAuthService extends AbstractAuthModuleProvider {
  protected config_: LocalServiceConfig
  protected logger_: Logger

  constructor(
    { logger }: InjectedDependencies,
    options: GoogleAuthProviderOptions
  ) {
    super({}, { provider: "google", displayName: "Google Authentication" })
    this.validateConfig(options)
    this.config_ = options
    this.logger_ = logger
  }

  async authenticate(
    req: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    if (req.query?.error) {
      return {
        success: false,
        error: `${req.query.error_description}, read more at: ${req.query.error_uri}`,
      }
    }

    return this.getRedirect(this.config_)
  }

  async validateCallback(
    req: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    if (req.query && req.query.error) {
      return {
        success: false,
        error: `${req.query.error_description}, read more at: ${req.query.error_uri}`,
      }
    }

    const code = req.query?.code ?? req.body?.code
    if (!code) {
      return { success: false, error: "No code provided" }
    }

    const params = `client_id=${this.config_.clientID}&client_secret=${
      this.config_.clientSecret
    }&code=${code}&redirect_uri=${encodeURIComponent(
      this.config_.callbackURL
    )}&grant_type=authorization_code`
    const exchangeTokenUrl = new URL(
      `https://oauth2.googleapis.com/token?${params}`
    )

    try {
      const response = await fetch(exchangeTokenUrl.toString(), {
        method: "POST",
      }).then((r) => {
        if (!r.ok) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Could not exchange token, ${r.status}, ${r.statusText}`
          )
        }

        return r.json()
      })

      const { authIdentity, success } = await this.verify_(
        response.id_token as string,
        authIdentityService
      )

      return {
        success,
        authIdentity,
        successRedirectUrl: this.config_.successRedirectUrl,
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async verify_(
    idToken: string | undefined,
    authIdentityService: AuthIdentityProviderService
  ) {
    if (!idToken) {
      return { success: false, error: "No ID found" }
    }

    const jwtData = jwt.decode(idToken, {
      complete: true,
    }) as JwtPayload
    const payload = jwtData.payload

    if (!payload.email_verified) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Email not verified, cannot proceed with authentication"
      )
    }

    // TODO: We should probably use something else than email here, like the `sub` field (which is more constant than the email)
    const entity_id = payload.email
    const userMetadata = {
      name: payload.name,
      picture: payload.picture,
      given_name: payload.given_name,
      family_name: payload.family_name,
    }

    let authIdentity

    try {
      authIdentity = await authIdentityService.retrieve({
        entity_id,
        provider: this.provider,
      })
    } catch (error) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        const createdAuthIdentity = await authIdentityService.create({
          entity_id,
          provider: this.provider,
          user_metadata: userMetadata,
        })
        authIdentity = createdAuthIdentity
      } else {
        return { success: false, error: error.message }
      }
    }

    return {
      success: true,
      authIdentity,
    }
  }

  private getRedirect({ clientID, callbackURL }: LocalServiceConfig) {
    const redirectUrlParam = `redirect_uri=${encodeURIComponent(callbackURL)}`
    const clientIdParam = `client_id=${clientID}`
    const responseTypeParam = "response_type=code"
    const scopeParam = "scope=email+profile+openid"

    const authUrl = new URL(
      `https://accounts.google.com/o/oauth2/v2/auth?${[
        redirectUrlParam,
        clientIdParam,
        responseTypeParam,
        scopeParam,
      ].join("&")}`
    )

    return { success: true, location: authUrl.toString() }
  }

  private validateConfig(config: LocalServiceConfig) {
    if (!config.clientID) {
      throw new Error("Google clientID is required")
    }

    if (!config.clientSecret) {
      throw new Error("Google clientSecret is required")
    }

    if (!config.callbackURL) {
      throw new Error("Google callbackUrl is required")
    }
  }
}
