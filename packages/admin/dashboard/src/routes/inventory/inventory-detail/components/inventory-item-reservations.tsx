import { HttpTypes } from "@zjedene-medusa/types"
import { Button, Container, Heading } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ReservationItemTable } from "./reservations-table/reservation-list-table"

type InventoryItemLocationLevelsSectionProps = {
  inventoryItem: HttpTypes.AdminInventoryItemResponse["inventory_item"]
}
export const InventoryItemReservationsSection = ({
  inventoryItem,
}: InventoryItemLocationLevelsSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("reservations.domain")}</Heading>
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
