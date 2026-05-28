import { AuthTypes, HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders, Config } from "../types.js"

/**
 * Redirect response returned when an authentication provider requires the user
 * to continue authentication on another page.
 */
export type AuthRedirectResponse = {
  /**
   * The URL to redirect the user to.
   */
  location: string
}

/**
 * Response returned when authentication succeeds but must be completed with
 * a multi-factor authentication (MFA) challenge before issuing a token.
 */
export type AuthMfaRequiredResponse = {
  /**
   * Indicates that the client must complete the returned MFA challenge.
   */
  mfa_required: true
  /**
   * The MFA challenge to complete.
   */
  mfa_challenge: AuthTypes.AuthMfaChallengeDTO
}

/**
 * Response returned when authentication succeeds but must be completed with
 * verification before issuing a token.
 */
export type AuthVerificationRequiredResponse = {
  /**
   * Indicates that the client must complete verification.
   */
  verification_required: true
  /**
   * The verification state to show to the caller.
   */
  verification: AuthTypes.AuthVerification
}

/**
 * Response returned from a registration attempt.
 */
export type AuthRegisterResponse = string | AuthVerificationRequiredResponse

/**
 * Options used when registering with an auth provider.
 */
export type AuthRegisterOptions = {
  /**
   * Return verification state instead of throwing when registration
   * requires verification before a token can be issued.
   */
  returnVerification?: boolean
}

/**
 * Response returned from an authentication attempt.
 */
export type AuthLoginResponse =
  | string
  | AuthRedirectResponse
  | AuthMfaRequiredResponse
  | AuthVerificationRequiredResponse

/**
 * Response returned from an authentication callback.
 */
export type AuthCallbackResponse = string | AuthMfaRequiredResponse

/**
 * Response containing the authenticated identity's MFA factors.
 */
export type AuthMfaListResponse = {
  /**
   * The MFA factors configured for the authenticated identity.
   */
  mfa_factors: AuthTypes.AuthMfaDTO[]
}

/**
 * Response returned when starting MFA setup.
 */
export type AuthMfaSetupResponse = {
  /**
   * The pending MFA factor.
   */
  mfa_factor: AuthTypes.AuthMfaDTO
  /**
   * The setup secret. For TOTP, this can be entered manually in an
   * authenticator app.
   */
  secret?: string
  /**
   * The setup URI. For TOTP, this can be rendered as a QR code.
   */
  otpauth_url?: string
}

/**
 * Response containing a single MFA factor.
 */
export type AuthMfaFactorResponse = {
  /**
   * The MFA factor.
   */
  mfa_factor: AuthTypes.AuthMfaDTO
}

/**
 * Response containing newly generated MFA recovery codes.
 */
export type AuthMfaRecoveryCodesResponse = {
  /**
   * The recovery codes. These are only returned once and should be stored by
   * the user.
   */
  recovery_codes: string[]
}

/**
 * Payload used to start MFA setup.
 */
