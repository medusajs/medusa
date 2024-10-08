import { useParams } from "react-router-dom"

import { MetadataForm } from "../../../components/forms/metadata-form"
import { RouteDrawer } from "../../../components/modals"
import { useUpdateUser, useUser } from "../../../hooks/api"

export const UserMetadata = () => {
  const { id } = useParams()

  const { user, isPending, isError, error } = useUser(id)
  const { mutateAsync, isPending: isMutating } = useUpdateUser(id)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <MetadataForm
        isPending={isPending}
        isMutating={isMutating}
        hook={mutateAsync}
        metadata={user?.metadata}
      />
    </RouteDrawer>
  )
}
