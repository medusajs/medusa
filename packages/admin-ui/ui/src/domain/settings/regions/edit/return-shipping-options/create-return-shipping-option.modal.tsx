import { Region } from "@medusajs/medusa"
import { useAdminCreateShippingOption } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import ShippingOptionForm, {
  ShippingOptionFormType,
} from "../../components/shipping-option-form"
import { useShippingOptionFormData } from "../../components/shipping-option-form/use-shipping-option-form-data"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"

type Props = {
  open: boolean
  onClose: () => void
  region: Region
}

const CreateReturnShippingOptionModal = ({ open, onClose, region }: Props) => {
  const { t } = useTranslation()
  const form = useForm<ShippingOptionFormType>()
  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form
  const { mutate, isLoading } = useAdminCreateShippingOption()
  const { getShippingOptionData } = useShippingOptionFormData(region.id)
  const notifcation = useNotification()
  const { isFeatureEnabled } = useFeatureFlag()

  const closeAndReset = () => {
    reset()
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    const { payload } = getShippingOptionData(data, region, true)

    if (isFeatureEnabled("tax_inclusive_pricing")) {
      payload.includes_tax = region.includes_tax
    }

    mutate(payload, {
      onSuccess: () => {
        notifcation(
          t("return-shipping-options-success", "Success"),
          t(
            "return-shipping-options-shipping-option-created",
            "Shipping option created"
          ),
          "success"
        )
        closeAndReset()
      },
      onError: (error) => {
        notifcation(
          t("return-shipping-options-error", "Error"),
          getErrorMessage(error),
          "error"
        )
      },
    })
  })

  return (
    <Modal open={open} handleClose={closeAndReset}>
      <Modal.Body>
        <Modal.Header handleClose={closeAndReset}>
          <h1 className="inter-xlarge-semibold">
            {t(
              "return-shipping-options-add-return-shipping-option",
              "Add Return Shipping Option"
            )}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <ShippingOptionForm form={form} region={region} />
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full items-center justify-end">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={closeAndReset}
              >
                {t("return-shipping-options-cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                loading={isLoading}
                disabled={isLoading || !isDirty}
              >
                {t("return-shipping-options-save-and-close", "Save and close")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateReturnShippingOptionModal
