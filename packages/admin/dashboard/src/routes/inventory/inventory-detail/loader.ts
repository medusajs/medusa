import { LoaderFunctionArgs } from "react-router-dom"

import { inventoryItemsQueryKeys } from "../../../hooks/api/inventory"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { INVENTORY_DETAIL_FIELDS } from "./constants"

const inventoryDetailQueryParams = {
  fields: INVENTORY_DETAIL_FIELDS,
}

const inventoryDetailQuery = (id: string) => ({
  queryKey: inventoryItemsQueryKeys.detail(id, inventoryDetailQueryParams),
  queryFn: async () =>
    sdk.admin.inventoryItem.retrieve(id, inventoryDetailQueryParams),
})

export const inventoryItemLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = inventoryDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}
