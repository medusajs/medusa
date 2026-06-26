import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { MetadataSection } from "../../../components/common/metadata-section"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
import { useProductOptionValue } from "../../../hooks/api"
import { productOptionValueLoader } from "./loader.ts"
import { ProductOptionValueGeneralSection } from "./components/product-option-value-general-section"

export const ProductOptionValueDetail = () => {
  const { id, value_id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productOptionValueLoader>
  >

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
    <LayoutComposer
      widgetsZonePrefix="product_option_value.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={product_option_value}
      sections={{
        main: (
          <>
            <ProductOptionValueGeneralSection
              optionId={id!}
              productOptionValue={product_option_value}
            />
            <MetadataSection data={product_option_value} />
            <JsonViewSection data={product_option_value} />
          </>
        ),
      }}
    />
  )
}
