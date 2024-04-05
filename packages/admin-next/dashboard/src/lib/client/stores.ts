import { UpdateStoreReq } from "../../types/api-payloads"
import { StoreListRes, StoreRes } from "../../types/api-responses"
import { makeRequest } from "./common"

async function retrieveStore(query?: Record<string, any>): Promise<StoreRes> {
  const response = await makeRequest<StoreListRes, Record<string, any>>(
    "/admin/stores",
    query
  )

  const activeStore = response.stores?.[0]

  if (!activeStore) {
    throw new Error("No active store found")
  }

  return { store: activeStore }
}

async function updateStore(id: string, payload: UpdateStoreReq) {
  return makeRequest<StoreRes>(`/admin/stores/${id}`, undefined, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export const stores = {
  retrieve: retrieveStore,
  update: updateStore,
}
