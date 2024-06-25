import { Button, Container, Heading } from "@medusajs/ui"

import { InventoryItemRes } from "../../../../types/api-responses"
import { Link } from "react-router-dom"
import { ReservationItemTable } from "./reservations-table/reservation-list-table"
import { useTranslation } from "react-i18next"

type InventoryItemLocationLevelsSectionProps = {
  inventoryItem: InventoryItemRes["inventory_item"]
}
export const InventoryItemReservationsSection = ({
  inventoryItem,
}: InventoryItemLocationLevelsSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("reservations.domain")}</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to={`/reservations/create?item_id=${inventoryItem.id}`}>
            {t("actions.create")}
          </Link>
        </Button>
      </div>
      <ReservationItemTable inventoryItem={inventoryItem} />
    </Container>
  )
}
