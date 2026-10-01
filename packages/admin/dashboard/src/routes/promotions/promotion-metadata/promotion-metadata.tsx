import { useParams } from "react-router-dom"

import { MetadataForm } from "../../../components/forms/metadata-form"
import { RouteDrawer } from "../../../components/modals"
import { usePromotion, useUpdatePromotion } from "../../../hooks/api/promotions"

export const PromotionMetadata = () => {
  const { id } = useParams()

  const { promotion, isPending, isError, error } = usePromotion(id!)
  const { mutateAsync, isPending: isMutating } = useUpdatePromotion(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <MetadataForm
        isPending={isPending}
        isMutating={isMutating}
        hook={mutateAsync}
        metadata={promotion?.metadata}
      />
    </RouteDrawer>
  )
}
