import {
  Address,
  AdminPostDraftOrdersReq,
  AdminPostOrdersOrderReq,
  Country,
} from "@medusajs/medusa"
import { MutateOptions } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import AddressContactForm, {
  AddressContactFormType,
} from "../../../components/forms/general/address-contact-form"
import AddressLocationForm, {
  AddressLocationFormType,
} from "../../../components/forms/general/address-location-form"
import MetadataForm, {
  getMetadataFormValues,
  getSubmittableMetadata,
  MetadataFormType,
} from "../../../components/forms/general/metadata-form"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import { AddressType } from "../../../components/templates/address-form"
import useNotification from "../../../hooks/use-notification"
import { isoAlpha2Countries } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"

type AddressPayloadType =
  | AdminPostOrdersOrderReq["shipping_address"]
  | Partial<AdminPostOrdersOrderReq["shipping_address"]>
  | AdminPostDraftOrdersReq["shipping_address"]
  | Partial<AdminPostDraftOrdersReq["shipping_address"]>

type AddressModalFormType = {
  contact: AddressContactFormType
  location: AddressLocationFormType
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
  onClose: () => void
  onSave: MutateAction
  open: boolean
  submitting?: boolean
  allowedCountries?: Country[]
  address?: Address
  type: AddressType
}

const AddressModal = ({
  address,
  allowedCountries = [],
  onClose,
  onSave,
  open,
  type,
  submitting = false,
}: AddressModalProps) => {
  const { t } = useTranslation()
  const form = useForm<AddressModalFormType>({
    defaultValues: getDefaultValues(address),
  })
  const {
    reset,
    formState: { isDirty },
    handleSubmit,
  } = form
  const notification = useNotification()

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(address))
    }
  }, [address, open, reset])

  const countryOptions = allowedCountries
    .map((c) => ({ label: c.display_name, value: c.iso_2 }))
    .filter(Boolean)

  const onSubmit = handleSubmit((data) => {
    const updateObj: TVariables = {}
    const { contact, location, metadata } = data

    const countryCode = location.country_code.value
    const metadataEntries = getSubmittableMetadata(metadata)

    if (type === "shipping") {
      // @ts-ignore
      updateObj["shipping_address"] = {
        ...contact,
        ...location,
        country_code: countryCode,
        metadata: metadataEntries,
      }
    } else {
      // @ts-ignore
      updateObj["billing_address"] = {
        ...contact,
        ...location,
        country_code: countryCode,
        metadata: metadataEntries,
      }
    }

    return onSave(updateObj, {
      onSuccess: () => {
        notification(
          t("details-success", "Success"),
          t(
            "details-successfully-updated-address",
            "Successfully updated address"
          ),
          "success"
        )
        onClose()
      },
      onError: (err) =>
        notification(
          t("details-error", "Error"),
          getErrorMessage(err),
          "error"
        ),
    })
  })

  return (
    <Modal open={open} handleClose={onClose}>
      <form onSubmit={onSubmit}>
        <Modal.Body>
          <Modal.Header handleClose={onClose}>
            <span className="inter-xlarge-semibold">
              {type === AddressType.BILLING
                ? t("details-billing-address", "Billing Address")
                : t("details-shipping-address", "Shipping Address")}
            </span>
          </Modal.Header>
          <Modal.Content>
            <div className="gap-y-xlarge flex flex-col">
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("details-contact", "Contact")}
                </h2>
                <AddressContactForm form={nestedForm(form, "contact")} />
              </div>
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("details-location", "Location")}
                </h2>
                <AddressLocationForm
                  form={nestedForm(form, "location")}
                  countryOptions={countryOptions}
                />
              </div>
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("details-metadata", "Metadata")}
                </h2>
                <MetadataForm form={nestedForm(form, "metadata")} />
              </div>
            </div>
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
                size="small"
                variant="primary"
                type="submit"
                loading={submitting}
                disabled={submitting || !isDirty}
              >
                {t("details-save-and-close", "Save and close")}
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

const getDefaultValues = (address?: Address): AddressModalFormType => {
  const countryDisplayName = address?.country_code
    ? isoAlpha2Countries[
        address.country_code.toUpperCase() as keyof typeof isoAlpha2Countries
      ]
    : ""

  return {
    contact: {
      first_name: address?.first_name || "",
      last_name: address?.last_name || "",
      phone: address?.phone || "",
      company: address?.company || null,
    },
    location: {
      address_1: address?.address_1 || "",
      address_2: address?.address_2 || null,
      city: address?.city || "",
      province: address?.province || null,
      country_code: address?.country_code
        ? { label: countryDisplayName, value: address.country_code }
        : { label: "", value: "" },
      postal_code: address?.postal_code || "",
    },
    metadata: getMetadataFormValues(address?.metadata),
  }
}

export default AddressModal
