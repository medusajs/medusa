import { useParams } from "react-router-dom"

import { useTaxRegion } from "../../../hooks/api"
import { MetadataForm } from "../../../components/forms/metadata-form"
import { RouteDrawer } from "../../../components/modals"

/**
 * TODO: Tax region update endpoint is missing
 */

export const TaxRegionMetadata = () => {
  const { id } = useParams()

  const { tax_region, isPending, isError, error } = useTaxRegion(id)
  const { mutateAsync, isPending: isMutating } = {} // useUpdateTaxRegion(id)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <MetadataForm
        isPending={isPending}
        isMutating={isMutating}
        hook={mutateAsync}
        metadata={tax_region?.metadata}
      />
    </RouteDrawer>
  )
}
