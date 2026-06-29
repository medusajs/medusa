import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
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
    <LayoutComposer
      widgetsZonePrefix="product_option.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={product_option}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="ProductOptionGeneralSection">
              <ProductOptionGeneralSection productOption={product_option} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductOptionValuesSection">
              <ProductOptionValuesSection productOption={product_option} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductOptionProductSection">
              <ProductOptionProductSection productOptionId={product_option.id} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(product_option, { permissions: false })}
          </>
        ),
      }}
    />
  )
}
