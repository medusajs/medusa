import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"

import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeletePriceListAction } from "../../../common/hooks/use-delete-price-list-action"

type PriceListListTableActionsProps = {
  priceList: HttpTypes.AdminPriceList
}

export const PriceListListTableActions = ({
  priceList,
}: PriceListListTableActionsProps) => {
  const { t } = useTranslation()
  const handleDelete = useDeletePriceListAction({ priceList })

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              to: `${priceList.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              onClick: handleDelete,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}
