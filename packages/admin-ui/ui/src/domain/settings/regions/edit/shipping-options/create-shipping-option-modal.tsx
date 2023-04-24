import { Region, Vendor } from "@medusajs/medusa"
import { useAdminCreateShippingOption } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import ShippingOptionForm, {
  ShippingOptionFormType,
} from "../../components/shipping-option-form"
import {
  getRequirementsData,
  useShippingOptionFormData,
} from "../../components/shipping-option-form/use-shipping-option-form-data"

type Props = {
  open: boolean
  onClose: () => void
  region: Region
  vendor?: Vendor
}

const CreateShippingOptionModal = ({
  open,
  onClose,
  region,
  vendor,
}: Props) => {
  const form = useForm<ShippingOptionFormType>({
    defaultValues: {
      store_option: true,
      price_type: { label: "Free Shipping", value: "free_shipping" },
    },
  })
  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  const { mutate, isLoading } = useAdminCreateShippingOption()
  const { getFulfillmentData } = useShippingOptionFormData({
    regionId: region.id,
    isReturn: false,
    vendorId: vendor?.id,
  })
  const notifcation = useNotification()

  const closeAndReset = () => {
    reset()
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    const { provider_id, data: fData } = getFulfillmentData(
      data.fulfillment_method!.value
    )

    mutate(
      {
        is_return: false,
        region_id: region.id,
        profile_id: data.shipping_profile?.value,
        name: data.name!,
        transit_time: data.transit_time?.value,
        data: fData,
        price_type:
          data.price_type?.value === "calculated" ? "calculated" : "flat_rate",
        provider_id,
        admin_only: !data.store_option,
        amount: data.price_type?.value === "flat_rate" ? data.amount! : 0,
        requirements: getRequirementsData(data),
      },
      {
        onSuccess: () => {
          notifcation("Success", "Shipping option created", "success")
          closeAndReset()
        },
        onError: (error) => {
          notifcation("Error", getErrorMessage(error), "error")
        },
      }
    )
  })

  return (
    <Modal open={open} handleClose={closeAndReset}>
      <Modal.Body>
        <Modal.Header handleClose={closeAndReset}>
          <h1 className="inter-xlarge-semibold">Add Shipping Option</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <ShippingOptionForm form={form} region={region} vendor={vendor} />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-2">
              <Button
                variant="ghost"
                size="small"
                type="button"
                onClick={closeAndReset}
              >
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

export default CreateShippingOptionModal
