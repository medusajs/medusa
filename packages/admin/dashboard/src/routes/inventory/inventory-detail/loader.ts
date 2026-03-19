import { LoaderFunctionArgs } from "react-router-dom"

import { inventoryItemsQueryKeys } from "../../../hooks/api/inventory"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { INVENTORY_DETAIL_FIELDS } from "./constants"

const inventoryDetailQuery = (id: string) => ({
  queryKey: inventoryItemsQueryKeys.detail(id),
  queryFn: async () =>
    sdk.admin.inventoryItem.retrieve(id, {
      fields: INVENTORY_DETAIL_FIELDS,
      order: "-created_at",
    }),
})

export const inventoryItemLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = inventoryDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}
