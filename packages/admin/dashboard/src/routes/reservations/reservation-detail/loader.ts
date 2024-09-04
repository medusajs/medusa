import { HttpTypes } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"
import { reservationItemsQueryKeys } from "../../../hooks/api/reservations"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const reservationDetailQuery = (id: string) => ({
  queryKey: reservationItemsQueryKeys.detail(id),
  queryFn: async () => sdk.admin.reservation.retrieve(id),
})

export const reservationItemLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = reservationDetailQuery(id!)

  return (
    queryClient.getQueryData<HttpTypes.AdminReservationResponse>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