export type AuthMfaStartPayload = {
  /**
   * The MFA provider to set up.
   */
  provider: AuthTypes.AuthMfaProvider
  /**
   * Optional label for the MFA factor.
   */
  label?: string | null
  /**
   * Optional issuer name. For TOTP, authenticator apps show this as the
   * service name.
   */
  issuer?: string
  /**
   * Optional metadata to store with the MFA factor.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * Payload used to verify a pending MFA setup.
 */
export type AuthMfaVerifyPayload = {
  /**
   * The verification code from the MFA provider.
   */
  code: string
}

/**
 * Payload used to disable an MFA factor.
 */
export type AuthMfaDisablePayload = {
  /**
   * Optional challenge method used to authorize disabling MFA when configured.
   */
  method?: AuthTypes.AuthMfaChallengeMethod
  /**
   * Optional verification code for the selected challenge method.
   */
  code?: string
}

/**
 * Payload used to generate recovery codes.
 */
export type AuthMfaGenerateRecoveryCodesPayload = {
  /**
   * Number of recovery codes to generate.
   */
  count?: number
}

/**
 * Payload used to verify an MFA challenge.
 */
export type AuthMfaVerifyChallengePayload = {
  /**
   * The MFA challenge method used for verification.
   */
  method: AuthTypes.AuthMfaChallengeMethod
  /**
   * The verification code for the selected challenge method.
   */
  code: string
}

/**
 * Payload used to request a verification token.
 */
export type AuthVerificationRequestPayload = {
  /**
   * The provider identity to verify.
   */
  entity_id: string
  /**
   * Optional metadata to include in the verification request event.
   */
  metadata?: Record<string, unknown>
}

/**
 * Payload used to confirm a verification token.
 */
export type AuthVerificationConfirmPayload = {
  /**
   * The verification token delivered to the user.
   */
  token: string
}

/**
 * Response returned after requesting a verification token.
 */
export type AuthVerificationRequestResponse = {
  /**
   * The verification state.
   */
  verification: AuthTypes.AuthVerification
}

/**
 * Response returned after confirming verification.
 */
export type AuthVerificationConfirmResponse = {
  /**
   * The verified provider identity.
   */
  entity_id: string
  /**
   * Indicates the identity was verified.
   */
  verified: true
}

type AuthProviderResponse = {
  token?: string
  location?: string
  mfa_required?: true
  mfa_challenge?: AuthTypes.AuthMfaChallengeDTO
  verification_required?: true
  verification?: AuthTypes.AuthVerification
}

export class Auth {
  private client: Client
  private config: Config

  constructor(client: Client, config: Config) {
    this.client = client
    this.config = config
  }

  /**
   * Methods for managing and completing multi-factor authentication (MFA).
   */
  mfa = {
    /**
     * This method retrieves the MFA factors configured for the authenticated
     * identity. It sends a request to the
     * [List MFA Factors](https://docs.medusajs.com/api/admin#auth_getmfa_factors)
     * API route.
     *
     * @param headers - Headers to pass in the request.
     * @returns The configured MFA factors.
     *
     * @tags auth
     *
     * @example
     * const { mfa_factors } = await sdk.auth.mfa.list()
     */
    list: async (headers?: ClientHeaders) => {
      return await this.client.fetch<AuthMfaListResponse>("/auth/mfa/factors", {
        headers,
      })
    },

    /**
     * This method starts MFA setup for the authenticated identity. It sends a
     * request to the
     * [Create MFA Factor](https://docs.medusajs.com/api/admin#auth_postmfa_factors)
     * API route.
     *
     * @param body - The MFA setup details.
     * @param headers - Headers to pass in the request.
     * @returns The pending MFA factor and any setup details returned by the provider.
     *
     * @tags auth
     *
     * @example
     * const setup = await sdk.auth.mfa.start({
     *   provider: "totp",
     *   label: "Authenticator app"
     * })
     *
     * // Render setup.otpauth_url as a QR code or show setup.secret manually.
     */
    start: async (body: AuthMfaStartPayload, headers?: ClientHeaders) => {
      return await this.client.fetch<AuthMfaSetupResponse>(
        "/auth/mfa/factors",
        {
          method: "POST",
          body,
          headers,
        }
      )
    },

    /**
     * This method verifies a pending MFA factor setup. It sends a request to the
     * [Verify MFA Factor](https://docs.medusajs.com/api/admin#auth_postmfa_factorsidverify)
     * API route.
     *
     * @param id - The ID of the MFA factor to verify.
     * @param body - The verification details.
     * @param headers - Headers to pass in the request.
     * @returns The verified MFA factor.
     *
     * @tags auth
     *
     * @example
     * const { mfa_factor } = await sdk.auth.mfa.verify("authmfa_123", {
     *   code: "123456"
     * })
     */
    verify: async (
      id: string,
      body: AuthMfaVerifyPayload,
      headers?: ClientHeaders
    ) => {
      return await this.client.fetch<AuthMfaFactorResponse>(
        `/auth/mfa/factors/${id}/verify`,
        {
          method: "POST",
          body,
          headers,
        }
      )
    },

    /**
     * This method disables an MFA factor for the authenticated identity. It
     * sends a request to the
     * [Delete MFA Factor](https://docs.medusajs.com/api/admin#auth_deletemfa_factorsid)
     * API route.
     *
     * @param id - The ID of the MFA factor to disable.
     * @param body - Optional verification details required by the server configuration.
     * @param headers - Headers to pass in the request.
     * @returns The disabled MFA factor.
     *
     * @tags auth
     *
     * @example
     * const { mfa_factor } = await sdk.auth.mfa.disable("authmfa_123")
     */
    disable: async (
      id: string,
      body?: AuthMfaDisablePayload,
      headers?: ClientHeaders
    ) => {
      return await this.client.fetch<AuthMfaFactorResponse>(
        `/auth/mfa/factors/${id}`,
        {
          method: "DELETE",
          body: body ?? {},
          headers,
        }
      )
    },

    /**
     * This method generates new recovery codes for the authenticated identity.
     * It sends a request to the
     * [Generate MFA Recovery Codes](https://docs.medusajs.com/api/admin#auth_postmfa_recovery-codes)
     * API route.
     *
     * @param body - Optional recovery code generation details.
     * @param headers - Headers to pass in the request.
     * @returns The generated recovery codes.
     *
     * @tags auth
     *
     * @example
     * const { recovery_codes } = await sdk.auth.mfa.generateRecoveryCodes()
     */
    generateRecoveryCodes: async (
      body?: AuthMfaGenerateRecoveryCodesPayload,
      headers?: ClientHeaders
    ) => {
      return await this.client.fetch<AuthMfaRecoveryCodesResponse>(
        "/auth/mfa/recovery-codes",
        {
          method: "POST",
          body: body ?? {},
          headers,
        }
      )
    },

    /**
     * This method verifies an MFA challenge returned from `sdk.auth.login` or
     * `sdk.auth.callback`. It sends a request to the
     * [Verify MFA Challenge](https://docs.medusajs.com/api/admin#auth_postmfa_challengesidverify)
     * API route.
     *
     * If verification succeeds, the returned token is stored based on the SDK's
     * auth configuration, matching `sdk.auth.login`.
     *
     * @param id - The ID of the MFA challenge to verify.
     * @param body - The challenge verification details.
     * @param headers - Headers to pass in the request.
     * @returns The authentication JWT token.
     *
     * @tags auth
     *
     * @example
     * const result = await sdk.auth.login("user", "emailpass", {
     *   email: "user@example.com",
     *   password: "secret"
     * })
     *
     * if (typeof result === "object" && "mfa_challenge" in result) {
     *   await sdk.auth.mfa.verifyChallenge(result.mfa_challenge.id, {
     *     method: "totp",
     *     code: "123456"
     *   })
     * }
     */
    verifyChallenge: async (
      id: string,
      body: AuthMfaVerifyChallengePayload,
      headers?: ClientHeaders
    ) => {
      const { token } = await this.client.fetch<{ token: string }>(
        `/auth/mfa/challenges/${id}/verify`,
        {
          method: "POST",
          body,
          headers,
        }
      )

      await this.setToken_(token)
      return token
    },
  }

  /**
   * Methods for requesting and confirming verification.
   */
  verification = {
    /**
     * This method requests a verification token for an auth identity.
     *
     * @param actor - The actor type. For example, `user` for admin user, or `customer` for customer.
     * @param provider - The authentication provider to use. For example, `emailpass`.
     * @param body - The verification request details.
     * @param headers - Headers to pass in the request.
     *
     * @tags auth
     */
    request: async (
      actor: string,
      provider: string,
      body: AuthVerificationRequestPayload,
      headers?: ClientHeaders
    ) => {
      return await this.client.fetch<AuthVerificationRequestResponse>(
        `/auth/${actor}/${provider}/verification/request`,
        {
          method: "POST",
          body,
          headers,
        }
      )
    },

    /**
     * This method confirms a verification token.
     *
     * @param actor - The actor type. For example, `user` for admin user, or `customer` for customer.
     * @param provider - The authentication provider to use. For example, `emailpass`.
     * @param body - The verification token details.
     * @param headers - Headers to pass in the request.
     *
     * @tags auth
     */
    confirm: async (
      actor: string,
      provider: string,
      body: AuthVerificationConfirmPayload,
      headers?: ClientHeaders
    ) => {
      return await this.client.fetch<AuthVerificationConfirmResponse>(
        `/auth/${actor}/${provider}/verification/confirm`,
        {
          method: "POST",
          body,
          headers,
        }
      )
    },
  }

  /**
   * This method is used to retrieve a registration JWT token for a user, customer, or custom actor type. It sends a request to the
   * [Retrieve Registration Token API route](https://docs.medusajs.com/api/store#auth_postactor_typeauth_provider_register).
   *
   * Then, it stores the returned token and passes it in the header of subsequent requests. So, you can call the
   * [store.customer.create](https://docs.medusajs.com/resources/references/js-sdk/store/customer#create) method,
   * for example, after calling this method.
   *
   * Learn more in the [JS SDK Authentication](https://docs.medusajs.com/resources/js-sdk/auth/overview) guide.
   *
   * @param actor - The actor type. For example, `user` for admin user, or `customer` for customer.
   * @param method - The authentication provider to use. For example, `emailpass` or `google`.
   * @param payload - The data to pass in the request's body for authentication. When using the `emailpass` provider,
   * you pass the email and password.
   * @param options - Optional behavior for multi-step registration responses.
   * @returns The JWT token used for registration later.
   *
   * @tags auth
   *
   * @example
   * await sdk.auth.register(
   *   "customer",
   *   "emailpass",
   *   {
   *     email: "customer@gmail.com",
   *     password: "supersecret"
   *   }
   * )
   *
   * // all subsequent requests will use the token in the header
   * const { customer } = await sdk.store.customer.create({
   *   email: "customer@gmail.com",
   *   password: "supersecret"
   * })
   */
  register = (async (
    actor: string,
    method: string,
    payload: HttpTypes.AdminSignUpWithEmailPassword | Record<string, unknown>,
    options?: AuthRegisterOptions
  ): Promise<AuthRegisterResponse> => {
    const { token, verification_required, verification } =
      await this.client.fetch<AuthProviderResponse>(
        `/auth/${actor}/${method}/register`,
        {
          method: "POST",
          body: payload,
        }
      )

    if (verification_required && verification) {
      if (options?.returnVerification) {
        return {
          verification_required: true,
          verification,
        }
      }

      throw new Error("Unexpected registration response")
    }

    if (!token) {
      throw new Error("Unexpected registration response")
    }

    this.client.setToken(token)

    return token
  }) as {
    (
      actor: string,
      method: string,
      payload: HttpTypes.AdminSignUpWithEmailPassword | Record<string, unknown>,
      options: AuthRegisterOptions & { returnVerification: true }
    ): Promise<AuthRegisterResponse>
    (
      actor: string,
      method: string,
      payload: HttpTypes.AdminSignUpWithEmailPassword | Record<string, unknown>,
      options?: AuthRegisterOptions
    ): Promise<string>
  }

  /**
   * This method retrieves the JWT authenticated token for an admin user, customer, or custom
   * actor type. It sends a request to the [Authenticate API Route](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_provider).
   *
   * ### Third-Party Authentication
   *
   * If the API route returns a `location` property, it means that the authentication requires additional steps,
   * typically in a third-party service. The `location` property is returned so that you
   * can redirect the user to the appropriate page.
   *
   * :::note
   *
   * For an example of implementing third-party authentication, refer to the
   * [Third-Party Login in Storefront](https://docs.medusajs.com/resources/storefront-development/customers/third-party-login) guide.
   *
   * :::
   *
   * ### Session Authentication
   *
   * If the `auth.type` of the SDK is set to `session`, this method will also send a request to the
   * [Set Authentication Session API route](https://docs.medusajs.com/api/admin#auth_postsession).
   *
   * Learn more in the [JS SDK Authentication](https://docs.medusajs.com/resources/js-sdk/auth/overview) guide.
   *
   * ### Automatic Authentication
   *
   * If the authentication was successful, subsequent requests using the SDK will automatically have the necessary authentication headers / session
   * set, based on your JS SDK authentication configurations.
   *
   * Learn more in the [JS SDK Authentication](https://docs.medusajs.com/resources/js-sdk/auth/overview) guide.
   *
   * @param actor - The actor type. For example, `user` for admin user, or `customer` for customer.
   * @param method - The authentication provider to use. For example, `emailpass` or `google`.
   * @param payload - The data to pass in the request's body for authentication. When using the `emailpass` provider,
   * you pass the email and password.
   * @returns The authentication JWT token
   *
   * @tags auth
   *
   * @example
   * const result = await sdk.auth.login(
   *   "customer",
   *   "emailpass",
   *   {
   *     email: "customer@gmail.com",
   *     password: "supersecret"
   *   }
   * )
   *
   * if (typeof result !== "string") {
   *   alert("Authentication requires additional steps")
   *   // replace with the redirect logic of your application
   *   window.location.href = result.location
   *   return
   * }
   *
   * // customer is now authenticated
   * // all subsequent requests will use the token in the header
   * const { customer } = await sdk.store.customer.retrieve()
   */
  login = async (
    actor: string,
    method: string,
    payload: HttpTypes.AdminSignInWithEmailPassword | Record<string, unknown>
  ): Promise<AuthLoginResponse> => {
    // There will either be token, location, MFA challenge, or verification returned from the backend.
    const {
      token,
      location,
      mfa_challenge,
      verification_required,
      verification,
    } = await this.client.fetch<AuthProviderResponse>(
      `/auth/${actor}/${method}`,
      {
        method: "POST",
        body: payload,
      }
    )

    if (verification_required && verification) {
      return {
        verification_required: true,
        verification,
      }
    }

    if (mfa_challenge) {
      return {
        mfa_required: true,
        mfa_challenge,
      }
    }

    // In the case of an oauth login, we return the redirect location to the caller.
    // They can decide if they do an immediate redirect or put it in an <a> tag.
    if (location) {
      return { location }
    }

    if (!token) {
      throw new Error("Unexpected authentication response")
    }

    await this.setToken_(token)
    return token
  }

  /**
   * This method is used to validate an Oauth callback from a third-party service, such as Google, for an admin user, customer, or custom actor types.
   * It sends a request to the [Validate Authentication Callback](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_providercallback).
   *
   * The method stores the returned token and passes it in the header of subsequent requests. So, you can call the
   * [store.customer.create](https://docs.medusajs.com/resources/references/js-sdk/store/customer#create) or {@link refresh} methods,
   * for example, after calling this method.
   *
   * Learn more in the [JS SDK Authentication](https://docs.medusajs.com/resources/js-sdk/auth/overview) guide.
   *
   * @param actor - The actor type. For example, `user` for admin user, or `customer`.
   * @param method - The authentication provider to use. For example, `google`.
   * @param query - The query parameters from the Oauth callback, which should be passed to the API route. This includes query parameters like
   * `code` and `state`.
   * @returns The authentication JWT token
   *
   * @tags auth
   *
   * @example
   * await sdk.auth.callback(
   *   "customer",
   *   "google",
   *   {
   *     code: "123",
   *     state: "456"
   *   }
   * )
   *
   * // all subsequent requests will use the token in the header
   * const { customer } = await sdk.store.customer.create({
   *   email: "customer@gmail.com",
   *   password: "supersecret"
   * })
   *
   * @privateRemarks
   * The callback expects all query parameters from the Oauth callback to be passed to
   * the backend, and the provider is in charge of parsing and validating them
   */
  callback = async (
    actor: string,
    method: string,
    query?: Record<string, unknown>
  ): Promise<AuthCallbackResponse> => {
    const { token, mfa_challenge } =
      await this.client.fetch<AuthProviderResponse>(
        `/auth/${actor}/${method}/callback`,
        {
          method: "GET",
          query,
        }
      )

    if (mfa_challenge) {
      return {
        mfa_required: true,
        mfa_challenge,
      }
    }

    if (!token) {
      throw new Error("Unexpected authentication callback response")
    }

    await this.setToken_(token)
    return token
  }

  /**
   * This method refreshes a JWT authentication token, which is useful after validating the Oauth callback
   * with {@link callback}. It sends a request to the [Refresh Authentication Token API route](https://docs.medusajs.com/api/admin#auth_postadminauthtokenrefresh).
   *
   * The method stores the returned token and passes it in the header of subsequent requests. So, you can call other
   * methods that require authentication after calling this method.
   *
   * Learn more in the [JS SDK Authentication](https://docs.medusajs.com/resources/js-sdk/auth/overview) guide.
   *
   * For an example of implementing third-party authentication, refer to the
   * [Third-Party Login in Storefront](https://docs.medusajs.com/resources/storefront-development/customers/third-party-login) guide.
   *
   * @param headers - Headers to pass in the request
   *
   * @returns The refreshed JWT authentication token.
   *
   * @tags auth
   *
   * @example
   * const token = await sdk.auth.refresh()
   *
   * // all subsequent requests will use the token in the header
   * const { customer } = await sdk.store.customer.retrieve()
   */
  refresh = async (headers?: ClientHeaders) => {
    const { token } = await this.client.fetch<{ token: string }>(
      "/auth/token/refresh",
      {
        method: "POST",
        headers,
      }
    )

    // Putting the token in session after refreshing is only useful when the new token has updated info (eg. actor_id).
    // Ideally we don't use the full JWT in session as key, but just store a pseudorandom key that keeps the rest of the auth context as value.
    await this.setToken_(token)
    return token
  }

  /**
   * This method logs out the currently authenticated user based on your JS SDK authentication configurations.
   *
   * If the `auth.type` of the SDK is set to `session`, this method will also send a request to the
   * [Delete Authentication Session API route](https://docs.medusajs.com/api/admin#auth_deletesession).
   *
   * The method also clears any stored tokens or sessions, based on your JS SDK authentication configurations.
   *
   * Learn more in the [JS SDK Authentication](https://docs.medusajs.com/resources/js-sdk/auth/overview) guide.
   *
   * @tags auth
   *
   * @example
   * await sdk.auth.logout()
   *
   * // user is now logged out
   * // you can't send any requests that require authentication
   */
  logout = async () => {
    if (this.config?.auth?.type === "session") {
      await this.client.fetch("/auth/session", {
        method: "DELETE",
      })
    }

    this.client.clearToken()
  }

  /**
   * This method requests a reset password token for an admin user, customer, or custom actor type.
   * It sends a request to the [Generate Reset Password Token API route](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_providerresetpassword).
   *
   * To reset the password later using the token delivered to the user, use the {@link updateProvider} method.
   *
   * Related guide: [How to allow customers to reset their passwords in a storefront](https://docs.medusajs.com/resources/storefront-development/customers/reset-password).
   *
   * @param actor - The actor type. For example, `user` for admin user, or `customer` for customer.
   * @param provider - The authentication provider to use. For example, `emailpass`.
   * @param body - The data required to identify the user.
   *
   * @tags auth
   *
   * @example
   * sdk.auth.resetPassword(
   *   "customer",
   *   "emailpass",
   *   {
   *     identifier: "customer@gmail.com"
   *   }
   * )
   * .then(() => {
   *   // user receives token
   * })
   */
  resetPassword = async (
    actor: string,
    provider: string,
    body: {
      /**
       * The user's identifier. For example, when using the `emailpass` provider,
       * this would be the user's email.
       */
      identifier: string
      /**
       * Optional metadata to include in the reset password request.
       *
       * @since 2.12.4
       */
      metadata?: Record<string, unknown>
    }
  ) => {
    await this.client.fetch(`/auth/${actor}/${provider}/reset-password`, {
      method: "POST",
      body,
      headers: { accept: "text/plain" }, // 201 Created response
    })
  }

  /**
   * This method is used to update user-related data authentication data.
   *
   * More specifically, use this method when updating the password of an admin user, customer, or
   * custom actor type after requesting to reset their password with {@link resetPassword}.
   *
   * This method sends a request to [this API route](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_providerupdate).
   *
   * Related guide: [How to allow customers to reset their passwords in a storefront](https://docs.medusajs.com/resources/storefront-development/customers/reset-password).
   *
   * @param actor - The actor type. For example, `user` for admin user, or `customer` for customer.
   * @param provider - The authentication provider to use. For example, `emailpass`.
   * @param body - The data necessary to update the user's authentication data. When resetting the user's password,
   * send the `password` property.
   *
   * @tags auth
   *
   * @example
   * sdk.auth.updateProvider(
   *   "customer",
   *   "emailpass",
   *   {
   *     password: "supersecret"
   *   },
   *   token
   * )
   * .then(() => {
   *   // password updated
   * })
   */
  updateProvider = async (
    actor: string,
    provider: string,
    body: HttpTypes.AdminUpdateProvider,
    token: string
  ) => {
    await this.client.fetch(`/auth/${actor}/${provider}/update`, {
      method: "POST",
      body,
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  /**
   * @ignore
   */
  private setToken_ = async (token: string) => {
    // By default we just set the token in the configured storage, if configured to use sessions we convert it into session storage instead.
    if (this.config?.auth?.type === "session") {
      await this.client.fetch("/auth/session", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    } else {
      this.client.setToken(token)
    }
  }
}
