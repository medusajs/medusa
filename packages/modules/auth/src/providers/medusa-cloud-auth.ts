import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  Logger,
} from "@medusajs/framework/types"
import {
  AbstractAuthModuleProvider,
  MedusaError,
} from "@medusajs/framework/utils"
import { MedusaCloudAuthProviderOptions } from "@types"
import crypto from "crypto"
import jwt, { type JwtHeader, type JwtPayload } from "jsonwebtoken"
import jwksClient, { JwksClient } from "jwks-rsa"
import { promisify } from "util"

const verifyJwt = promisify<
  string,
  jwt.Secret | jwt.GetPublicKeyOrSecret,
  jwt.VerifyOptions,
  JwtPayload | string | undefined
>(jwt.verify)

type InjectedDependencies = {
  logger: Logger
}

export class MedusaCloudAuthService extends AbstractAuthModuleProvider {
  static identifier = "cloud"
  static DISPLAY_NAME = "Medusa Cloud Authentication"

  protected config_: MedusaCloudAuthProviderOptions
  protected logger_: Logger
  protected jwks_?: JwksClient

  constructor(
    { logger }: InjectedDependencies,
    options: MedusaCloudAuthProviderOptions
  ) {
    // @ts-ignore
    super(...arguments)
    this.config_ = options
    this.logger_ = logger

    if (!options.oauth_jwks_uri) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Medusa Cloud auth provider requires 'oauth_jwks_uri' option to be set"
      )
    }

    if (!options.oauth_audience) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Medusa Cloud auth provider requires 'oauth_audience' option to be set"
      )
    }

    this.jwks_ = jwksClient({
      jwksUri: options.oauth_jwks_uri,
      cache: true,
      rateLimit: true,
    })
  }

  protected getSigningKey_ = (
    header: JwtHeader,
    callback: (err: Error | null, key?: string) => void
  ) => {
    if (!this.jwks_) {
      callback(
        new Error(
          "Medusa Cloud auth provider is missing required 'oauth_jwks_uri' option; cannot verify id_token signature"
        )
      )
      return
    }
    if (!header.kid) {
      callback(new Error("ID token is missing 'kid' header"))
      return
    }
    this.jwks_.getSigningKey(header.kid, (err, key) => {
      if (err || !key) {
        callback(err ?? new Error("Unable to resolve signing key"))
        return
      }
      callback(null, key.getPublicKey())
    })
  }

  async register(_): Promise<AuthenticationResponse> {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Medusa Cloud does not support registration. Use method `authenticate` instead."
    )
  }

  async authenticate(
    req: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const query: Record<string, string> = req.query ?? {}
    const body: Record<string, string> = req.body ?? {}

    if (query.error) {
      return {
        success: false,
        error: `${query.error}`,
      }
    }

    const stateKey = crypto.randomBytes(32).toString("hex")
    const state = {
      callback_url: body?.callback_url ?? this.config_.callback_url,
    }

    await authIdentityService.setState(stateKey, state)
    return this.getRedirect(this.getClientId(), state.callback_url, stateKey)
  }

  async validateCallback(
    req: AuthenticationInput,
    authIdentityService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const query: Record<string, string> = req.query ?? {}
    const body: Record<string, string> = req.body ?? {}

    if (query.error) {
      return {
        success: false,
        error: `${query.error}`,
      }
    }

    const code = query?.code ?? body?.code
    if (!code) {
      return { success: false, error: "No code provided" }
    }

    const state = await authIdentityService.getState(query?.state as string)
    if (!state) {
      return { success: false, error: "No state provided, or session expired" }
    }

    const clientId = this.getClientId()

    try {
      const response = await fetch(this.config_.oauth_token_endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: this.config_.api_key,
          code,
          redirect_uri: state.callback_url as string,
          grant_type: "authorization_code",
        }),
      }).then((r) => {
        if (!r.ok) {
          this.logger_.warn(
            `Could not exchange token, ${r.status}, ${
              r.statusText
            }: response: ${JSON.stringify(r)}`
          )
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Could not exchange token, ${r.status}, ${r.statusText}`
          )
        }

        return r.json()
      })

      const { authIdentity, success, error } = await this.verify_(
        response.id_token as string,
        authIdentityService
      )

      return {
        success,
        authIdentity,
        error,
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
      return { success: false, error: "No id_token" }
    }

    let payload: JwtPayload
    try {
      const decoded = await verifyJwt(idToken, this.getSigningKey_, {
        algorithms: ["RS256"],
        audience: this.config_.oauth_audience,
      })
      if (!decoded || typeof decoded === "string") {
        throw new Error("Invalid id_token")
      }
      payload = decoded
    } catch (err) {
      return {
        success: false,
        error: `Could not verify id_token: ${err.message}`,
      }
    }

    if (!payload.email_verified) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Email not verified, cannot proceed with authentication"
      )
    }

    if (!payload.sub) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "id_token is missing 'sub' claim"
      )
    }

    const entity_id = payload.sub
    const userMetadata = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      given_name: payload.given_name,
      family_name: payload.family_name,
    }

    let authIdentity

    try {
      authIdentity = await authIdentityService.retrieve({
        entity_id,
      })
    } catch (error) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        const createdAuthIdentity = await authIdentityService.create({
          entity_id,
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

  private getRedirect(clientId: string, callbackUrl: string, stateKey: string) {
    const authUrl = new URL(this.config_.oauth_authorize_endpoint)
    authUrl.searchParams.set("redirect_uri", callbackUrl)
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", "email profile openid")
    authUrl.searchParams.set("state", stateKey)

    return { success: true, location: authUrl.toString() }
  }

  private getClientId() {
    return this.config_.environment_handle || this.config_.sandbox_handle
  }
}
