import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useCollection } from "../../../hooks/api/collections"
import { useExtension } from "../../../providers/extension-provider"
import { CollectionGeneralSection } from "./components/collection-general-section"
import { CollectionProductSection } from "./components/collection-product-section"
import { collectionLoader } from "./loader"
import { PermissionGuard } from "../../../components/common/permission-guard"

export const CollectionDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof collectionLoader>
  >

  const { id } = useParams()
  const { collection, isLoading, isError, error } = useCollection(id!, {
    initialData,
  })

  const { getWidgets } = useExtension()

  if (isLoading || !collection) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product_collection.details.after"),
        before: getWidgets("product_collection.details.before"),
      }}
      showJSON
      showMetadata
      showRequiredPermissions
      data={collection}
    >
      <CollectionGeneralSection collection={collection} />
      <PermissionGuard permission="product:read">
        <CollectionProductSection collection={collection} />
      </PermissionGuard>
    </SingleColumnPage>
  )
}
