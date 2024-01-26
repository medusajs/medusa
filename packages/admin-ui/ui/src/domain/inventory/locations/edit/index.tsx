import {
  AdminPostStockLocationsReq,
  StockLocationAddressDTO,
  StockLocationAddressInput,
  StockLocationDTO,
} from "@medusajs/medusa"
import { useTranslation } from "react-i18next"

import GeneralForm, { GeneralFormType } from "../components/general-form"
import MetadataForm, {
  MetadataFormType,
  getMetadataFormValues,
  getSubmittableMetadata,
} from "../../../../components/forms/general/metadata-form"

import AddressForm from "../components/address-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import { useAdminUpdateStockLocation } from "medusa-react"
import { useForm } from "react-hook-form"
import useNotification from "../../../../hooks/use-notification"

type EditLocationForm = {
  general: GeneralFormType
  address: StockLocationAddressDTO
  metadata: MetadataFormType
}

export type LocationEditModalProps = {
  onClose: () => void
  location: StockLocationDTO
}

const LocationEditModal = ({ onClose, location }: LocationEditModalProps) => {
  const { t } = useTranslation()
  const form = useForm<EditLocationForm>({
    defaultValues: {
      general: {
        name: location.name,
      }, // @ts-ignore
      address: location.address,
      metadata: getMetadataFormValues(location.metadata),
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
  })
  const notification = useNotification()

  const { mutate, isLoading } = useAdminUpdateStockLocation(location.id)

  const { handleSubmit, formState } = form

  const { isDirty } = formState

  const onSubmit = handleSubmit(async (data) => {
    const payload = createPayload(data)
    mutate(payload, {
      onSuccess: () => {
        onClose()
        notification(
          t("edit-success", "Success"),
          t(
            "edit-location-edited-successfully",
            "Location edited successfully"
          ),
          "success"
        )
      },
      onError: (err) => {
        notification(t("edit-error", "Error"), getErrorMessage(err), "error")
      },
    })
  })

  return (
    <Modal handleClose={onClose}>
      <Modal.Body className="top-20">
        <Modal.Header handleClose={onClose}>
          <h1 className="text-xl font-semibold">
            {t("edit-edit-location-details", "Edit Location Details")}
          </h1>
        </Modal.Header>
        <Modal.Content>
          <form className="w-full">
            <div className="mt-xlarge gap-y-xlarge flex flex-col">
              <GeneralForm form={nestedForm(form, "general")} />
              <AddressForm form={nestedForm(form, "address")} />
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("edit-metadata", "Metadata")}
                </h2>
                <MetadataForm form={nestedForm(form, "metadata")} />
              </div>
            </div>
          </form>
        </Modal.Content>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex w-full justify-end space-x-2">
          <Button
            size="small"
            variant="secondary"
            type="button"
            onClick={onClose}
          >
            {t("edit-cancel", "Cancel")}
          </Button>
          <Button
            size="small"
            variant="primary"
            type="button"
            disabled={!isDirty || isLoading}
            onClick={onSubmit}
          >
            {t("edit-save-and-close", "Save and close")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

const createPayload = (data): AdminPostStockLocationsReq => {
  const { general, address, metadata } = data

  let addressInput
  if (address.address_1) {
    addressInput = {
      company: address.company,
      address_1: address.address_1,
      address_2: address.address_2,
      postal_code: address.postal_code,
      city: address.city,
      country_code: address.country_code?.value || address.country_code,
    } as StockLocationAddressInput
  }
  return {
    name: general.name,
    address: addressInput,
    metadata: getSubmittableMetadata(metadata),
  }
}

export default LocationEditModal
