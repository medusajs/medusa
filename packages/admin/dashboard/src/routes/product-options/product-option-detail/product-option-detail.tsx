import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { useProductOption } from "../../../hooks/api"
import { productOptionLoader } from "./loader.ts"
import { ProductOptionGeneralSection } from "./components/product-option-general-section"
import { ProductOptionProductSection } from "./components/product-option-product-section"
import { ProductOptionValuesSection } from "./components/product-option-values-section"

export const ProductOptionDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productOptionLoader>
  >

  const { getWidgets } = useExtension()

  const { product_option, isLoading, isError, error } = useProductOption(
    id!,
    { fields: "-products" },
    {
      initialData,
    }
  )

  if (isLoading || !product_option) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product_option.details.after"),
        before: getWidgets("product_option.details.before"),
      }}
      showJSON
      showMetadata
      data={product_option}
    >
      <ProductOptionGeneralSection productOption={product_option} />
      <ProductOptionValuesSection productOption={product_option} />
      <ProductOptionProductSection productOptionId={product_option.id} />
    </SingleColumnPage>
  )
}
