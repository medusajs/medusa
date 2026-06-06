import { useTranslation } from "react-i18next"

import { Buildings } from "@zjedene-medusa/icons"
import { AdminInventoryItem } from "@zjedene-medusa/types"

import { ActionMenu } from "../../../../../components/common/action-menu"

export const InventoryActions = ({ item }: { item: AdminInventoryItem }) => {
  const { t } = useTranslation()

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <Buildings />,
              label: t("products.variant.inventory.navigateToItem"),
              to: `/inventory/${item.id}`,
            },
          ],
        },
      ]}
    />
  )
}
