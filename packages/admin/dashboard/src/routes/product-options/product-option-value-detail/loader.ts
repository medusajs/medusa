import { LoaderFunctionArgs } from "react-router-dom"

import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { productOptionValuesQueryKeys } from "../../../hooks/api/product-options.tsx"

const productOptionValueDetailQuery = (optionId: string, valueId: string) => ({
  queryKey: productOptionValuesQueryKeys.detail(valueId),
  queryFn: async () =>
    sdk.admin.productOption.retrieveValue(optionId, valueId),
})

export const productOptionValueLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  const optionId = params.id
  const valueId = params.value_id
  const query = productOptionValueDetailQuery(optionId!, valueId!)

  return queryClient.ensureQueryData(query)
}
