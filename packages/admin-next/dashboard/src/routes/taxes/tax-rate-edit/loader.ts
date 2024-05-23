import { LoaderFunctionArgs } from "react-router-dom"

import { AdminTaxRateResponse } from "@medusajs/types"
import { taxRatesQueryKeys } from "../../../hooks/api/tax-rates"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const taxRateDetailQuery = (id: string) => ({
  queryKey: taxRatesQueryKeys.detail(id),
  queryFn: async () => client.taxes.retrieveTaxRate(id),
})

export const taxRateLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.taxRateId
  const query = taxRateDetailQuery(id!)

  return (
    queryClient.getQueryData<AdminTaxRateResponse>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
