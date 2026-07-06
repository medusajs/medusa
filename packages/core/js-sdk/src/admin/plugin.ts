import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class Plugin {
  /**
   * @ignore
   */
  private client: Client

  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * This method retrieves the list of plugins installed in a Medusa application.
   * 
   * @param headers - Headers to pass in the request.
   * @returns The list of plugins.
   * 
   * @example
   * sdk.admin.plugin.list()
   * .then(({ plugins }) => {
   *   console.log(plugins)
   * })
   */
  async list(headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminPluginsListResponse>(
      `/admin/plugins`,
      {
        headers,
        query: {},
      }
    )
  }
}
