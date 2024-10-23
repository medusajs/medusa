import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { Config } from "../types"

export class Auth {
  private client: Client
  private config: Config

  constructor(client: Client, config: Config) {
    this.client = client
    this.config = config
  }

  /**
   * This method is used to retrieve a registration JWT token for a user, customer, or custom actor type. It sends a request to the
   * [Retrieve Registration Token API route](https://docs.medusajs.com/api/store#auth_postactor_typeauth_provider_register).
   * 
   * @param actor - The actor type. For example, `user` for admin user, or `customer` for customer.
   * @param method - The authentication provider to use. For example, `emailpass` or `google`.
   * @param payload - The data to pass in the request's body for authentication. When using the `emailpass` provider,
   * you pass the email and password.
   * @returns The JWT token used for registration later.
   * 
   * @example
   * sdk.auth.register(
   *   "customer",
   *   "emailpass",
   *   {
   *     email: "customer@gmail.com",
   *     password: "supersecret"
   *   }
   * ).then((token) => {
   *   console.log(token)
   * })
   */
  register = async (
    actor: string,
    method: string,
    payload: HttpTypes.AdminSignUpWithEmailPassword
  ) => {
    const { token } = await this.client.fetch<{ token: string }>(
      `/auth/${actor}/${method}/register`,
      {
        method: "POST",
        body: payload,
      }
    )

    this.client.setToken(token)

    return token
  }

  /**
   * This method retrieves the JWT authenticated token for an admin user, customer, or custom
   * actor type. It sends a request to the [Authenticate API Route](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_provider).
   * 
   * If the `auth.type` of the SDK is set to `session`, this method will also send a request to the
   * [Set Authentication Session API route](https://docs.medusajs.com/api/admin#auth_postsession).
   * 
   * Subsequent requests using the SDK will automatically have the necessary authentication headers / session
   * set.
   * 
   * @param actor - The actor type. For example, `user` for admin user, or `customer` for customer.
   * @param method - The authentication provider to use. For example, `emailpass` or `google`.
   * @param payload - The data to pass in the request's body for authentication. When using the `emailpass` provider,
   * you pass the email and password.
   * @returns The authentication JWT token
   * 
   * @example
   * sdk.auth.login(
   *   "customer",
   *   "emailpass",
   *   {
   *     email: "customer@gmail.com",
   *     password: "supersecret"
   *   }
   * ).then((token) => {
   *   console.log(token)
   * })
   */
  login = async (
    actor: string,
    method: string,
    payload: HttpTypes.AdminSignInWithEmailPassword | Record<string, unknown>
  ) => {
    // There will either be token or location returned from the backend.
    const { token, location } = await this.client.fetch<{
      token?: string
      location?: string
    }>(`/auth/${actor}/${method}`, {
      method: "POST",
      body: payload,
    })

    // In the case of an oauth login, we return the redirect location to the caller.
    // They can decide if they do an immediate redirect or put it in an <a> tag.
    if (location) {
      return { location }
    }

    await this.setToken_(token as string)
    return token as string
  }

  /**
   * This method is used to validate an Oauth callback from a third-party service, such as Google, for an admin user, customer, or custom actor types.
   * It sends a request to the [Validate Authentication Callback](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_providercallback).
   * 
   * @param actor - The actor type. For example, `user` for admin user, or `customer` for customer.
   * @param method - The authentication provider to use. For example, `google`.
   * @param query - The query parameters from the Oauth callback, which should be passed to the API route.
   * @returns The authentication JWT token
   * 
   * @example
   * sdk.auth.callback(
   *   "customer",
   *   "google",
   *   {
   *     code: "123",
   *   }
   * ).then((token) => {
   *   console.log(token)
   * })
   * 
   * 
   * @privateRemarks
   * The callback expects all query parameters from the Oauth callback to be passed to 
   * the backend, and the provider is in charge of parsing and validating them
   */
  callback = async (
    actor: string,
    method: string,
    query?: Record<string, unknown>
  ) => {
    const { token } = await this.client.fetch<{ token: string }>(
      `/auth/${actor}/${method}/callback`,
      {
        method: "GET",
        query,
      }
    )

    await this.setToken_(token)
    return token
  }

  /**
   * This method refreshes a JWT authentication token, which is useful after validating the Oauth callback
   * with {@link callback}. It sends a request to the [Refresh Authentication Token API route](https://docs.medusajs.com/api/admin#auth_postadminauthtokenrefresh).
   * 
   * @returns The refreshed JWT authentication token.
   * 
   * @example
   * sdk.auth.refresh()
   * .then((token) => {
   *   console.log(token)
   * })
   */
  refresh = async () => {
    const { token } = await this.client.fetch<{ token: string }>(
      "/auth/token/refresh",
      {
        method: "POST",
      }
    )

    // Putting the token in session after refreshing is only useful when the new token has updated info (eg. actor_id).
    // Ideally we don't use the full JWT in session as key, but just store a pseudorandom key that keeps the rest of the auth context as value.
    await this.setToken_(token)
    return token
  }

  /**
   * This method deletes the authentication session of the currently logged-in user to log them out.
   * It sends a request to the [Delete Authentication Session API route](https://docs.medusajs.com/api/admin#auth_deletesession).
   * 
   * @example
   * sdk.auth.logout()
   * .then(() => {
   *   // user is logged out
   * })
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
   * send the `email` and `password` properties.
   * 
   * @example
   * sdk.auth.updateProvider(
   *   "customer",
   *   "emailpass",
   *   {
   *     email: "customer@gmail.com",
   *     password: "supersecret"
   *   }
   * )
   * .then(() => {
   *   // password updated
   * })
   */
  updateProvider = async (
    actor: string,
    provider: string,
    body: Record<string, unknown>
  ) => {
    await this.client.fetch(`/auth/${actor}/${provider}/update`, {
      method: "POST",
      body,
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
