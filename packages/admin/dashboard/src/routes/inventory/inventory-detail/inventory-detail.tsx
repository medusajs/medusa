import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { MetadataSection } from "../../../components/common/metadata-section"
import { RequiredPermissionsSection } from "../../../components/common/required-permissions-section"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
import { useInventoryItem } from "../../../hooks/api/inventory"
import { InventoryItemAttributeSection } from "./components/inventory-item-attributes/attributes-section"
import { InventoryItemGeneralSection } from "./components/inventory-item-general-section"
import { InventoryItemLocationLevelsSection } from "./components/inventory-item-location-levels"
import { InventoryItemReservationsSection } from "./components/inventory-item-reservations"
import { InventoryItemVariantsSection } from "./components/inventory-item-variants/variants-section"
import { inventoryItemLoader } from "./loader"

import { INVENTORY_DETAIL_FIELDS } from "./constants"

export const InventoryDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof inventoryItemLoader>
  >

  const {
    inventory_item,
    isPending: isLoading,
    isError,
    error,
  } = useInventoryItem(
    id!,
    {
      fields: INVENTORY_DETAIL_FIELDS,
    },
    {
      initialData,
    }
  )

  if (isLoading || !inventory_item) {
    return (
      <TwoColumnPageSkeleton
        showJSON
        mainSections={3}
        sidebarSections={2}
        showMetadata
      />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="inventory_item.details"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      data={inventory_item}
      sections={{
        main: (
          <>
            <InventoryItemGeneralSection inventoryItem={inventory_item} />
            <InventoryItemLocationLevelsSection
              inventoryItem={inventory_item}
            />
            <InventoryItemReservationsSection inventoryItem={inventory_item} />
            <MetadataSection data={inventory_item} />
            <JsonViewSection data={inventory_item} />
            <RequiredPermissionsSection />
          </>
        ),
        side: (
          <>
            <InventoryItemVariantsSection
              variants={(inventory_item as any).variants}
            />
            <InventoryItemAttributeSection
              inventoryItem={inventory_item as any}
            />
          </>
        ),
      }}
    />
  )
}
