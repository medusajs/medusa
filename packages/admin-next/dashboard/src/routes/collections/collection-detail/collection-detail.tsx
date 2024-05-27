import { Outlet, json, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useCollection } from "../../../hooks/api/collections"
import { CollectionGeneralSection } from "./components/collection-general-section"
import { CollectionProductSection } from "./components/collection-product-section"
import { collectionLoader } from "./loader"

import after from "virtual:medusa/widgets/product_collection/details/after"
import before from "virtual:medusa/widgets/product_collection/details/before"

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
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={collection} />
          </div>
        )
      })}
      <CollectionGeneralSection collection={collection} />
      <CollectionProductSection collection={collection} />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={collection} />
          </div>
        )
      })}
      <JsonViewSection data={collection} />
      <Outlet />
    </div>
  )
}
