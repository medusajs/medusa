import {
  AdminPostStockLocationsReq,
  StockLocationAddressDTO,
  StockLocationDTO,
} from "@medusajs/medusa"
import { useAdminUpdateStockLocation } from "medusa-react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import AddressForm from "../components/address-form"
import GeneralForm, { GeneralFormType } from "../components/general-form"

type EditLocationForm = {
  general: GeneralFormType
  address: StockLocationAddressDTO
}

export type LocationEditModalProps = {
  onClose: () => void
  location: StockLocationDTO
}

const LocationEditModal = ({ onClose, location }: LocationEditModalProps) => {
  const form = useForm<EditLocationForm>({
    defaultValues: {
      general: {
        name: location.name,
      }, // @ts-ignore
      address: location.address,
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
  })
  const notification = useNotification()

  const { mutate } = useAdminUpdateStockLocation(location.id)

  const { handleSubmit, formState } = form

  const { isDirty, isValid } = formState

  const onSubmit = handleSubmit(async (data) => {
    const payload = createPayload(data)
    mutate(payload, {
      onSuccess: () => {
        onClose()
        notification("Success", "Location edited successfully", "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })
  })

  return (
    <Modal handleClose={onClose}>
      <Modal.Body className="top-20">
        <Modal.Header handleClose={onClose}>
          <h1 className="text-xl font-semibold">Edit Location Details</h1>
        </Modal.Header>
        <Modal.Content>
          <form className="w-full">
            <div className="flex flex-col mt-xlarge gap-y-xlarge">
              <GeneralForm form={nestedForm(form, "general")} />
              <AddressForm form={nestedForm(form, "address")} />
            </div>
          </form>
        </Modal.Content>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end w-full space-x-2">
          <Button
            size="small"
            variant="secondary"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="primary"
            type="button"
            disabled={!isDirty || !isValid}
            onClick={onSubmit}
          >
            Save and close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

const createPayload = (data): AdminPostStockLocationsReq => {
  const { general, address } = data

  return {
    name: general.name,
    address: {
      company: address.company,
      address_1: address.address_1,
      address_2: address.address_2,
      postal_code: address.postal_code,
      city: address.city,
      country_code: address.country_code.value || address.country_code,
    },
  }
}

export default LocationEditModal
