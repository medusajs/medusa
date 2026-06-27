import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { MetadataSection } from "../../../components/common/metadata-section"
import { RequiredPermissionsSection } from "../../../components/common/required-permissions-section"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
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
            <ProductGeneralSection product={product} />
            <ProductMediaSection product={product} />
            <ProductOptionSection product={product} />
            <ProductVariantSection product={product} />
            <MetadataSection data={product} />
            <JsonViewSection data={product} />
            <RequiredPermissionsSection />
          </>
        ),
        side: (
          <>
            <ProductSalesChannelSection product={product} />
            <ProductShippingProfileSection
              product={product as ExtendedProduct}
            />
            <ProductOrganizationSection product={product} />
            <ProductAttributeSection product={product} />
          </>
        ),
      }}
    />
  )
}
