import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { InventoryItemGeneralSection } from "../../inventory/inventory-detail/components/inventory-item-general-section"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { ReservationGeneralSection } from "./components/reservation-general-section"
import { reservationItemLoader } from "./loader"
import { useReservationItem } from "../../../hooks/api/reservations"

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
      <div className="flex flex-col gap-x-4 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-y-2">
          <ReservationGeneralSection reservation={reservation} />
          <div className="hidden lg:block">
            <JsonViewSection data={reservation} />
          </div>
        </div>
        <div className="mt-2 flex w-full max-w-[100%] flex-col gap-y-2 lg:mt-0 lg:max-w-[400px]">
          <InventoryItemGeneralSection
            inventoryItem={reservation.inventory_item}
          />
          <div className="lg:hidden">
            <JsonViewSection data={reservation} />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
