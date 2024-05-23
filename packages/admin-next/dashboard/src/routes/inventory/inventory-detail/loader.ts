import { LoaderFunctionArgs } from "react-router-dom"
import { inventoryItemsQueryKeys } from "../../../hooks/api/inventory"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { InventoryItemRes } from "../../../types/api-responses"

const inventoryDetailQuery = (id: string) => ({
  queryKey: inventoryItemsQueryKeys.detail(id),
  queryFn: async () =>
    client.inventoryItems.retrieve(id, {
      fields: "*variant",
    }),
})

export const inventoryItemLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = inventoryDetailQuery(id!)

  return (
    queryClient.getQueryData<InventoryItemRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
