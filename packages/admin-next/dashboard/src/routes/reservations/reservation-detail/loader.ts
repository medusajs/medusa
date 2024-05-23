import { LoaderFunctionArgs } from "react-router-dom"
import { reservationItemsQueryKeys } from "../../../hooks/api/reservations"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { ReservationItemRes } from "../../../types/api-responses"

const reservationDetailQuery = (id: string) => ({
  queryKey: reservationItemsQueryKeys.detail(id),
  queryFn: async () => client.reservations.retrieve(id),
})

export const reservationItemLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = reservationDetailQuery(id!)

  return (
    queryClient.getQueryData<ReservationItemRes>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
