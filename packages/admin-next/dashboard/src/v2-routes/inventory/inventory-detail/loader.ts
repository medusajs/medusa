import { InventoryItemRes } from "../../../types/api-responses"
import { LoaderFunctionArgs } from "react-router-dom"
import { client } from "../../../lib/client"
import { inventoryItemsQueryKeys } from "../../../hooks/api/inventory"
import { queryClient } from "../../../lib/medusa"

const inventoryDetailQuery = (id: string) => ({
  queryKey: inventoryItemsQueryKeys.detail(id),
  queryFn: async () =>
    client.inventoryItems.retrieve(id, {
      fields: "*variants",
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
