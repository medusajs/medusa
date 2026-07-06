import { useParams } from "react-router-dom"
import { MetadataForm } from "../../../components/forms/metadata-form"
import { useStockLocation, useUpdateStockLocation } from "../../../hooks/api"

export const LocationMetadata = () => {
  const { location_id } = useParams()

  const { stock_location, isPending, isError, error } = useStockLocation(
    location_id!,
    { fields: "id,metadata" }
  )

  const { mutateAsync, isPending: isMutating } = useUpdateStockLocation(
    location_id!
  )

  if (isError) {
    throw error
  }

  return (
    <MetadataForm
      metadata={stock_location?.metadata}
      hook={mutateAsync}
      isPending={isPending}
      isMutating={isMutating}
    />
  )
}
