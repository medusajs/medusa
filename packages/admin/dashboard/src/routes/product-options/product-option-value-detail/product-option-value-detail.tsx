import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
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
            <LayoutComposer.Entry id="ProductOptionValueGeneralSection">
              <ProductOptionValueGeneralSection
                optionId={id!}
                productOptionValue={product_option_value}
              />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(product_option_value, { permissions: false })}
          </>
        ),
      }}
    />
  )
}
