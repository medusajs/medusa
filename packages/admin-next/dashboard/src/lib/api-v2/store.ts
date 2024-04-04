import {
  adminStoreKeys,
  useAdminCustomPost,
  useAdminCustomQuery,
} from "medusa-react"
import { Store } from "./types/store"

// TODO: Add types once we export V2 API types
export const useV2Store = (options?: any) => {
  const { data, isLoading, isError, error, ...rest } = useAdminCustomQuery(
    "/admin/stores",
    adminStoreKeys.details(),
    undefined,
    options
  )

  const store = data?.stores[0] as Store | undefined

  let hasError = isError
  let err: Error | null = error

  if (!isLoading && !isError && typeof store === "undefined") {
    hasError = true
    err = new Error("Store not found")
  }

  return { store, isLoading, isError: hasError, error: err, ...rest }
}

export const useV2UpdateStore = (id: string) => {
  return useAdminCustomPost(`/admin/stores/${id}`, adminStoreKeys.detail(id))
}
