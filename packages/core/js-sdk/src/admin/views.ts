import { HttpTypes, SelectParams } from "@medusajs/types"

import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

/**
 * This class is used to send requests to the view configuration admin API routes.
 * It can be accessed via `sdk.admin.views`.
 *
 * View configurations store the column visibility, ordering, filters, and sorting
 * preferences for an entity's data table in the admin dashboard.
 */
export class Views {
  constructor(private client: Client) {}

  /**
   * This method retrieves the list of entities that support view configurations.
   *
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<HttpTypes.AdminEntityListResponse>} The list of supported entities.
   *
   * @example
   * sdk.admin.views.listEntities()
   * .then(({ entities }) => {
   *   console.log(entities)
   * })
   *
   * @tags views
   * @since 2.18.0
   * @featureFlag view_configurations
   */
  async listEntities(
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminEntityListResponse> {
    return await this.client.fetch("/admin/views/entities", {
      method: "GET",
      headers,
    })
  }

  /**
   * This method retrieves the columns available for an entity's data table.
   *
   * @param {string} entity - The entity to retrieve the columns for.
   * @param {SelectParams} query - Configure the fields to retrieve in the columns.
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<HttpTypes.AdminViewsEntityColumnsResponse>} The entity's available columns.
   *
   * @example
   * const { columns } = await sdk.admin.views.columns("orders")
   *
   * @tags views
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  async columns(
    entity: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminViewsEntityColumnsResponse> {
    return await this.client.fetch(`/admin/views/${entity}/columns`, {
      method: "GET",
      headers,
      query,
    })
  }

  /**
   * This method retrieves a paginated list of view configurations for an entity.
   *
   * @param {string} entity - The entity to retrieve the view configurations for.
   * @param {HttpTypes.AdminGetViewConfigurationsParams} query - Filters and pagination configurations.
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<HttpTypes.AdminViewConfigurationListResponse>} The paginated list of view configurations.
   *
   * @example
   * To retrieve the list of view configurations:
   *
   * ```ts
   * sdk.admin.views.listConfigurations("orders")
   * .then(({ view_configurations, count, limit, offset }) => {
   *   console.log(view_configurations)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.views.listConfigurations("orders", {
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ view_configurations, count, limit, offset }) => {
   *   console.log(view_configurations)
   * })
   * ```
   *
   * @tags views
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  async listConfigurations(
    entity: string,
    query?: HttpTypes.AdminGetViewConfigurationsParams,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminViewConfigurationListResponse> {
    return await this.client.fetch(`/admin/views/${entity}/configurations`, {
      method: "GET",
      headers,
      query,
    })
  }

  /**
   * This method creates a view configuration for an entity.
   *
   * @param {string} entity - The entity to create the view configuration for.
   * @param {HttpTypes.AdminCreateViewConfiguration} body - The view configuration's details.
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<HttpTypes.AdminViewConfigurationResponse>} The created view configuration.
   *
   * @example
   * const { view_configuration } = await sdk.admin.views.createConfiguration(
   *   "orders",
   *   {
   *     name: "My Orders View",
   *     configuration: {
   *       visible_columns: ["display_id", "status"],
   *       column_order: ["display_id", "status"],
   *     },
   *   }
   * )
   *
   * @tags views
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  async createConfiguration(
    entity: string,
    body: HttpTypes.AdminCreateViewConfiguration,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminViewConfigurationResponse> {
    return await this.client.fetch(`/admin/views/${entity}/configurations`, {
      method: "POST",
      headers,
      body,
    })
  }

  /**
   * This method retrieves a view configuration by its ID.
   *
   * @param {string} entity - The entity the view configuration belongs to.
   * @param {string} id - The ID of the view configuration to retrieve.
   * @param {SelectParams} query - Configure the fields to retrieve in the view configuration.
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<HttpTypes.AdminViewConfigurationResponse>} The view configuration's details.
   *
   * @example
   * To retrieve a view configuration by its ID:
   *
   * ```ts
   * sdk.admin.views.retrieveConfiguration("orders", "viewconfig_123")
   * .then(({ view_configuration }) => {
   *   console.log(view_configuration)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.views.retrieveConfiguration("orders", "viewconfig_123", {
   *   fields: "id,name,configuration"
   * })
   * .then(({ view_configuration }) => {
   *   console.log(view_configuration)
   * })
   * ```
   *
   * @tags views
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  async retrieveConfiguration(
    entity: string,
    id: string,
    query?: SelectParams,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminViewConfigurationResponse> {
    return await this.client.fetch(
      `/admin/views/${entity}/configurations/${id}`,
      {
        method: "GET",
        headers,
        query,
      }
    )
  }

  /**
   * This method updates a view configuration's details.
   *
   * @param {string} entity - The entity the view configuration belongs to.
   * @param {string} id - The ID of the view configuration to update.
   * @param {HttpTypes.AdminUpdateViewConfiguration} body - The details to update in the view configuration.
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<HttpTypes.AdminViewConfigurationResponse>} The updated view configuration.
   *
   * @example
   * const { view_configuration } = await sdk.admin.views.updateConfiguration(
   *   "orders",
   *   "viewconfig_123",
   *   {
   *     name: "Updated View",
   *   }
   * )
   *
   * @tags views
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  async updateConfiguration(
    entity: string,
    id: string,
    body: HttpTypes.AdminUpdateViewConfiguration,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminViewConfigurationResponse> {
    return await this.client.fetch(
      `/admin/views/${entity}/configurations/${id}`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }

  /**
   * This method deletes a view configuration.
   *
   * @param {string} entity - The entity the view configuration belongs to.
   * @param {string} id - The ID of the view configuration to delete.
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<HttpTypes.AdminViewConfigurationDeleteResponse>} The deletion's details.
   *
   * @example
   * const { id, object, deleted } = await sdk.admin.views.deleteConfiguration(
   *   "orders",
   *   "viewconfig_123"
   * )
   *
   * @tags views
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  async deleteConfiguration(
    entity: string,
    id: string,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminViewConfigurationDeleteResponse> {
    return await this.client.fetch(
      `/admin/views/${entity}/configurations/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method retrieves the active view configuration for an entity and the
   * authenticated user.
   *
   * @param {string} entity - The entity to retrieve the active view configuration for.
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<HttpTypes.AdminViewConfigurationResponse & { active_view_configuration_id?: string | null }>} The active view configuration, along with its ID.
   *
   * @example
   * sdk.admin.views.retrieveActiveConfiguration("orders")
   * .then(({ view_configuration, active_view_configuration_id }) => {
   *   console.log(view_configuration)
   * })
   *
   * @tags views
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  async retrieveActiveConfiguration(
    entity: string,
    headers?: ClientHeaders
  ): Promise<
    HttpTypes.AdminViewConfigurationResponse & {
      active_view_configuration_id?: string | null
    }
  > {
    return await this.client.fetch(
      `/admin/views/${entity}/configurations/active`,
      {
        method: "GET",
        headers,
      }
    )
  }

  /**
   * This method sets the active view configuration for an entity and the
   * authenticated user. Pass `null` as the `view_configuration_id` to clear the
   * active view.
   *
   * @param {string} entity - The entity to set the active view configuration for.
   * @param {object} body - The active view configuration's details.
   * @param {string | null} body.view_configuration_id - The ID of the view configuration to set as active, or `null` to clear it.
   * @param {ClientHeaders} headers - Headers to pass in the request.
   * @returns {Promise<{ success: boolean }>} Whether the active view configuration was set successfully.
   *
   * @example
   * await sdk.admin.views.setActiveConfiguration("orders", {
   *   view_configuration_id: "viewconfig_123",
   * })
   *
   * @tags views
   * @since 2.10.3
   * @featureFlag view_configurations
   */
  async setActiveConfiguration(
    entity: string,
    body: { view_configuration_id: string | null },
    headers?: ClientHeaders
  ): Promise<{ success: boolean }> {
    return await this.client.fetch(
      `/admin/views/${entity}/configurations/active`,
      {
        method: "POST",
        headers,
        body,
      }
    )
  }
}
