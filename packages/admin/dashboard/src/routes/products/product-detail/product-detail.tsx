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
import { PermissionGuard } from "../../../components/common/permission-guard"

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
              <PermissionGuard permission="product_option:read">
                <ProductOptionSection product={product} />
              </PermissionGuard>
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductVariantSection">
              <PermissionGuard permission="product_variant:read">
                <ProductVariantSection product={product} />
              </PermissionGuard>
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(product)}
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="ProductSalesChannelSection">
              <PermissionGuard permission="sales_channel:read">
                <ProductSalesChannelSection product={product} />
              </PermissionGuard>
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductShippingProfileSection">
              <PermissionGuard permission="shipping_profile:read">
                <ProductShippingProfileSection
                  product={product as ExtendedProduct}
                />
              </PermissionGuard>
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="ProductOrganizationSection">
              <PermissionGuard
                permissions={[
                  "product_tag:read",
                  "product_type:read",
                  "product_collection:read",
                  "product_category:read",
                ]}
              >
                <ProductOrganizationSection product={product} />
              </PermissionGuard>
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
