import { HttpTypes } from "@zjedene-medusa/types"
import { LoaderFunctionArgs } from "react-router-dom"
import { regionsQueryKeys } from "../../../hooks/api/regions"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { REGION_DETAIL_FIELDS } from "./constants"

const regionQuery = (id: string) => ({
  queryKey: regionsQueryKeys.detail(id),
  queryFn: async () =>
    sdk.admin.region.retrieve(id, {
      fields: REGION_DETAIL_FIELDS,
    }),
})

export const regionLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = regionQuery(id!)

  return (
    queryClient.getQueryData<{ region: HttpTypes.AdminRegion }>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
