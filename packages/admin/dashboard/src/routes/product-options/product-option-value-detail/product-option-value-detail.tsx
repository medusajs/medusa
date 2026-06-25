import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { useProductOptionValue } from "../../../hooks/api"
import { productOptionValueLoader } from "./loader.ts"
import { ProductOptionValueGeneralSection } from "./components/product-option-value-general-section"

export const ProductOptionValueDetail = () => {
  const { id, value_id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productOptionValueLoader>
  >

  const { getWidgets } = useExtension()

  const { product_option_value, isLoading, isError, error } =
    useProductOptionValue(id!, value_id!, undefined, {
      initialData,
    })

  if (isLoading || !product_option_value) {
    return <SingleColumnPageSkeleton sections={1} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("product_option_value.details.after"),
        before: getWidgets("product_option_value.details.before"),
      }}
      showJSON
      showMetadata
      data={product_option_value}
    >
      <ProductOptionValueGeneralSection
        optionId={id!}
        productOptionValue={product_option_value}
      />
    </SingleColumnPage>
  )
}
