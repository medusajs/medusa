import { Container, Heading } from "@medusajs/ui"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { InventoryTypes } from "@medusajs/types"
import { PencilSquare } from "@medusajs/icons"
import { SectionRow } from "../../../../../components/common/section"
import { getFormattedCountry } from "../../../../../lib/addresses"
import { useTranslation } from "react-i18next"

type InventoryItemAttributeSectionProps = {
  inventoryItem: InventoryTypes.InventoryItemDTO
}

export const InventoryItemAttributeSection = ({
  inventoryItem,
}: InventoryItemAttributeSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.attributes")}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "attributes",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      <SectionRow title={t("fields.height")} value={inventoryItem.height} />
      <SectionRow title={t("fields.width")} value={inventoryItem.width} />
      <SectionRow title={t("fields.length")} value={inventoryItem.length} />
      <SectionRow title={t("fields.weight")} value={inventoryItem.weight} />
      <SectionRow title={t("fields.midCode")} value={inventoryItem.mid_code} />
      <SectionRow title={t("fields.hsCode")} value={inventoryItem.hs_code} />
      <SectionRow
        title={t("fields.countryOfOrigin")}
        value={getFormattedCountry(inventoryItem.origin_country)}
      />
    </Container>
  )
}
