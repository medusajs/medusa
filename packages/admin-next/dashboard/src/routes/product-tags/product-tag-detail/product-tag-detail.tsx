import { useParams } from "react-router-dom"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useProductTag } from "../../../hooks/api"
import { ProductTagGeneralSection } from "./components/product-tag-general-section"
import { ProductTagProductSection } from "./components/product-tag-product-section"

export const ProductTagDetail = () => {
  const { id } = useParams()

  const { product_tag, isPending, isError, error } = useProductTag(id!)

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
