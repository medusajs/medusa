import { Outlet, json, useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
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

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !collection) {
    if (error) {
      throw error
    }

    throw json("An unknown error occurred", 500)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <CollectionGeneralSection collection={collection} />
      <CollectionProductSection collection={collection} />
      <JsonViewSection data={collection} />
      <Outlet />
    </div>
  )
}
