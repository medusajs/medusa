import { useLoaderData, useParams } from "react-router-dom"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useProductTag } from "../../../hooks/api"
import { ProductTagGeneralSection } from "./components/product-tag-general-section"
import { ProductTagProductSection } from "./components/product-tag-product-section"
import { productTagLoader } from "./loader"

export const ProductTagDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productTagLoader>
  >

  const { product_tag, isPending, isError, error } = useProductTag(
    id!,
    undefined,
    {
      initialData,
    }
  )

  if (isPending || !product_tag) {
    return <SingleColumnPageSkeleton showJSON sections={2} />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      widgets={{ before: { widgets: [] }, after: { widgets: [] } }}
      showJSON
      data={product_tag}
    >
      <ProductTagGeneralSection productTag={product_tag} />
      <ProductTagProductSection productTag={product_tag} />
    </SingleColumnPage>
  )
}
