import { ShippingOption } from "@medusajs/medusa"
import { useAdminUpdateShippingOption } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  getMetadataFormValues,
  getSubmittableMetadata,
} from "../../../../../components/forms/general/metadata-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import ShippingOptionForm, {
  ShippingOptionFormType,
} from "../shipping-option-form"
import { useShippingOptionFormData } from "../shipping-option-form/use-shipping-option-form-data"

type Props = {
  open: boolean
  onClose: () => void
  option: ShippingOption
}

const EditModal = ({ open, onClose, option }: Props) => {
  const { t } = useTranslation()
  const form = useForm<ShippingOptionFormType>({
    defaultValues: getDefaultValues(option),
  })
  const { mutate, isLoading } = useAdminUpdateShippingOption(option.id)
  const { getRequirementsData } = useShippingOptionFormData(option.region_id)
  const notification = useNotification()

  const {
    reset,
    handleSubmit,
    formState: { isDirty },
  } = form

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(option))
    }
  }, [option, reset, open])

  const closeAndReset = () => {
    reset(getDefaultValues(option))
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        name: data.name!,
        // @ts-ignore
        requirements: getRequirementsData(data),
        admin_only: !data.store_option,
        amount: data.amount!,
        metadata: getSubmittableMetadata(data.metadata),
      },
      {
        onSuccess: () => {
          notification(
            t("shipping-option-card-success", "Success"),
            t(
              "shipping-option-card-shipping-option-updated",
              "Shipping option updated"
            ),
            "success"
          )
          closeAndReset()
        },
        onError: (error) => {
          notification(
            t("shipping-option-card-error", "Error"),
            getErrorMessage(error),
            "error"
          )
        },
      }
    )
  })

  return (
    <Modal open={open} handleClose={closeAndReset}>
      <Modal.Body>
        <Modal.Header handleClose={closeAndReset}>
          <h1 className="inter-xlarge-semibold">
            {t(
              "shipping-option-card-edit-shipping-option",
              "Edit Shipping Option"
            )}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div>
              <p className="inter-base-semibold">
                {t(
                  "shipping-option-card-fulfillment-method",
                  "Fulfillment Method"
                )}
              </p>
              <p className="inter-base-regular text-grey-50">
                {option.data.id as string} via {option.provider_id}
              </p>
            </div>
            <div className="bg-grey-20 my-xlarge h-px w-full" />
            <ShippingOptionForm
              form={form}
              region={option.region}
              isEdit={true}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full items-center justify-end">
              <Button variant="secondary" size="small" onClick={closeAndReset}>
                {t("shipping-option-card-cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                loading={isLoading}
                disabled={isLoading || !isDirty}
              >
                {t("shipping-option-card-save-and-close", "Save and close")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (option: ShippingOption): ShippingOptionFormType => {
  const minSubtotal = option.requirements.find((r) => r.type === "min_subtotal")
  const maxSubtotal = option.requirements.find((r) => r.type === "max_subtotal")

  return {
    store_option: option.admin_only ? false : true,
    name: option.name,
    price_type: {
      label:
        option.price_type === "flat_rate" ? "Flat rate" : "Calculated Price",
      value: option.price_type,
    },
    fulfillment_provider: null,
    shipping_profile: null,
    requirements: {
      min_subtotal: minSubtotal
        ? {
            amount: minSubtotal.amount,
            id: minSubtotal.id,
          }
        : null,
      max_subtotal: maxSubtotal
        ? {
            amount: maxSubtotal.amount,
            id: maxSubtotal.id,
          }
        : null,
    },
    amount: option.amount,
    metadata: getMetadataFormValues(option.metadata),
  }
}

export default EditModal
