import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { useCollection } from "../../../hooks/api/collections"
import { CollectionGeneralSection } from "./components/collection-general-section"
import { CollectionProductSection } from "./components/collection-product-section"
import { collectionLoader } from "./loader"

export const CollectionDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof collectionLoader>
  >

  const { id } = useParams()
  const { collection, isLoading, isError, error } = useCollection(id!, {
    initialData,
  })

  if (isLoading || !collection) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="product_collection.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={collection}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="CollectionGeneralSection">
              <CollectionGeneralSection collection={collection} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="CollectionProductSection">
              <CollectionProductSection collection={collection} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(collection, { permissions: false })}
          </>
        ),
      }}
    />
  )
}
