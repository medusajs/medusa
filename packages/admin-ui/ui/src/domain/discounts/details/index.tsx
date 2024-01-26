import { useAdminDeleteDiscount, useAdminDiscount } from "medusa-react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import WidgetContainer from "../../../components/extensions/widget-container"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import RawJSON from "../../../components/organisms/raw-json"
import useNotification from "../../../hooks/use-notification"
import { useWidgets } from "../../../providers/widget-provider"
import { getErrorMessage } from "../../../utils/error-messages"
import { getErrorStatus } from "../../../utils/get-error-status"
import { DiscountFormProvider } from "../new/discount-form/form/discount-form-context"
import DiscountDetailsConditions from "./conditions"
import Configurations from "./configurations"
import General from "./general"

const Edit = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const { discount, isLoading, error } = useAdminDiscount(
    id!,
    { expand: "rule,rule.conditions" },
    {
      enabled: !!id,
    }
  )
  const [showDelete, setShowDelete] = useState(false)
  const deleteDiscount = useAdminDeleteDiscount(id!)
  const notification = useNotification()

  const { getWidgets } = useWidgets()

  const handleDelete = () => {
    deleteDiscount.mutate(undefined, {
      onSuccess: () => {
        notification(
          t("details-success", "Success"),
          t("details-discount-deleted", "Discount deleted"),
          "success"
        )
      },
      onError: (error) => {
        notification(
          t("details-error", "Error"),
          getErrorMessage(error),
          "error"
        )
      },
    })
  }

  if (error) {
    const errorStatus = getErrorStatus(error)

    if (errorStatus) {
      // If the discount is not found, redirect to the 404 page
      if (errorStatus.status === 404) {
        navigate("/404")
        return null
      }
    }

    // Let the error boundary handle the error
    throw error
  }

  if (isLoading || !discount) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  return (
    <div className="pb-xlarge">
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          onDelete={async () => handleDelete()}
          successText={t("details-discount-deleted", "Discount deleted")}
          confirmText={t("details-yes-delete", "Yes, delete")}
          text={t(
            "details-confirm-delete-discount",
            "Are you sure you want to delete this discount?"
          )}
          heading={t("details-delete-discount", "Delete discount")}
        />
      )}

      <BackButton
        label={t("details-back-to-discounts", "Back to Discounts")}
        path="/a/discounts"
        className="mb-xsmall"
      />
      <div className="gap-y-xsmall flex flex-col">
        <DiscountFormProvider>
          {getWidgets("discount.details.before").map((w, index) => {
            return (
              <WidgetContainer
                key={index}
                entity={discount}
                widget={w}
                injectionZone="discount.details.before"
              />
            )
          })}
          <General discount={discount} />
          <Configurations discount={discount} />
          <DiscountDetailsConditions discount={discount} />
          {getWidgets("discount.details.after").map((w, index) => {
            return (
              <WidgetContainer
                key={index}
                entity={discount}
                widget={w}
                injectionZone="discount.details.after"
              />
            )
          })}
          <RawJSON
            data={discount}
            title={t("details-raw-discount", "Raw discount")}
          />
        </DiscountFormProvider>
      </div>
    </div>
  )
}

export default Edit
