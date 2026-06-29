import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { useProduct } from "../../../hooks/api/products"
import { ProductAttributeSection } from "./components/product-attribute-section"
import { ProductGeneralSection } from "./components/product-general-section"
import { ProductMediaSection } from "./components/product-media-section"
import { ProductOptionSection } from "./components/product-option-section"
import { ProductOrganizationSection } from "./components/product-organization-section"
import { ProductSalesChannelSection } from "./components/product-sales-channel-section"
import { ProductVariantSection } from "./components/product-variant-section"
import { ExtendedProduct, PRODUCT_DETAIL_FIELDS } from "./constants"
import { productLoader } from "./loader"

import { ProductShippingProfileSection } from "./components/product-shipping-profile-section"

export const ProductDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productLoader>
  >

  const { id } = useParams()
  const { product, isLoading, isError, error } = useProduct(
    id!,
    { fields: PRODUCT_DETAIL_FIELDS },
    {
      initialData: initialData,
    }
  )

  if (isLoading || !product) {
    return (
      <TwoColumnPageSkeleton
        mainSections={4}
        sidebarSections={3}
        showJSON
        showMetadata
      />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="product.details"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      data={product}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="ProductGeneralSection">
              <ProductGeneralSection product={product} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductMediaSection">
              <ProductMediaSection product={product} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductOptionSection">
              <ProductOptionSection product={product} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductVariantSection">
              <ProductVariantSection product={product} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(product)}
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="ProductSalesChannelSection">
              <ProductSalesChannelSection product={product} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductShippingProfileSection">
              <ProductShippingProfileSection
                product={product as ExtendedProduct}
              />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductOrganizationSection">
              <ProductOrganizationSection product={product} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductAttributeSection">
              <ProductAttributeSection product={product} />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}
