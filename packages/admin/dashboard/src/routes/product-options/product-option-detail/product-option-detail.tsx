import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { PermissionGuard } from "../../../components/common/permission-guard"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import {
  LayoutComposer,
  detailPageDefaultEntries,
} from "../../../components/layout-composer"
import { useProductOption } from "../../../hooks/api"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { productOptionLoader } from "./loader.ts"
import { ProductOptionGeneralSection } from "./components/product-option-general-section"
import { ProductOptionProductSection } from "./components/product-option-product-section"
import { ConfigurableProductOptionProductSection } from "./components/product-option-product-section/configurable-product-option-product-section"
import { ProductOptionValuesSection } from "./components/product-option-values-section"
import { ConfigurableProductOptionValuesSection } from "./components/product-option-values-section/configurable-product-option-values-section"

export const ProductOptionDetail = () => {
  const { id } = useParams()
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

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
              <PermissionGuard permission="product_option_value:read">
                {isViewConfigEnabled ? (
                  <ConfigurableProductOptionValuesSection
                    productOption={product_option}
                  />
                ) : (
                  <ProductOptionValuesSection productOption={product_option} />
                )}
              </PermissionGuard>
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductOptionProductSection">
              <PermissionGuard permission="product:read">
                {isViewConfigEnabled ? (
                  <ConfigurableProductOptionProductSection
                    productOptionId={product_option.id}
                  />
                ) : (
                  <ProductOptionProductSection
                    productOptionId={product_option.id}
                  />
                )}
              </PermissionGuard>
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(product_option)}
          </>
        ),
      }}
    />
  )
}
