import { LoaderFunctionArgs } from "react-router-dom"
import { HttpTypes } from "@medusajs/types"

import { inventoryItemsQueryKeys } from "../../../hooks/api/inventory"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const inventoryDetailQuery = (id: string) => ({
  queryKey: inventoryItemsQueryKeys.detail(id),
  queryFn: async () =>
    sdk.admin.inventoryItem.retrieve(id, {
      fields: "*variant",
    }),
})

export const inventoryItemLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = inventoryDetailQuery(id!)

  return (
    queryClient.getQueryData<HttpTypes.AdminInventoryItemResponse>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
