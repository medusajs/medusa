import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { MetadataSection } from "../../../components/common/metadata-section"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
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
            <ProductTypeGeneralSection productType={product_type} />
            <ProductTypeProductSection productType={product_type} />
            <MetadataSection data={product_type} />
            <JsonViewSection data={product_type} />
          </>
        ),
      }}
    />
  )
}
