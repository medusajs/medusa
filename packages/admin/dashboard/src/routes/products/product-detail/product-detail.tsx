import { useLoaderData, useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
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

import { useExtension } from "../../../providers/extension-provider"
import { ProductShippingProfileSection } from "./components/product-shipping-profile-section"
import { usePermissions } from "../../../providers/permissions-provider"
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

  const { getWidgets } = useExtension()

  const after = getWidgets("product.details.after")
  const before = getWidgets("product.details.before")
  const sideAfter = getWidgets("product.details.side.after")
  const sideBefore = getWidgets("product.details.side.before")

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
    <TwoColumnPage
      widgets={{
        after,
        before,
        sideAfter,
        sideBefore,
      }}
      showJSON
      showMetadata
      data={product}
    >
      <TwoColumnPage.Main>
        <ProductGeneralSection product={product} />
        <ProductMediaSection product={product} />
        <PermissionGuard permission="product_option:read">
          <ProductOptionSection product={product} />
        </PermissionGuard>
        <PermissionGuard permission="product_variant:read">
          <ProductVariantSection product={product} />
        </PermissionGuard>
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <PermissionGuard permission="sales_channel:read">
          <ProductSalesChannelSection product={product} />
        </PermissionGuard>
        <PermissionGuard permission="shipping_profile:read">
          <ProductShippingProfileSection product={product as ExtendedProduct} />
        </PermissionGuard>
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
        <ProductAttributeSection product={product} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
