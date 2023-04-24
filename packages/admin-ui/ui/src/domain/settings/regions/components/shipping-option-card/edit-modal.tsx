import { ShippingOption } from "@medusajs/medusa"
import { useAdminUpdateShippingOption } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { useSelectedVendor } from "../../../../../context/vendor"
import { transitTimeOptions } from "../../../../../definitions/shared"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import fulfillmentProvidersMapper from "../../../../../utils/fulfillment-providers.mapper"
import ShippingOptionForm, {
  ShippingOptionFormType,
} from "../shipping-option-form"
import { getRequirementsData } from "../shipping-option-form/use-shipping-option-form-data"

type Props = {
  open: boolean
  onClose: () => void
  option: ShippingOption
}

const EditModal = ({ open, onClose, option }: Props) => {
  const { isVendorView, selectedVendor } = useSelectedVendor()
  const form = useForm<ShippingOptionFormType>({
    defaultValues: getDefaultValues(option),
  })
  const { mutate, isLoading } = useAdminUpdateShippingOption(option.id)
  const notification = useNotification()

  const {
    reset,
    handleSubmit,
    formState: { isDirty },
  } = form

  useEffect(() => {
    reset(getDefaultValues(option))
  }, [option])

  const closeAndReset = () => {
    reset(getDefaultValues(option))
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        name: data.name!,
        // @ts-ignore
        transit_time: data.transit_time?.value,
        requirements: getRequirementsData(data),
        admin_only: !data.store_option,
        amount: data.amount!,
      },
      {
        onSuccess: () => {
          notification("Success", "Shipping option updated", "success")
          closeAndReset()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  })

  return (
    <Modal open={open} handleClose={closeAndReset}>
      <Modal.Body>
        <Modal.Header handleClose={closeAndReset}>
          <h1 className="inter-xlarge-semibold">Edit Shipping Option</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div>
              <p className="inter-base-semibold">Fulfillment Method</p>
              <p className="inter-base-regular text-grey-50">
                {option.data.name ?? option.data.id} via{" "}
                {fulfillmentProvidersMapper(option.provider_id).label}
              </p>
            </div>
            <div className="w-full h-px bg-grey-20 my-xlarge" />
            <ShippingOptionForm
              form={form}
              region={option.region}
              isEdit={true}
              vendor={isVendorView ? selectedVendor : undefined}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-2">
              <Button variant="ghost" size="small" onClick={closeAndReset}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                loading={isLoading}
                disabled={isLoading || !isDirty}
              >
                Save and close
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
  const minWeight = option.requirements.find((r) => r.type === "min_weight")
  const maxWeight = option.requirements.find((r) => r.type === "max_weight")

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
    transit_time: transitTimeOptions.find(
      (o) => o.value === option.transit_time
    ),
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
      min_weight: minWeight
        ? {
            amount: minWeight.amount,
            id: minWeight.id,
          }
        : null,
      max_weight: maxWeight
        ? {
            amount: maxWeight.amount,
            id: maxWeight.id,
          }
        : null,
    },
    amount: option.amount,
  }
}

export default EditModal
