import crypto from "crypto"
import {
  AuthenticationInput,
  AuthenticationResponse,
  AuthIdentityProviderService,
  KeycloakAuthProviderOptions,
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

interface LocalServiceConfig extends KeycloakAuthProviderOptions {}

export class KeycloakAuthService extends AbstractAuthModuleProvider {
  static identifier = "keycloak"
  static DISPLAY_NAME = "Keycloak Authentication"

  protected config_: LocalServiceConfig
  protected logger_: Logger
  protected jwks_: JwksClient

  static validateOptions(options: KeycloakAuthProviderOptions) {
    if (!options.clientId) {
      throw new Error("Keycloak clientId is required")
    }

    if (!options.clientSecret) {
      throw new Error("Keycloak clientSecret is required")
    }

    if (!options.callbackUrl) {
      throw new Error("Keycloak callbackUrl is required")
    }

    if (!options.issuer) {
      throw new Error("Keycloak issuer is required")
    }
  }

  constructor(
    { logger }: InjectedDependencies,
    options: KeycloakAuthProviderOptions
  ) {
    // @ts-ignore
    super(...arguments)
    this.config_ = { ...options, issuer: options.issuer.replace(/\/$/, "") }
    this.logger_ = logger
    this.jwks_ = jwksClient({
      jwksUri: `${this.config_.issuer}/protocol/openid-connect/certs`,
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
      "Keycloak does not support registration. Use method `authenticate` instead."
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
        error: `${query.error_description ?? query.error}`,
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
        error: `${query.error_description ?? query.error}`,
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

    try {
      // Unlike some providers, Keycloak only accepts the token exchange
      // parameters as a form-encoded body, not as query parameters.
      const response = await fetch(
        `${this.config_.issuer}/protocol/openid-connect/token`,
        {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: this.config_.clientId,
            client_secret: this.config_.clientSecret,
            code,
            redirect_uri: state.callback_url as string,
          }).toString(),
        }
      ).then((r) => {
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
        issuer: this.config_.issuer,
      })
      if (!decoded || typeof decoded === "string") {
        throw new Error("Invalid id_token")
      }
      payload = decoded
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        `Could not verify Keycloak id_token: ${err.message}`
      )
    }

    if (!payload.sub) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "id_token is missing 'sub' claim"
      )
    }

    // Note: email_verified is deliberately not enforced. Identities are
    // keyed on the immutable `sub` claim, and self-hosted realms commonly
    // run without email verification. The claim is passed through in
    // user_metadata so applications can enforce their own policy.
    const entity_id = payload.sub
    const userMetadata = {
      name: payload.name,
      email: payload.email,
      email_verified: payload.email_verified,
      given_name: payload.given_name,
      family_name: payload.family_name,
      preferred_username: payload.preferred_username,
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
    const authUrl = new URL(
      `${this.config_.issuer}/protocol/openid-connect/auth`
    )
    authUrl.searchParams.set("redirect_uri", callbackUrl)
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("scope", "openid email profile")
    authUrl.searchParams.set("state", stateKey)

    return { success: true, location: authUrl.toString() }
  }
}
