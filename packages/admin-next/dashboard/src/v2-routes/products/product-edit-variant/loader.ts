import { LoaderFunctionArgs } from "react-router-dom"

import { medusa, queryClient } from "../../../lib/medusa"
import { productsQueryKeys } from "../../../hooks/api/products"

const queryKey = (id: string) => {
  return [productsQueryKeys.detail(id)]
}

const queryFn = async (id: string) => {
  const productRes = await medusa.admin.products.retrieve(id)

  const storeRes = await medusa.admin.store.retrieve()

  const isStockAndInventoryEnabled = storeRes.store.modules.some(
    (m) => m.module === "inventoryService" || "stockLocationService"
  )

  return {
    initialData: productRes,
    isStockAndInventoryEnabled,
  }
}

const editProductVariantQuery = (id: string) => ({
  queryKey: queryKey(id),
  queryFn: async () => queryFn(id),
})

export const editProductVariantLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  const id = params.id
  const query = editProductVariantQuery(id!)

  return (
    queryClient.getQueryData<ReturnType<typeof queryFn>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
