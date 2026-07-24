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
            <LayoutComposer.Entry id="ProductGeneralSection">
              <ProductGeneralSection product={product} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductVariantSection">
              <ProductVariantSection product={product} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="JsonViewSection">
              <JsonViewSection data={product} />
            </LayoutComposer.Entry>
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="ProductSalesChannelSection">
              <ProductSalesChannelSection product={product} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductMediaSection">
              <ProductMediaSection product={product} />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}

export default ProductDetail
