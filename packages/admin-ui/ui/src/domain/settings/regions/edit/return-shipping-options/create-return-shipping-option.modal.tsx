import { Region } from "@medusajs/medusa"
import { useAdminCreateShippingOption } from "medusa-react"
import { useForm } from "react-hook-form"
import { getSubmittableMetadata } from "../../../../../components/forms/general/metadata-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import ShippingOptionForm, {
  ShippingOptionFormType,
} from "../../components/shipping-option-form"
import { useShippingOptionFormData } from "../../components/shipping-option-form/use-shipping-option-form-data"

type Props = {
  open: boolean
  onClose: () => void
  region: Region
}

const CreateReturnShippingOptionModal = ({ open, onClose, region }: Props) => {
  const form = useForm<ShippingOptionFormType>()
  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form
  const { mutate, isLoading } = useAdminCreateShippingOption()
  const { getFulfillmentData, getRequirementsData } = useShippingOptionFormData(
    region.id
  )
  const notifcation = useNotification()

  const closeAndReset = () => {
    reset()
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    const { provider_id, data: fData } = getFulfillmentData(
      data.fulfillment_provider!.value
    )

    mutate(
      {
        is_return: true,
        region_id: region.id,
        name: data.name!,
        profile_id: data.shipping_profile?.value,
        data: fData,
        price_type: "flat_rate",
        provider_id,
        admin_only: !data.store_option,
        amount: data.amount!,
        requirements: getRequirementsData(data),
        metadata: getSubmittableMetadata(data.metadata),
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
          <h1 className="inter-xlarge-semibold">Add Return Shipping Option</h1>
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

export default CreateReturnShippingOptionModal
