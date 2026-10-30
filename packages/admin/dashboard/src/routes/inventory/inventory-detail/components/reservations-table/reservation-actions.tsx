import { PencilSquare, Trash } from "@medusajs/icons"
import { toast, usePrompt } from "@medusajs/ui"

import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeleteReservationItem } from "../../../../../hooks/api/reservations"
import { useReservationItemPermissions } from "../../../../../hooks/use-resource-permissions"

export const ReservationActions = ({
  reservation,
}: {
  reservation: HttpTypes.AdminReservation
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { canUpdate, canDelete } = useReservationItemPermissions()
  const { mutateAsync } = useDeleteReservationItem(reservation.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("inventory.deleteWarning"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("inventory.reservation.deleteSuccessToast"))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  const groups: ActionGroup[] = []

  if (canUpdate) {
    groups.push({
      actions: [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          to: `/reservations/${reservation.id}/edit`,
        },
      ],
    })
  }

  if (canDelete) {
    groups.push({
      actions: [
        {
          icon: <Trash />,
          label: t("actions.delete"),
          onClick: handleDelete,
        },
      ],
    })
  }

  if (!groups.length) {
    return null
  }

  return <ActionMenu groups={groups} />
}
