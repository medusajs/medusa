import { Client } from "../client"
import { Config } from "../types"

export class Auth {
  private client: Client
  private config: Config

  constructor(client: Client, config: Config) {
    this.client = client
    this.config = config
  }

  login = async (
    scope: "admin" | "store",
    method: "emailpass",
    payload: { email: string; password: string }
  ) => {
    const { token } = await this.client.fetch<{ token: string }>(
      `/auth/${scope}/${method}`,
      {
        method: "POST",
        body: payload,
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
    scope: "admin" | "store",
    method: "emailpass",
    payload: { email: string; password: string }
  ): Promise<{ token: string }> => {
    return await this.client.fetch(`/auth/${scope}/${method}`, {
      method: "POST",
      body: payload,
    })
  }
}
