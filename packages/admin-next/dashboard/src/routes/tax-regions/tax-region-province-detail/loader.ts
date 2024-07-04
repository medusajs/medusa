import { AdminTaxRegionResponse } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"
import { taxRegionsQueryKeys } from "../../../hooks/api/tax-regions"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const taxRegionDetailQuery = (id: string) => ({
  queryKey: taxRegionsQueryKeys.detail(id),
  queryFn: async () => sdk.admin.taxRegion.retrieve(id),
})

export const taxRegionLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.province_id
  const query = taxRegionDetailQuery(id!)

  return (
    queryClient.getQueryData<AdminTaxRegionResponse>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
