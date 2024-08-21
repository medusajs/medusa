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

    // IMPORTANT: The below code is NOT executed if the the authentication method
    // is provided a successRedirectUrl in the medusa-config options

    const { authToken } = response

    // By default we just set the token in memory, if configured to use sessions we convert it into session storage instead.
    if (this.config?.auth?.type === "session") {
      await this.client.fetch("/auth/session", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      })

      // This will delete the csrf-Token as it is not need with session based Authentication
      this.client.clearCsrfToken()
    } else {
      this.client.setToken(authToken)

      // No need to set the csrf-Token here, as it is done in the callback route
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
    this.client.clearCsrfToken()
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
