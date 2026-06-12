import { useParams } from "react-router-dom"

import { LayoutComposer } from "@medusajs/dashboard/components"
import { JsonViewSection } from "../../../../components/json-view-section"
import { useProduct } from "../../../../hooks/api/products"
import { ProductGeneralSection } from "./components/product-general-section"
import { ProductMediaSection } from "./components/product-media-section"
import { ProductSalesChannelSection } from "./components/product-sales-channel-section"
import { ProductVariantSection } from "./components/product-variant-section"

export const ProductDetail = () => {
  const { id } = useParams()
  const { product, isLoading, isError, error } = useProduct(id!)

  if (isLoading || !product) {
    return
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="gift_card_product.details"
      preferredLayoutId="core:two-column"
      data={product}
      sections={{
        main: (
          <>
            <ProductGeneralSection product={product} />
            <ProductVariantSection product={product} />

            <JsonViewSection data={product} />
          </>
        ),
        side: (
          <>
            <ProductSalesChannelSection product={product} />
            <ProductMediaSection product={product} />
          </>
        ),
      }}
    />
  )
}

export default ProductDetail
