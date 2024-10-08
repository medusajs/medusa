import { useLoaderData, useParams } from "react-router-dom"

import { useReservationItem } from "../../../hooks/api/reservations"
import { ReservationGeneralSection } from "./components/reservation-general-section"
import { reservationItemLoader } from "./loader"

import after from "virtual:medusa/widgets/reservation/details/after"
import before from "virtual:medusa/widgets/reservation/details/before"
import sideAfter from "virtual:medusa/widgets/reservation/details/side/after"
import sideBefore from "virtual:medusa/widgets/reservation/details/side/before"
import { TwoColumnPage } from "../../../components/layout/pages"
import { InventoryItemGeneralSection } from "../../inventory/inventory-detail/components/inventory-item-general-section"

export const ReservationDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof reservationItemLoader>
  >

  const { reservation, isLoading, isError, error } = useReservationItem(
    id!,
    {},
    {
      initialData,
    }
  )

  if (isLoading || !reservation) {
    return <div>Loading...</div>
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
      data={reservation}
      showJSON
      showMetadata
      hasOutlet
    >
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={reservation} />
          </div>
        )
      })}
      <TwoColumnPage.Main>
        <ReservationGeneralSection reservation={reservation} />
        {after.widgets.map((w, i) => {
          return (
            <div key={i}>
              <w.Component data={reservation} />
            </div>
          )
        })}
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <InventoryItemGeneralSection
          inventoryItem={reservation.inventory_item!}
        />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
