import { Client } from "../client"
import { Config } from "../types"

export class Auth {
  private client: Client
  private config: Config

  constructor(client: Client, config: Config) {
    this.client = client
    this.config = config
  }

  login = async (payload: { email: string; password: string }) => {
    // TODO: It is a bit strange to eg. require to pass `scope` in `login`, it might be better for us to have auth methods in both `admin` and `store` classes instead?
    const { token } = await this.client.fetch<{ token: string }>(
      "/auth/admin/emailpass",
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
    await this.client.fetch("/auth/session", {
      method: "DELETE",
    })

    this.client.clearToken()
  }
}
