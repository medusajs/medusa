import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { useProductType } from "../../../hooks/api/product-types"
import { ProductTypeGeneralSection } from "./components/product-type-general-section"
import { ProductTypeProductSection } from "./components/product-type-product-section"
import { productTypeLoader } from "./loader"

export const ProductTypeDetail = () => {
  const { id } = useParams()
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productTypeLoader>
  >

  const { product_type, isPending, isError, error } = useProductType(
    id!,
    undefined,
    {
      initialData,
    }
  )

  if (isPending || !product_type) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="product_type.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={product_type}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="ProductTypeGeneralSection">
              <ProductTypeGeneralSection productType={product_type} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductTypeProductSection">
              <ProductTypeProductSection productType={product_type} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(product_type, { permissions: false })}
          </>
        ),
      }}
    />
  )
}
