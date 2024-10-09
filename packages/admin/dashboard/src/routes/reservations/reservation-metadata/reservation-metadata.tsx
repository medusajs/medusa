import { useParams } from "react-router-dom"

import {
  useReservationItem,
  useUpdateReservationItem,
} from "../../../hooks/api"
import { MetadataForm } from "../../../components/forms/metadata-form"
import { RouteDrawer } from "../../../components/modals"

export const ReservationMetadata = () => {
  const { id } = useParams()

  const { reservation, isPending, isError, error } = useReservationItem(id)
  const { mutateAsync, isPending: isMutating } = useUpdateReservationItem(id)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <MetadataForm
        isPending={isPending}
        isMutating={isMutating}
        hook={mutateAsync}
        metadata={reservation?.metadata}
      />
    </RouteDrawer>
  )
}
