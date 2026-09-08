import { HttpTypes } from "@medusajs/types"

import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

/**
 * This class is used to send requests to Admin Layout API Routes.
 */
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
   * This method retrieves a list of layout configurations for the current user,
   * including their personal configurations and system defaults.
   *
   * @param {HttpTypes.AdminGetLayoutConfigurationsParams} query - Filters and pagination parameters.
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<HttpTypes.AdminLayoutConfigurationListResponse>} The list of layout configurations.
   *
   * @example
   * const { layout_configurations } = await sdk.admin.layouts.listConfigurations()
   *
   * @tags layouts
   * @since 2.17.2
   */
  async listConfigurations(
    query?: HttpTypes.AdminGetLayoutConfigurationsParams,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminLayoutConfigurationListResponse> {
    return await this.client.fetch(`/admin/layouts/configurations`, {
      method: "GET",
      headers,
      query,
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
