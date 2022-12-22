import {
  Address,
  AdminPostDraftOrdersReq,
  AdminPostOrdersOrderReq,
  Country,
} from "@medusajs/medusa"
import React from "react"
import { useForm } from "react-hook-form"
import { MutateOptions } from "react-query"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import AddressForm, {
  AddressPayload,
  AddressType,
} from "../../../components/templates/address-form"
import useNotification from "../../../hooks/use-notification"
import { isoAlpha2Countries } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"

type AddressPayloadType =
  | AdminPostOrdersOrderReq["shipping_address"]
  | Partial<AdminPostOrdersOrderReq["shipping_address"]>
  | AdminPostDraftOrdersReq["shipping_address"]
  | Partial<AdminPostDraftOrdersReq["shipping_address"]>

type TVariables = {
  shipping_address?: AddressPayloadType
  billing_address?: AddressPayloadType
}

type MutateAction = <T extends TVariables>(
  variables: T,
  options?: MutateOptions<unknown, Error, unknown, unknown> | undefined
) => void

type AddressModalProps = {
  handleClose: () => void
  submit: MutateAction
  submitting?: boolean
  allowedCountries?: Country[]
  address?: Address
  type: AddressType
}

const AddressModal = ({
  address,
  allowedCountries = [],
  handleClose,
  submit,
  type,
  submitting = false,
}: AddressModalProps) => {
  const form = useForm<AddressPayload>({
    defaultValues: mapAddressToFormData(address),
  })
  const {
    formState: { isDirty },
  } = form
  const notification = useNotification()

  const countryOptions = allowedCountries
    .map((c) => ({ label: c.display_name, value: c.iso_2 }))
    .filter(Boolean)

  const handleUpdateAddress = (data: AddressPayload) => {
    const updateObj: TVariables = {}

    if (type === "shipping") {
      // @ts-ignore
      updateObj["shipping_address"] = {
        ...data,
        country_code: data.country_code.value,
      }
    } else {
      // @ts-ignore
      updateObj["billing_address"] = {
        ...data,
        country_code: data.country_code.value,
      }
    }

    return submit(updateObj, {
      onSuccess: () => {
        notification("Success", "Successfully updated address", "success")
        handleClose()
      },
      onError: (err) => notification("Error", getErrorMessage(err), "error"),
    })
  }

  return (
    <Modal handleClose={handleClose} isLargeModal>
      <form onSubmit={form.handleSubmit(handleUpdateAddress)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">
              {type === AddressType.BILLING ? "Billing" : "Shipping"} Address
            </span>
          </Modal.Header>
          <Modal.Content>
            <AddressForm
              form={nestedForm(form)}
              countryOptions={countryOptions}
              type={type}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full h-8 justify-end">
              <Button
                variant="ghost"
                className="mr-2 w-32 text-small justify-center"
                size="large"
                onClick={handleClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                size="large"
                className="w-32 text-small justify-center"
                variant="primary"
                type="submit"
                loading={submitting}
                disabled={submitting || !isDirty}
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

const mapAddressToFormData = (address?: Address): AddressPayload => {
  const countryDisplayName =
    isoAlpha2Countries[address?.country_code?.toUpperCase()]

  return {
    first_name: address?.first_name || "",
    last_name: address?.last_name || "",
    phone: address?.phone || null,
    company: address?.company || null,
    address_1: address?.address_1 || "",
    address_2: address?.address_2 || null,
    city: address?.city || "",
    province: address?.province || null,
    country_code: address?.country_code
      ? { label: countryDisplayName, value: address.country_code }
      : { label: "", value: "" },
    postal_code: address?.postal_code || "",
  }
}

export default AddressModal
