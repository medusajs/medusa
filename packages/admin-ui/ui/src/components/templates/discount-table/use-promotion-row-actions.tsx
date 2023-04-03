import { useAdminDeleteDiscount, useAdminUpdateDiscount } from "medusa-react"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import PublishIcon from "../../fundamentals/icons/publish-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import EditIcon from "../../fundamentals/icons/edit-icon"
import useCopyPromotion from "./use-copy-promotion"
import { useNavigate } from "react-router-dom"

const usePromotionActions = (promotion) => {
  const navigate = useNavigate()
  const notification = useNotification()
  const dialog = useImperativeDialog()

  const copyPromotion = useCopyPromotion()

  const updatePromotion = useAdminUpdateDiscount(promotion.id)
  const deletePromotion = useAdminDeleteDiscount(promotion?.id)

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Discount",
      text: "Are you sure you want to delete this Discount?",
    })

    if (shouldDelete) {
      deletePromotion.mutate()
    }
  }

  const getRowActions = () => {
    return [
      {
        label: "Edit",
        icon: <EditIcon size={20} />,
        onClick: () => navigate(`/a/discounts/${promotion.id}`),
      },
      {
        label: promotion.is_disabled ? "Publish" : "Unpublish",
        icon: promotion.is_disabled ? (
          <PublishIcon size={20} />
        ) : (
          <UnpublishIcon size={20} />
        ),
        onClick: () => {
          updatePromotion.mutate(
            {
              is_disabled: !promotion.is_disabled,
            },
            {
              onSuccess: () => {
                notification(
                  "Success",
                  `Successfully ${
                    promotion.is_disabled ? "published" : "unpublished"
                  } discount`,
                  "success"
                )
              },
              onError: (err) =>
                notification("Error", getErrorMessage(err), "error"),
            }
          )
        },
      },
      {
        label: "Duplicate",
        icon: <DuplicateIcon size={20} />,
        onClick: () => copyPromotion(promotion),
      },
      {
        label: "Delete",
        icon: <TrashIcon size={20} />,
        variant: "danger",
        onClick: handleDelete,
      },
    ]
  }

  return { getRowActions }
}

export default usePromotionActions
