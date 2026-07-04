import { LoaderFunctionArgs } from "react-router-dom"

import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { productOptionsQueryKeys } from "../../../hooks/api/product-options.tsx"

const productOptionDetailQuery = (id: string) => ({
  queryKey: productOptionsQueryKeys.detail(id),
  queryFn: async () =>
    sdk.admin.productOption.retrieve(id, { fields: "-products" }),
})

export const productOptionLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = productOptionDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}
