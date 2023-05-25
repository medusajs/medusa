import { useAdminDeleteDiscount, useAdminDiscount } from "medusa-react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import RawJSON from "../../../components/organisms/raw-json"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { DiscountFormProvider } from "../new/discount-form/form/discount-form-context"
import DiscountDetailsConditions from "./conditions"
import Configurations from "./configurations"
import General from "./general"

const Edit = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const { discount, isLoading } = useAdminDiscount(
    id!,
    { expand: "rule,rule.conditions" },
    {
      enabled: !!id,
    }
  )
  const [showDelete, setShowDelete] = useState(false)
  const deleteDiscount = useAdminDeleteDiscount(id!)
  const notification = useNotification()

  const handleDelete = () => {
    deleteDiscount.mutate(undefined, {
      onSuccess: () => {
        notification(t("Success"), t("Discount deleted"), "success")
      },
      onError: (error) => {
        notification(t("Error"), getErrorMessage(error), "error")
      },
    })
  }

  return (
    <div className="pb-xlarge">
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          onDelete={async () => handleDelete()}
          successText={t("Discount deleted")}
          confirmText={t("Yes, delete")}
          text={t("Are you sure you want to delete this discount?")}
          heading={t("Delete discount")}
        />
      )}

      <BackButton
        label={t("Back to Discounts")}
        path="/a/discounts"
        className="mb-xsmall"
      />
      {isLoading || !discount ? (
        <div className="flex h-full items-center justify-center">
          <Spinner variant="secondary" />
        </div>
      ) : (
        <div className="gap-y-xsmall flex flex-col">
          <DiscountFormProvider>
            <General discount={discount} />
            <Configurations discount={discount} />
            <DiscountDetailsConditions discount={discount} />
            <RawJSON data={discount} title={t("Raw discount")} />
          </DiscountFormProvider>
        </div>
      )}
    </div>
  )
}

export default Edit
