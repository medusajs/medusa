import { useAdminCreateGiftCard } from "medusa-react"
import React, { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import GiftCardBalanceForm, {
  GiftCardBalanceFormType,
} from "../../components/forms/gift-card/gift-card-balance-form"
import GiftCardEndsAtForm, {
  GiftCardEndsAtFormType,
} from "../../components/forms/gift-card/gift-card-ends-at-form"
import GiftCardReceiverForm, {
  GiftCardReceiverFormType,
} from "../../components/forms/gift-card/gift-card-receiver-form"
import GiftCardRegionForm, {
  GiftCardRegionFormType,
} from "../../components/forms/gift-card/gift-card-region-form"
import Button from "../../components/fundamentals/button"
import Modal from "../../components/molecules/modal"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import { nestedForm } from "../../utils/nested-form"

type CustomGiftcardProps = {
  onClose: () => void
  open: boolean
}

type CustomGiftCardFormType = {
  region: GiftCardRegionFormType
  ends_at: GiftCardEndsAtFormType
  balance: GiftCardBalanceFormType
  receiver: GiftCardReceiverFormType
}

const CustomGiftcard: React.FC<CustomGiftcardProps> = ({ onClose, open }) => {
  const form = useForm<CustomGiftCardFormType>()
  const {
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = form

  const currencySubscriber = useWatch({
    control,
    name: "region.region_id.currency_code",
    defaultValue: "usd",
  })

  const notification = useNotification()

  const { mutate, isLoading: isSubmitting } = useAdminCreateGiftCard()

  useEffect(() => {
    if (open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        region_id: data.region.region_id.value,
        value: data.balance.amount,
        ends_at: data.ends_at.ends_at || undefined,
        metadata: {
          email: data.receiver.email,
          personal_message: data.receiver.message,
        },
      },
      {
        onSuccess: () => {
          notification(
            "Created gift card",
            "Custom gift card was created successfully",
            "success"
          )
          onClose()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  })

  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h2 className="inter-xlarge-semibold">Custom Gift Card</h2>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="gap-y-xlarge flex flex-col">
              <div>
                <h2 className="inter-base-semibold mb-base">Details</h2>
                <div className="gap-x-xsmall grid grid-cols-2">
                  <GiftCardRegionForm form={nestedForm(form, "region")} />
                  <GiftCardBalanceForm
                    form={nestedForm(form, "balance")}
                    currencyCode={currencySubscriber}
                  />
                </div>
              </div>
              <GiftCardEndsAtForm form={nestedForm(form, "ends_at")} />
              <div>
                <h2 className="inter-base-semibold mb-base">Receiver</h2>
                <GiftCardReceiverForm form={nestedForm(form, "receiver")} />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full justify-end">
              <Button
                variant="secondary"
                onClick={onClose}
                size="small"
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                size="small"
                disabled={isSubmitting || !isDirty}
                loading={isSubmitting}
              >
                Create and send
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CustomGiftcard
