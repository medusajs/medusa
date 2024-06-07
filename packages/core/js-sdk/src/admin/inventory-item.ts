import {
  DeleteResponse,
  FindParams,
  HttpTypes,
  SelectParams,
} from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class InventoryItem {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreateInventoryItem,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminInventoryItemResponse>(
      `/admin/inventory-items`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async update(
    id: string,
    body: HttpTypes.AdminUpdateInventoryItem,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminInventoryItemResponse>(
      `/admin/inventory-items/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async list(
    query?: FindParams & HttpTypes.AdminInventoryItemFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminInventoryItemListResponse>(
      `/admin/inventory-items`,
      {
        query,
        headers,
      }
    )
  }

  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminInventoryItemResponse>(
      `/admin/inventory-items/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<DeleteResponse<"inventory_item">>(
      `/admin/inventory-items/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async listLevels(
    id: string,
    query?: FindParams & HttpTypes.AdminInventoryLevelFilters,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminInventoryLevelListResponse>(
      `/admin/inventory-items/${id}/location-levels`,
      {
        query,
        headers,
      }
    )
  }

  async updateLevel(
    id: string,
    locationId: string,
    body: HttpTypes.AdminUpdateInventoryLevel,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminInventoryItemResponse>(
      `/admin/inventory-items/${id}/location-levels/${locationId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async deleteLevel(id: string, locationId: string, headers?: ClientHeaders) {
    return await this.client.fetch<DeleteResponse<"inventory_item">>(
      `/admin/inventory-items/${id}/location-levels/${locationId}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async batchPostLevels(
    id: string,
    body: HttpTypes.AdminBatchPostInventoryLevelLocation,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminInventoryItemResponse>(
      `/admin/inventory-items/${id}/location-levels/batch`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
