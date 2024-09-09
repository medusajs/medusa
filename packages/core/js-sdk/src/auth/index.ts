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

  // The callback expects all query parameters from the Oauth callback to be passed to the backend, and the provider is in charge of parsing and validating them
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

  logout = async () => {
    if (this.config?.auth?.type === "session") {
      await this.client.fetch("/auth/session", {
        method: "DELETE",
      })
    }

    this.client.clearToken()
  }

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
