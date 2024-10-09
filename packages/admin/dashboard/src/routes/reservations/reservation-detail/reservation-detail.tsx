import { useLoaderData, useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
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

  const { getWidgets } = useDashboardExtension()

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
    <TwoColumnPage
      widgets={{
        before: getWidgets("reservation.details.before"),
        after: getWidgets("reservation.details.after"),
        sideBefore: getWidgets("reservation.details.side.before"),
        sideAfter: getWidgets("reservation.details.side.after"),
      }}
      data={reservation}
      showJSON
      showMetadata
    >
      <TwoColumnPage.Main>
        <ReservationGeneralSection reservation={reservation} />
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <InventoryItemGeneralSection
          inventoryItem={reservation.inventory_item}
        />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
