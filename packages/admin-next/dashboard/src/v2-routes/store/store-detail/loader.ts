import { AdminExtendedStoresRes } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { adminStoreKeys } from "medusa-react"
import { redirect } from "react-router-dom"

import { FetchQueryOptions } from "@tanstack/react-query"
import { medusa, queryClient } from "../../../lib/medusa"

const storeDetailQuery = () => ({
  queryKey: adminStoreKeys.details(),
  queryFn: async () => medusa.client.request("GET", "/admin/stores"),
})

const fetchQuery = async (
  query: FetchQueryOptions<Response<{ stores: any[] }>>
) => {
  try {
    const res = await queryClient.fetchQuery(query)
    // TODO: Reconsider store retrieval
    return res
  } catch (error) {
    const err = error ? JSON.parse(JSON.stringify(error)) : null

    if ((err as Error & { status: number })?.status === 401) {
      redirect("/login", 401)
    }
  }
}

export const storeLoader = async () => {
  const query = storeDetailQuery()

  return (
    queryClient.getQueryData<Response<AdminExtendedStoresRes>>(
      query.queryKey
    ) ?? (await fetchQuery(query))
  )
}
