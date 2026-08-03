import { PencilSquare, Trash } from "@medusajs/icons"
import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { ActionMenu } from "../../../components/common/action-menu"
import { stockLocationsQueryKeys } from "../../../hooks/api/stock-locations"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

export const LocationListTableActions = ({
  location,
}: {
  location: HttpTypes.AdminStockLocation
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const handleDelete = async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("stockLocations.delete.confirmation", {
        name: location.name,
      }),
      confirmText: t("actions.remove"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    try {
      await sdk.admin.stockLocation.delete(location.id)
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: stockLocationsQueryKeys.detail(location.id),
      })
      toast.success(
        t("stockLocations.delete.successToast", { name: location.name })
      )
    } catch (e) {
      toast.error((e as FetchError).message)
    }
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              onClick: () =>
                navigate(`/settings/locations/${location.id}/edit`),
            },
          ],
        },
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}
