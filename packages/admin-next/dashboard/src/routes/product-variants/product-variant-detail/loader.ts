import { LoaderFunctionArgs } from "react-router-dom"

import { variantsQueryKeys } from "../../../hooks/api/products"
import { queryClient } from "../../../lib/query-client"
import { VARIANT_DETAIL_FIELDS } from "./constants"
import { sdk } from "../../../lib/client"

const variantDetailQuery = (productId: string, variantId: string) => ({
  queryKey: variantsQueryKeys.detail(variantId),
  queryFn: async () =>
    sdk.admin.product.retrieveVariant(productId, variantId, {
      fields: VARIANT_DETAIL_FIELDS,
    }),
})

export const variantLoader = async ({ params }: LoaderFunctionArgs) => {
  const productId = params.id
  const variantId = params.variant_id

  const query = variantDetailQuery(productId!, variantId!)

  return (
    queryClient.getQueryData<any>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
