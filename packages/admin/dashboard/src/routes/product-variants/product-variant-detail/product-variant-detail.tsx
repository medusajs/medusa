import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { useProductVariant } from "../../../hooks/api/products"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { MetadataSection } from "../../../components/common/metadata-section"
import { RequiredPermissionsSection } from "../../../components/common/required-permissions-section"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
import { VariantGeneralSection } from "./components/variant-general-section"
import {
  InventorySectionPlaceholder,
  VariantInventorySection,
} from "./components/variant-inventory-section"
import { VariantMediaSection } from "./components/variant-media-section"
import { VariantPricesSection } from "./components/variant-prices-section"
import { ExtendedVariant, VARIANT_DETAIL_FIELDS } from "./constants"
import { variantLoader } from "./loader"

export const ProductVariantDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof variantLoader>
  >

  const { id, variant_id } = useParams()
  const { variant, isLoading, isError, error } = useProductVariant(
    id!,
    variant_id!,
    { fields: VARIANT_DETAIL_FIELDS },
    {
      initialData,
    }
  )

  if (isLoading || !variant) {
    return (
      <TwoColumnPageSkeleton
        mainSections={2}
        sidebarSections={1}
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
      widgetsZonePrefix="product_variant.details"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      data={variant}
      sections={{
        main: (
          <>
            <VariantGeneralSection variant={variant as ExtendedVariant} />
            <VariantMediaSection variant={variant as ExtendedVariant} />
            {!variant.manage_inventory ? (
              <InventorySectionPlaceholder />
            ) : (
              <VariantInventorySection
                inventoryItems={(variant.inventory_items ?? [])
                  .filter((i) => i.inventory)
                  .map((i) => {
                    return {
                      ...i.inventory!,
                      required_quantity: i.required_quantity,
                      variant,
                    }
                  })}
              />
            )}
            <MetadataSection data={variant} />
            <JsonViewSection data={variant} />
            <RequiredPermissionsSection />
          </>
        ),
        side: (
          <>
            <VariantPricesSection variant={variant as ExtendedVariant} />
          </>
        ),
      }}
    />
  )
}
