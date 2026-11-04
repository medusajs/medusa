import { PencilSquare, Trash } from "@medusajs/icons"

import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeleteReservationItem } from "../../../../../hooks/api/reservations"
import { usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ExtendedReservationItem } from "../../../../inventory/inventory-detail/components/reservations-table/use-reservation-list-table-columns"
import { useReservationItemPermissions } from "../../../../../hooks/use-resource-permissions"

export const ReservationActions = ({
  reservation,
}: {
  reservation: ExtendedReservationItem
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { canUpdate, canDelete } = useReservationItemPermissions()
  const { mutateAsync } = useDeleteReservationItem(reservation.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("reservations.deleteWarning"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          label: t("actions.edit"),
          to: `${reservation.id}/edit`,
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
