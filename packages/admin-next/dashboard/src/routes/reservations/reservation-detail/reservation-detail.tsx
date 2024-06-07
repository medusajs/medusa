import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useReservationItem } from "../../../hooks/api/reservations"
import { InventoryItemGeneralSection } from "../../inventory/inventory-detail/components/inventory-item-general-section"
import { ReservationGeneralSection } from "./components/reservation-general-section"
import { reservationItemLoader } from "./loader"

import after from "virtual:medusa/widgets/reservation/details/after"
import before from "virtual:medusa/widgets/reservation/details/before"
import sideAfter from "virtual:medusa/widgets/reservation/details/side/after"
import sideBefore from "virtual:medusa/widgets/reservation/details/side/before"

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
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={reservation} />
          </div>
        )
      })}
      <div className="flex flex-col gap-x-4 xl:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-3">
          <ReservationGeneralSection reservation={reservation} />
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={reservation} />
              </div>
            )
          })}
          <div className="hidden xl:block">
            <JsonViewSection data={reservation} />
          </div>
        </div>
        <div className="mt-2 flex w-full max-w-[100%] flex-col gap-y-2 xl:mt-0 xl:max-w-[400px]">
          {sideBefore.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={reservation} />
              </div>
            )
          })}
          <InventoryItemGeneralSection
            inventoryItem={reservation.inventory_item}
          />
          {sideAfter.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component data={reservation} />
              </div>
            )
          })}
          <div className="xl:hidden">
            <JsonViewSection data={reservation} />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
