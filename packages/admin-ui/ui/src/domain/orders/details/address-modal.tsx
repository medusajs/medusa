import {
  Address,
  AdminPostDraftOrdersReq,
  AdminPostOrdersOrderReq,
  Country,
} from "@medusajs/medusa"
import { MutateOptions } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import {
  getMetadataFormValues,
  getSubmittableMetadata,
  MetadataFormType,
} from "../../../components/forms/general/metadata-form"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import AddressForm, {
  AddressPayload,
  AddressType,
} from "../../../components/templates/address-form"
import useNotification from "../../../hooks/use-notification"
import { Option } from "../../../types/shared"
import { isoAlpha2Countries } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"

type AddressPayloadType =
  | AdminPostOrdersOrderReq["shipping_address"]
  | Partial<AdminPostOrdersOrderReq["shipping_address"]>
  | AdminPostDraftOrdersReq["shipping_address"]
  | Partial<AdminPostDraftOrdersReq["shipping_address"]>

type AddressFormType = {
  first_name: string
  last_name: string
  company: string | null
  phone: string | null
  address_1: string
  address_2: string | null
  city: string
  province: string | null
  postal_code: string
  country_code: Option
  metadata: MetadataFormType
}

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
    const { country_code, metadata: meta, ...rest } = data

    const countryCode = country_code.value
    const metadata = getSubmittableMetadata(meta)

    if (type === "shipping") {
      // @ts-ignore
      updateObj["shipping_address"] = {
        ...rest,
        country_code: countryCode,
        metadata: metadata,
      }
    } else {
      // @ts-ignore
      updateObj["billing_address"] = {
        ...rest,
        country_code: countryCode,
        metadata: metadata,
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
            <div className="gap-x-xsmall flex w-full justify-end">
              <Button
                variant="secondary"
                size="small"
                onClick={handleClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                loading={submitting}
                disabled={submitting || !isDirty}
              >
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

const mapAddressToFormData = (address?: Address): AddressPayload => {
  const countryDisplayName = address?.country_code
    ? isoAlpha2Countries[
        address.country_code.toUpperCase() as keyof typeof isoAlpha2Countries
      ]
    : ""

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
    metadata: getMetadataFormValues(address?.metadata),
  }
}

export default AddressModal
