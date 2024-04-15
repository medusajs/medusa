import {
  useInventoryItem,
  useReservationItem,
} from "../../../../../hooks/api/inventory"

import { EditReservationForm } from "./components/edit-reservation-form"
import { Heading } from "@medusajs/ui"
import { RouteDrawer } from "../../../../../components/route-modal"
import { useParams } from "react-router-dom"
import { useStockLocations } from "../../../../../hooks/api/stock-locations"
import { useTranslation } from "react-i18next"

export const ReservationEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { reservation, isLoading, isError, error } = useReservationItem(id!)
  const { inventory_item: inventoryItem } = useInventoryItem(
    reservation?.inventory_item_id!,
    {
      enabled: !!reservation,
    }
  )

  const { stock_locations } = useStockLocations(
    {
      id: inventoryItem?.location_levels?.map((l) => l.location_id),
    },
    {
      enabled: !!inventoryItem?.location_levels,
    }
  )

  const ready = !isLoading && reservation && inventoryItem && stock_locations
  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("inventory.reservation.editItemDetails")}</Heading>
      </RouteDrawer.Header>
      {ready && (
        <EditReservationForm
          locations={stock_locations}
          reservation={reservation}
          item={inventoryItem}
        />
      )}
    </RouteDrawer>
  )
}
