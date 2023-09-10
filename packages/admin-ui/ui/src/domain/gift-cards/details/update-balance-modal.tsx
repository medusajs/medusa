import { GiftCard } from "@medusajs/medusa"
import { useAdminUpdateGiftCard } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import GiftCardBalanceForm, {
  GiftCardBalanceFormType,
} from "../../../components/forms/gift-card/gift-card-balance-form"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"

type UpdateBalanceModalProps = {
  open: boolean
  onClose: () => void
  giftCard: GiftCard
}

type UpdateBalanceModalFormData = {
  balance: GiftCardBalanceFormType
}

const UpdateBalanceModal = ({
  open,
  onClose,
  giftCard,
}: UpdateBalanceModalProps) => {
  const { t } = useTranslation()
  const form = useForm<UpdateBalanceModalFormData>({
    defaultValues: getDefaultValues(giftCard),
  })

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form

  const { mutate, isLoading } = useAdminUpdateGiftCard(giftCard.id)

  const notification = useNotification()

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        balance: data.balance.amount,
      },
      {
        onSuccess: () => {
          notification(
            t("details-balance-updated", "Balance updated"),
            t(
              "details-gift-card-balance-was-updated",
              "Gift card balance was updated"
            ),
            "success"
          )

          onClose()
        },
        onError: (err) => {
          notification(
            t("details-failed-to-update-balance", "Failed to update balance"),
            getErrorMessage(err),
            "error"
          )
        },
      }
    )
  })

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(giftCard))
    }
  }, [open, reset, giftCard])

  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">
            {t("details-update-balance", "Update Balance")}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <GiftCardBalanceForm
              form={nestedForm(form, "balance")}
              currencyCode={giftCard.region.currency_code}
              originalAmount={giftCard.value}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full justify-end">
              <Button
                variant="secondary"
                size="small"
                onClick={onClose}
                type="button"
              >
                {t("details-cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                loading={isLoading}
                disabled={isLoading || !isDirty}
              >
                {t("details-save-and-close", "Save and close")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (giftCard: GiftCard): UpdateBalanceModalFormData => {
  return {
    balance: {
      amount: giftCard.balance,
    },
  }
}

export default UpdateBalanceModal
