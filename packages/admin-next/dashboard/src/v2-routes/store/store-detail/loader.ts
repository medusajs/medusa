import { Response } from "@medusajs/medusa-js"
import { adminStoreKeys } from "medusa-react"
import { redirect } from "react-router-dom"

import { StoreDTO } from "@medusajs/types"
import { FetchQueryOptions } from "@tanstack/react-query"
import { medusa, queryClient } from "../../../lib/medusa"

const storeDetailQuery = () => ({
  queryKey: adminStoreKeys.details(),
  queryFn: async () => medusa.admin.custom.get("/stores"),
})

const fetchQuery = async (
  query: FetchQueryOptions<Response<{ stores: any[] }>>
) => {
  try {
    const res = await queryClient.fetchQuery(query)
    console.log("bib", res)
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
    queryClient.getQueryData<Response<{ stores: StoreDTO[] }>>(
      query.queryKey
    ) ?? (await fetchQuery(query))
  )
}
