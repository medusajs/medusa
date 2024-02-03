import {
  AuthProviderScope,
  AuthenticationInput,
  AuthenticationResponse,
} from "@medusajs/types"
import { AbstractAuthModuleProvider, MedusaError } from "@medusajs/utils"
import { AuthProviderService, AuthUserService } from "@services"
import jwt, { JwtPayload } from "jsonwebtoken"

import { AuthorizationCode } from "simple-oauth2"
import url from "url"

type InjectedDependencies = {
  authUserService: AuthUserService
  authProviderService: AuthProviderService
}

type ProviderConfig = {
  clientID: string
  clientSecret: string
  callbackURL: string
}

class GoogleProvider extends AbstractAuthModuleProvider {
  public static PROVIDER = "google"
  public static DISPLAY_NAME = "Google Authentication"

  protected readonly authUserSerivce_: AuthUserService
  protected readonly authProviderService_: AuthProviderService

  constructor({ authUserService, authProviderService }: InjectedDependencies) {
    super(arguments[0])

    this.authUserSerivce_ = authUserService
    this.authProviderService_ = authProviderService
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

    let config: ProviderConfig

    try {
      config = await this.getProviderConfig(req)
    } catch (error) {
      return { success: false, error: error.message }
    }

    return this.getRedirect(config)
  }

  async validateCallback(
    req: AuthenticationInput
  ): Promise<AuthenticationResponse> {
    if (req.query && req.query.error) {
      return {
        success: false,
        error: `${req.query.error_description}, read more at: ${req.query.error_uri}`,
      }
    }

    let config: ProviderConfig

    try {
      config = await this.getProviderConfig(req)
    } catch (error) {
      return { success: false, error: error.message }
    }

    const code = req.query?.code ?? req.body?.code

    return await this.validateCallbackToken(code, req.authScope, config)
  }

  // abstractable
  async verify_(refreshToken: string, scope: string) {
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
        const [createdAuthUser] = await this.authUserSerivce_.create([
          {
            entity_id,
            provider: GoogleProvider.PROVIDER,
            user_metadata: jwtData!.payload,
            scope,
          },
        ])
        authUser = createdAuthUser
      } else {
        return { success: false, error: error.message }
      }
    }

    return { success: true, authUser }
  }

  // abstractable
  private async validateCallbackToken(
    code: string,
    scope: string,
    { clientID, callbackURL, clientSecret }: ProviderConfig
  ) {
    const client = this.getAuthorizationCodeHandler({ clientID, clientSecret })

    const tokenParams = {
      code,
      redirect_uri: callbackURL,
    }

    try {
      const accessToken = await client.getToken(tokenParams)

      return await this.verify_(accessToken.token.id_token, scope)
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  private getConfigFromScope(
    config: AuthProviderScope & Partial<ProviderConfig>
  ): ProviderConfig {
    const providerConfig: Partial<ProviderConfig> = { ...config }

    if (!providerConfig.clientID) {
      throw new Error("Google clientID is required")
    }

    if (!providerConfig.clientSecret) {
      throw new Error("Google clientSecret is required")
    }

    if (!providerConfig.callbackURL) {
      throw new Error("Google callbackUrl is required")
    }

    return providerConfig as ProviderConfig
  }

  private originalURL(req: AuthenticationInput) {
    const host = req.headers.host
    const protocol = req.protocol
    const path = req.url || ""

    return protocol + "://" + host + path
  }

  private async getProviderConfig(
    req: AuthenticationInput
  ): Promise<ProviderConfig> {
    await this.authProviderService_.retrieve(GoogleProvider.PROVIDER)

    const scopeConfig = this.scopes_[req.authScope]

    const config = this.getConfigFromScope(scopeConfig)

    const { callbackURL } = config

    const parsedCallbackUrl = !url.parse(callbackURL).protocol
      ? url.resolve(this.originalURL(req), callbackURL)
      : callbackURL

    return { ...config, callbackURL: parsedCallbackUrl }
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
