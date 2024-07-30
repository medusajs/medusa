import { MetadataForm } from "../../../components/forms/metadata-form"
import { RouteDrawer } from "../../../components/modals"
import { useStore, useUpdateStore } from "../../../hooks/api"

export const StoreMetadata = () => {
  const { store, isPending, isError, error } = useStore()

  const { mutateAsync, isPending: isMutating } = useUpdateStore(store?.id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <MetadataForm
        isPending={isPending}
        isMutating={isMutating}
        hook={mutateAsync}
        metadata={store?.metadata}
      />
    </RouteDrawer>
  )
}
