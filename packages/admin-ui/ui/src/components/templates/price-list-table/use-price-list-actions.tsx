import { useAdminDeletePriceList, useAdminUpdatePriceList } from "medusa-react"
import { useTranslation } from "react-i18next"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import { ActionType } from "../../molecules/actionables"
import { isActive } from "./utils"
import PublishIcon from "../../fundamentals/icons/publish-icon"

const usePriceListActions = (priceList) => {
  const { t } = useTranslation()
  const dialog = useImperativeDialog()
  const notification = useNotification()
  const updatePrice = useAdminUpdatePriceList(priceList?.id)
  const deletePrice = useAdminDeletePriceList(priceList?.id)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: t("Delete Price List"),
      text: t("Are you sure you want to delete this price list?"),
    })
    if (shouldDelete) {
      deletePrice.mutate(undefined, {
        onSuccess: () => {
          notification(
            t("Success"),
            t("Successfully deleted the price list"),
            "success"
          )
        },
        onError: (err) =>
          notification(t("Error"), getErrorMessage(err), "error"),
      })
    }
  }

  const onUpdate = () => {
    updatePrice.mutate(
      {
        status: isActive(priceList) ? "draft" : "active",
      },
      {
        onSuccess: () => {
          notification(
            t("Success"),
            isActive(priceList)
              ? t("Successfully unpublished price list")
              : t("Successfully published price list"),
            "success"
          )
        },
      }
    )
  }

  const getActions = (): ActionType[] => [
    {
      label: isActive(priceList) ? t("Unpublish") : t("Publish"),
      onClick: onUpdate,
      icon: isActive(priceList) ? (
        <UnpublishIcon size={20} />
      ) : (
        <PublishIcon size={20} />
      ),
    },
    {
      label: t("Delete"),
      onClick: onDelete,
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ]

  return {
    getActions,
  }
}

export default usePriceListActions
