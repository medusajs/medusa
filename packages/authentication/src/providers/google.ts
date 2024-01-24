import {
  AbstractAuthenticationModuleProvider,
  MedusaError,
} from "@medusajs/utils"
import { AuthProviderService, AuthUserService } from "@services"
import jwt, { JwtPayload } from "jsonwebtoken"

import { AuthProvider } from "@models"
import { AuthenticationResponse } from "@medusajs/types"
import { AuthorizationCode } from "simple-oauth2"
import url from "url"

type InjectedDependencies = {
  authUserService: AuthUserService
  authProviderService: AuthProviderService
}

type AuthenticationInput = {
  connection: { encrypted: boolean }
  url: string
  headers: { host: string }
  query: Record<string, string>
  body: Record<string, string>
}

type ProviderConfig = {
  clientID: string
  clientSecret: string
  callbackURL: string
}

class GoogleProvider extends AbstractAuthenticationModuleProvider {
  public static PROVIDER = "google"
  public static DISPLAY_NAME = "Google Authentication"

  protected readonly authUserSerivce_: AuthUserService
  protected readonly authProviderService_: AuthProviderService

  constructor({ authUserService, authProviderService }: InjectedDependencies) {
    super()

    this.authUserSerivce_ = authUserService
    this.authProviderService_ = authProviderService
  }

  private async validateConfig(config: Partial<ProviderConfig>) {
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

  private originalURL(req: AuthenticationInput) {
    const tls = req.connection.encrypted,
      host = req.headers.host,
      protocol = tls ? "https" : "http",
      path = req.url || ""
    return protocol + "://" + host + path
  }

  async getProviderConfig(req: AuthenticationInput): Promise<ProviderConfig> {
    const { config } = (await this.authProviderService_.retrieve(
      GoogleProvider.PROVIDER
    )) as AuthProvider & { config: ProviderConfig }

    this.validateConfig(config || {})

    const { callbackURL } = config

    const parsedCallbackUrl = !url.parse(callbackURL).protocol
      ? url.resolve(this.originalURL(req), callbackURL)
      : callbackURL

    return { ...config, callbackURL: parsedCallbackUrl }
  }

  async authenticate(
    req: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    if (req.query && req.query.error) {
      return {
        success: false,
        error: `${req.query.error_description}, read more at: ${req.query.error_uri}`,
      }
    }

    let config

    try {
      config = await this.getProviderConfig(req)
    } catch (error) {
      return { success: false, error: error.message }
    }

    let { callbackURL, clientID, clientSecret } = config

    const meta: ProviderConfig = {
      clientID,
      callbackURL,
      clientSecret,
    }

    const code = (req.query && req.query.code) || (req.body && req.body.code)

    // Redirect to google
    if (!code) {
      return this.getRedirect(meta)
    }

    return await this.validateCallback(code, meta)
  }

  // abstractable
  private async validateCallback(
    code: string,
    { clientID, callbackURL, clientSecret }: ProviderConfig
  ) {
    const client = this.getAuthorizationCodeHandler({ clientID, clientSecret })

    const tokenParams = {
      code,
      redirect_uri: callbackURL,
    }

    try {
      const accessToken = await client.getToken(tokenParams)

      return await this.verify_(accessToken.token.id_token)
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // abstractable
  async verify_(refreshToken: string) {
    const jwtData = (await jwt.decode(refreshToken, {
      complete: true,
    })) as JwtPayload
    const entity_id = jwtData.payload.email

    let authUser

    try {
      authUser = await this.authUserSerivce_.retrieveByProviderAndEntityId(
        entity_id,
        GoogleProvider.PROVIDER
      )
    } catch (error) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        authUser = await this.authUserSerivce_.create([
          {
            entity_id,
            provider_id: GoogleProvider.PROVIDER,
            user_metadata: jwtData!.payload,
          },
        ])
      } else {
        return { success: false, error: error.message }
      }
    }

    return { success: true, authUser }
  }

  // Abstractable
  private getRedirect({ clientID, callbackURL, clientSecret }: ProviderConfig) {
    const client = this.getAuthorizationCodeHandler({ clientID, clientSecret })

    const location = client.authorizeURL({
      redirect_uri: callbackURL,
      scope: "email profile",
    })

    return { success: true, location }
  }

  private getAuthorizationCodeHandler({
    clientID,
    clientSecret,
  }: {
    clientID: string
    clientSecret: string
  }) {
    const config = {
      client: {
        id: clientID,
        secret: clientSecret,
      },
      auth: {
        // TODO: abstract to not be google specific
        authorizeHost: "https://accounts.google.com",
        authorizePath: "/o/oauth2/v2/auth",
        tokenHost: "https://www.googleapis.com",
        tokenPath: "/oauth2/v4/token",
      },
    }

    return new AuthorizationCode(config)
  }
}

export default GoogleProvider
