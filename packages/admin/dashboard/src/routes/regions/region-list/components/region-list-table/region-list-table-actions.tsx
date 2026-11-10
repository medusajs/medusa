import { PencilSquare, Trash } from "@medusajs/icons"
import type { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { useDeleteRegion } from "../../../../../hooks/api/regions"
import { useRegionPermissions } from "../../../../../exports/hooks"

export const RegionListTableActions = ({
  region,
}: {
  region: HttpTypes.AdminRegion
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { canUpdate, canDelete } = useRegionPermissions()

  const { mutateAsync } = useDeleteRegion(region.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("regions.deleteRegionWarning", {
        name: region.name,
      }),
      verificationText: region.name,
      verificationInstruction: t("general.typeToConfirm"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("regions.toast.delete"))
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
          label: t("actions.edit"),
          to: `/settings/regions/${region.id}/edit`,
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
