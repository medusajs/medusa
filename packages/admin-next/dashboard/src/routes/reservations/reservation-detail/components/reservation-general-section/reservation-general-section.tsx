import { AdminReservationResponse, StockLocationDTO } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { InventoryTypes } from "@medusajs/types"
import { PencilSquare } from "@medusajs/icons"
import { SectionRow } from "../../../../../components/common/section"
import { useInventoryItem } from "../../../../../hooks/api/inventory"
import { useStockLocation } from "../../../../../hooks/api/stock-locations"
import { useTranslation } from "react-i18next"

type ReservationGeneralSectionProps = {
  reservation: AdminReservationResponse["reservation"]
}

export const ReservationGeneralSection = ({
  reservation,
}: ReservationGeneralSectionProps) => {
  const { t } = useTranslation()

  const { inventory_item: inventoryItem, isPending: isLoadingInventoryItem } =
    useInventoryItem(reservation.inventory_item_id)

  const { stock_location: location, isPending: isLoadingLocation } =
    useStockLocation(reservation.location_id)

  if (
    isLoadingInventoryItem ||
    !inventoryItem ||
    isLoadingLocation ||
    !location
  ) {
    return <div>Loading...</div>
  }

  const locationLevel = inventoryItem.location_levels!.find(
    (l: InventoryTypes.InventoryLevelDTO) =>
      l.location_id === reservation.location_id
  )

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>
          {t("inventory.reservation.header", {
            itemName: inventoryItem.title ?? inventoryItem.sku,
          })}
        </Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: `edit`,
                },
              ],
            },
          ]}
        />
      </div>
      <SectionRow
        title={t("inventory.reservation.orderID")}
        value={reservation.line_item_id} // TODO fetch order
      />
      <SectionRow
        title={t("inventory.reservation.description")}
        value={reservation.description}
      />
      <SectionRow
        title={t("inventory.reservation.location")}
        value={location?.name}
      />
      <SectionRow
        title={t("inventory.reservation.inStockAtLocation")}
        value={locationLevel?.stocked_quantity}
      />
      <SectionRow
        title={t("inventory.reservation.availableAtLocation")}
        value={locationLevel?.available_quantity}
      />
      <SectionRow
        title={t("inventory.reservation.reservedAtLocation")}
        value={locationLevel?.reserved_quantity}
      />
    </Container>
  )
}
