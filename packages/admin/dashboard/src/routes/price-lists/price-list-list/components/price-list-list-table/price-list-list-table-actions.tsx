import { PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"

import { useTranslation } from "react-i18next"
import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { usePriceListPermissions } from "../../../../../hooks/use-resource-permissions"
import { useDeletePriceListAction } from "../../../common/hooks/use-delete-price-list-action"

type PriceListListTableActionsProps = {
  priceList: HttpTypes.AdminPriceList
}

export const PriceListListTableActions = ({
  priceList,
}: PriceListListTableActionsProps) => {
  const { t } = useTranslation()
  const { canUpdate, canDelete } = usePriceListPermissions()
  const handleDelete = useDeletePriceListAction({ priceList })

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          label: t("actions.edit"),
          to: `${priceList.id}/edit`,
          icon: <PencilSquare />,
        },
      ],
    })
  }

  if (canDelete) {
    groups.push({
      actions: [
        {
          label: t("actions.delete"),
          onClick: handleDelete,
          icon: <Trash />,
        },
      ],
    })
  }

  if (!groups.length) {
    return null
  }

  return <ActionMenu groups={groups} />
}
