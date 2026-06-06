import { HttpTypes } from "@zjedene-medusa/types"
import { Button, Container, Heading } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ItemLocationListTable } from "./location-levels-table/location-list-table"

type InventoryItemLocationLevelsSectionProps = {
  inventoryItem: HttpTypes.AdminInventoryItemResponse["inventory_item"]
}
export const InventoryItemLocationLevelsSection = ({
  inventoryItem,
}: InventoryItemLocationLevelsSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("inventory.locationLevels")}</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="locations">{t("inventory.manageLocations")}</Link>
        </Button>
      </div>
      <ItemLocationListTable inventory_item_id={inventoryItem.id} />
    </Container>
  )
}
