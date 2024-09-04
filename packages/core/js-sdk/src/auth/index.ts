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
    actor: "customer" | "user",
    method: "emailpass",
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

    // By default we just set the token in memory, if configured to use sessions we convert it into session storage instead.
    if (this.config?.auth?.type === "session") {
      await this.client.fetch("/auth/session", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    } else {
      this.client.setToken(token as string)
    }

    return token
  }

  // The callback expects all query parameters from the Oauth callback to be passed to the backend, and the provider is in charge of parsing and validating them
  callback = async (
    actor: "customer" | "user",
    method: "emailpass",
    query?: Record<string, unknown>
  ) => {
    const { token } = await this.client.fetch<{ token: string }>(
      `/auth/${actor}/${method}/callback`,
      {
        method: "GET",
        query,
      }
    )

    // By default we just set the token in memory, if configured to use sessions we convert it into session storage instead.
    if (this.config?.auth?.type === "session") {
      await this.client.fetch("/auth/session", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    } else {
      this.client.setToken(token)
    }

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

  create = async (
    actor: "customer" | "user",
    method: "emailpass",
    payload: { email: string; password: string }
  ): Promise<{ token: string }> => {
    return await this.client.fetch(`/auth/${actor}/${method}`, {
      method: "POST",
      body: payload,
    })
  }
}
