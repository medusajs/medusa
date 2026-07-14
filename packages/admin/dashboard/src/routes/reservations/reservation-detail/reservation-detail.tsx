import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { useInventoryItem } from "../../../hooks/api"
import { useReservationItem } from "../../../hooks/api/reservations"
import { InventoryItemGeneralSection } from "../../inventory/inventory-detail/components/inventory-item-general-section"
import { ReservationGeneralSection } from "./components/reservation-general-section"
import { reservationItemLoader } from "./loader"

export const ReservationDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof reservationItemLoader>
  >

  const { reservation, isLoading, isError, error } = useReservationItem(
    id!,
    undefined,
    {
      initialData,
    }
  )

  // TEMP: fetch directly since the fields are not populated with reservation call
  const { inventory_item } = useInventoryItem(
    reservation?.inventory_item?.id!,
    undefined,
    { enabled: !!reservation?.inventory_item?.id! }
  )

  if (isLoading || !reservation) {
    return (
      <TwoColumnPageSkeleton
        mainSections={1}
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
      widgetsZonePrefix="reservation.details"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      data={reservation}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="ReservationGeneralSection">
              <ReservationGeneralSection reservation={reservation} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(reservation)}
          </>
        ),
        side: (
          <>
            {inventory_item && (
              <LayoutComposer.Entry id="InventoryItemGeneralSection">
                <InventoryItemGeneralSection inventoryItem={inventory_item} />
              </LayoutComposer.Entry>
            )}
          </>
        ),
      }}
    />
  )
}
