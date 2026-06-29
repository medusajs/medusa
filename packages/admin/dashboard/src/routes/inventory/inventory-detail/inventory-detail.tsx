import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
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
            <LayoutComposer.Entry id="InventoryItemGeneralSection">
              <InventoryItemGeneralSection inventoryItem={inventory_item} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="InventoryItemLocationLevelsSection">
              <InventoryItemLocationLevelsSection
                inventoryItem={inventory_item}
              />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="InventoryItemReservationsSection">
              <InventoryItemReservationsSection inventoryItem={inventory_item} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(inventory_item)}
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="InventoryItemVariantsSection">
              <InventoryItemVariantsSection
                variants={(inventory_item as any).variants}
              />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="InventoryItemAttributeSection">
              <InventoryItemAttributeSection
                inventoryItem={inventory_item as any}
              />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}
