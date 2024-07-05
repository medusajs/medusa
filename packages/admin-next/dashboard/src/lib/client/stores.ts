import { UpdateStoreReq } from "../../types/api-payloads"
import { StoreListRes, StoreRes } from "../../types/api-responses"
import { getRequest, postRequest } from "./common"

async function retrieveStore(query?: Record<string, any>): Promise<StoreRes> {
  const response = await getRequest<StoreListRes>("/admin/stores", query)

  const activeStore = response.stores?.[0]

  if (!activeStore) {
    // Temp: Add proper error handling
    throw new Error("No active store found")
  }

  return { store: activeStore }
}

async function updateStore(id: string, payload: UpdateStoreReq) {
  return postRequest<StoreRes>(`/admin/stores/${id}`, payload)
}

export const stores = {
  retrieve: retrieveStore,
  update: updateStore,
}
