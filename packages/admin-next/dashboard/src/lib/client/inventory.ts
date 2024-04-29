import {
  AdminInventoryItemListResponse,
  AdminInventoryItemResponse,
  AdminInventoryLevelResponse,
} from "@medusajs/types"
import {
  CreateInventoryItemReq,
  InventoryItemLocationBatch,
  UpdateInventoryItemReq,
  UpdateInventoryLevelReq,
} from "../../types/api-payloads"
import {
  InventoryItemLevelDeleteRes,
  InventoryItemLocationLevelsRes,
} from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function retrieveInventoryItem(id: string, query?: Record<string, any>) {
  return getRequest<AdminInventoryItemResponse>(
    `/admin/inventory-items/${id}`,
    query
  )
}

async function listInventoryItems(query?: Record<string, any>) {
  return getRequest<AdminInventoryItemListResponse>(
    `/admin/inventory-items`,
    query
  )
}

async function createInventoryItem(payload: CreateInventoryItemReq) {
  return postRequest<AdminInventoryItemResponse>(
    `/admin/inventory-items`,
    payload
  )
}

async function updateInventoryItem(
  id: string,
  payload: UpdateInventoryItemReq
) {
  return postRequest<AdminInventoryItemResponse>(
    `/admin/inventory-items/${id}`,
    payload
  )
}

async function deleteInventoryItem(id: string) {
  return deleteRequest<AdminInventoryItemResponse>(
    `/admin/inventory-items/${id}`
  )
}

async function listInventoryItemLevels(
  id: string,
  query?: Record<string, any>
) {
  return getRequest<InventoryItemLocationLevelsRes>(
    `/admin/inventory-items/${id}/location-levels`,
    query
  )
}

async function deleteInventoryItemLevel(
  inventoryItemId: string,
  locationId: string
) {
  return deleteRequest<InventoryItemLevelDeleteRes>(
    `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`
  )
}

async function updateInventoryLevel(
  inventoryItemId: string,
  locationId: string,
  payload: UpdateInventoryLevelReq
) {
  return postRequest<AdminInventoryItemResponse>(
    `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`,
    payload
  )
}

async function batchPostLocationLevels(
  inventoryItemId: string,
  payload: InventoryItemLocationBatch
) {
  return postRequest<AdminInventoryLevelResponse>(
    `/admin/inventory-items/${inventoryItemId}/location-levels/batch`,
    {
      create: payload.creates,
      delete: payload.deletes,
    }
  )
}

export const inventoryItems = {
  retrieve: retrieveInventoryItem,
  list: listInventoryItems,
  create: createInventoryItem,
  update: updateInventoryItem,
  delete: deleteInventoryItem,
  listLocationLevels: listInventoryItemLevels,
  updateInventoryLevel,
  deleteInventoryItemLevel,
  batchPostLocationLevels,
}
