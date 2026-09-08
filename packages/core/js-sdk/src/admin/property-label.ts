import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class PropertyLabel {
  constructor(private client: Client) {}

  /**
   * List property labels with optional filtering
   */
  async list(
    query?: HttpTypes.AdminGetPropertyLabelsParams,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminPropertyLabelListResponse> {
    return await this.client.fetch("/admin/property-labels", {
      method: "GET",
      headers,
      query,
    })
  }

  /**
   * Create a new property label
   */
  async create(
    body: HttpTypes.AdminCreatePropertyLabel,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminPropertyLabelResponse> {
    return await this.client.fetch("/admin/property-labels", {
      method: "POST",
      headers,
      body,
    })
  }

  /**
   * Retrieve a specific property label
   */
  async retrieve(
    id: string,
    query?: HttpTypes.AdminGetPropertyLabelParams,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminPropertyLabelResponse> {
    return await this.client.fetch(`/admin/property-labels/${id}`, {
      method: "GET",
      headers,
      query,
    })
  }

  /**
   * Update a property label
   */
  async update(
    id: string,
    body: Omit<HttpTypes.AdminUpdatePropertyLabel, "id">,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminPropertyLabelResponse> {
    return await this.client.fetch(`/admin/property-labels/${id}`, {
      method: "POST",
      headers,
      body,
    })
  }

  /**
   * Delete a property label
   */
  async delete(
    id: string,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminPropertyLabelDeleteResponse> {
    return await this.client.fetch(`/admin/property-labels/${id}`, {
      method: "DELETE",
      headers,
    })
  }

  /**
   * Batch create, update, or delete property labels
   */
  async batch(
    body: HttpTypes.AdminBatchPropertyLabels,
    headers?: ClientHeaders
  ): Promise<HttpTypes.AdminBatchPropertyLabelResponse> {
    return await this.client.fetch("/admin/property-labels/batch", {
      method: "POST",
      headers,
      body,
    })
  }
}
