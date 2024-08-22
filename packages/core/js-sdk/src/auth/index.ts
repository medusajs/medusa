import { Client } from "../client"
import { AuthActor, AuthMethod, AuthPayload, AuthResponse, Config } from "../types"

export class Auth {
  private client: Client
  private config: Config

  constructor(client: Client, config: Config) {
    this.client = client
    this.config = config
  }

  login = async (
    actor: AuthActor,
    method: AuthMethod,
    payload: AuthPayload
  ) => {
    const response = await this.client.fetch<AuthResponse>(
      `/auth/${actor}/${method}?redirect=false`, // set redirect to false, to disable automatic redirect -> otherwise cors error
      {
        method: "POST",
        body: payload,
      }
    )

    // Redirect to 3rd Party Login
    if ("location" in response) {
      window.location.href = response.location
      return response.location
    }

    const { authToken } = response as { authToken: string }

    // By default we just set the token in memory, if configured to use sessions we convert it into session storage instead.
    if (this.config?.auth?.type === "session") {
      await this.client.fetch("/auth/session", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      })
    } else {
      this.client.setToken(authToken)
    }

    return authToken
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
    actor: AuthActor,
    method: AuthMethod,
    payload: AuthPayload
  ): Promise<{ token: string }> => {
    return await this.client.fetch(`/auth/${actor}/${method}?redirect=false`, {
      method: "POST",
      body: payload,
    })
  }
}
