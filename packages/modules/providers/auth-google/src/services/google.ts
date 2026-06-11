import crypto from "crypto"
import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  GoogleAuthProviderOptions,
  Logger,
} from "@medusajs/framework/types"
import {
  AbstractAuthModuleProvider,
  MedusaError,
} from "@medusajs/framework/utils"
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

const GOOGLE_JWKS_URI = "https://www.googleapis.com/oauth2/v3/certs"
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"]

interface LocalServiceConfig extends GoogleAuthProviderOptions {}
export class GoogleAuthService extends AbstractAuthModuleProvider {
  static identifier = "google"
  static DISPLAY_NAME = "Google Authentication"

  protected config_: LocalServiceConfig
  protected logger_: Logger
  protected jwks_: JwksClient

  static validateOptions(options: GoogleAuthProviderOptions) {
    if (!options.clientId) {
      throw new Error("Google clientId is required")
    }

    if (!options.clientSecret) {
      throw new Error("Google clientSecret is required")
    }

    if (!options.callbackUrl) {
      throw new Error("Google callbackUrl is required")
    }
  }

  constructor(
    { logger }: InjectedDependencies,
    options: GoogleAuthProviderOptions
  ) {
    // @ts-ignore
    super(...arguments)
    this.config_ = options
    this.logger_ = logger
    this.jwks_ = jwksClient({
      jwksUri: GOOGLE_JWKS_URI,
      cache: true,
      rateLimit: true,
    })
  }

  protected getSigningKey_ = (
    header: JwtHeader,
    callback: (err: Error | null, key?: string) => void
  ) => {
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
      "Google does not support registration. Use method `authenticate` instead."
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
        error: `${query.error_description}, read more at: ${query.error_uri}`,
      }
    }

    const stateKey = crypto.randomBytes(32).toString("hex")
    const state = {
      callback_url: body?.callback_url ?? this.config_.callbackUrl,
    }

    await authIdentityService.setState(stateKey, state)
    return this.getRedirect(this.config_.clientId, state.callback_url, stateKey)
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
        error: `${query.error_description}, read more at: ${query.error_uri}`,
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

    const params = `client_id=${this.config_.clientId}&client_secret=${this.config_.clientSecret}&code=${code}&redirect_uri=${state.callback_url}&grant_type=authorization_code`
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

    let payload: JwtPayload
    try {
      const decoded = await verifyJwt(idToken, this.getSigningKey_, {
        algorithms: ["RS256"],
        audience: this.config_.clientId,
        issuer: GOOGLE_ISSUERS,
      })
      if (!decoded || typeof decoded === "string") {
        throw new Error("Invalid id_token")
      }
      payload = decoded
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        `Could not verify Google id_token: ${err.message}`
      )
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
    const authUrl = new URL(`https://accounts.google.com/o/oauth2/v2/auth`)
    authUrl.searchParams.set("redirect_uri", callbackUrl)
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", "email profile openid")
    authUrl.searchParams.set("state", stateKey)

    return { success: true, location: authUrl.toString() }
  }
}
