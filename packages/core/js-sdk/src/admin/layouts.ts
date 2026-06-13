import { HttpTypes } from "@medusajs/types"

import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class Layouts {
  constructor(private client: Client) {}

  /**
   * Retrieve the layout configuration that applies to the current user for a
   * zone, falling back to the zone's system default.
   */
  async retrieveConfiguration(
    zone: string,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminLayoutConfigurationResponse> {
    return await this.client.fetch(`/admin/layouts/${zone}/configuration`, {
      method: "GET",
      headers,
    })
  }

  /**
   * Create or replace a layout configuration for a zone. Set `is_default` to
   * update the zone's system default (applies to all users) instead of the
   * current user's personal configuration.
   */
  async setConfiguration(
    zone: string,
    body: HttpTypes.AdminSetLayoutConfiguration,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminLayoutConfigurationResponse> {
    return await this.client.fetch(`/admin/layouts/${zone}/configuration`, {
      method: "POST",
      headers,
      body,
    })
  }

  /**
   * Remove the current user's personal layout configuration for a zone,
   * falling back to the zone's system default.
   */
  async deleteConfiguration(
    zone: string,
    headers?: ClientHeaders
  ): Promise<{ success: boolean }> {
    return await this.client.fetch(`/admin/layouts/${zone}/configuration`, {
      method: "DELETE",
      headers,
    })
  }
}
