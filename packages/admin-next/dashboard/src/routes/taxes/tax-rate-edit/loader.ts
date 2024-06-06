import { AdminTaxRateResponse } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"
import { taxRatesQueryKeys } from "../../../hooks/api/tax-rates"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const taxRateDetailQuery = (id: string) => ({
  queryKey: taxRatesQueryKeys.detail(id),
  queryFn: async () => sdk.admin.taxRate.retrieve(id),
})

export const taxRateLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.taxRateId
  const query = taxRateDetailQuery(id!)

  return (
    queryClient.getQueryData<AdminTaxRateResponse>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
