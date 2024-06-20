import { HttpTypes } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"

import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { shippingProfileQueryKeys } from "../../../hooks/api/shipping-profiles"

const shippingProfileQuery = (id: string) => ({
  queryKey: shippingProfileQueryKeys.detail(id),
  queryFn: async () => sdk.admin.shippingProfile.retrieve(id),
})

export const shippingProfileLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = shippingProfileQuery(id!)

  return (
    queryClient.getQueryData<{
      shipping_profile: HttpTypes.AdminShippingProfile
    }>(query.queryKey) ?? (await queryClient.fetchQuery(query))
  )
}
