import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class Module {
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
   * This method retrieves the list of modules installed in a Medusa application,
   * excluding link modules. Use it to check whether an optional module, such as
   * RBAC, is installed.
   *
   * @param headers - Headers to pass in the request.
   * @returns The list of modules.
   *
   * @example
   * sdk.admin.module.list()
   * .then(({ modules }) => {
   *   const isRbacInstalled = modules.some((module) => module.key === "rbac")
   * })
   */
  async list(headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminModulesListResponse>(
      `/admin/modules`,
      {
        headers,
        query: {},
      }
    )
  }
}
