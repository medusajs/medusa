import { Button, Container, Heading } from "@medusajs/ui"
import { ItemLocationListTable } from "./location-levels-table/location-list-table"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { HttpTypes } from "@medusajs/types"

type InventoryItemLocationLevelsSectionProps = {
  inventoryItem: HttpTypes.AdminInventoryItemResponse["inventory_item"]
}
export const InventoryItemLocationLevelsSection = ({
  inventoryItem,
}: InventoryItemLocationLevelsSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("inventory.locationLevels")}</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="locations">{t("inventory.manageLocations")}</Link>
        </Button>
      </div>
      <ItemLocationListTable inventory_item_id={inventoryItem.id} />
    </Container>
  )
}
