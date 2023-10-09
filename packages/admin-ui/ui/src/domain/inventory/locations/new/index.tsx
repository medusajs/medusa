import { AdminPostStockLocationsReq, SalesChannel } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import GeneralForm, { GeneralFormType } from "../components/general-form"
import MetadataForm, {
  MetadataFormType,
  getSubmittableMetadata,
} from "../../../../components/forms/general/metadata-form"
import {
  StockLocationAddressDTO,
  StockLocationAddressInput,
} from "@medusajs/types"
import {
  useAdminAddLocationToSalesChannel,
  useAdminCreateStockLocation,
} from "medusa-react"

import Accordion from "../../../../components/organisms/accordion"
import AddressForm from "../components/address-form"
import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import DeletePrompt from "../../../../components/organisms/delete-prompt"
import FocusModal from "../../../../components/molecules/modal/focus-modal"
import React from "react"
import SalesChannelsForm from "../components/sales-channels-form"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import { useFeatureFlag } from "../../../../providers/feature-flag-provider"
import { useForm } from "react-hook-form"
import useNotification from "../../../../hooks/use-notification"
import useToggleState from "../../../../hooks/use-toggle-state"

type NewLocationForm = {
  general: GeneralFormType
  address: StockLocationAddressDTO
  metadata: MetadataFormType
  salesChannels: {
    channels: Omit<SalesChannel, "locations">[]
  }
}

const NewLocation = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation()
  const [accordionValue, setAccordionValue] = React.useState("general")
  const form = useForm<NewLocationForm>({
    defaultValues: {
      general: {
        name: "",
      },
      address: undefined,
      salesChannels: {
        channels: [],
      },
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
  })
  const {
    handleSubmit,
    formState: { isDirty },
  } = form

  const {
    state: isShowingClosePrompt,
    open: showClosePrompt,
    close: closeClosePrompt,
  } = useToggleState()

  const notification = useNotification()
  const { isFeatureEnabled } = useFeatureFlag()

  const { mutateAsync: createStockLocation } = useAdminCreateStockLocation()
  const { mutateAsync: associateSalesChannel } =
    useAdminAddLocationToSalesChannel()

  const createSalesChannelAssociationPromise = (
    salesChannelId: string,
    locationId: string
  ) =>
    associateSalesChannel({
      sales_channel_id: salesChannelId,
      location_id: locationId,
    })

  const handleClose = () => {
    if (!isDirty) {
      onClose()
    } else {
      showClosePrompt()
    }
  }

  const onSubmit = async (data) => {
    if (!data.general.name) {
      setAccordionValue("general")
      return
    }

    const addressFields = [data.address.address_1, data.address.country_code]
    if (addressFields.some(Boolean) && !addressFields.every(Boolean)) {
      setAccordionValue("general")
      return
    }

    const { locationPayload, salesChannelsPayload } = createPayload(data)
    try {
      const { stock_location } = await createStockLocation(locationPayload)
      Promise.all(
        salesChannelsPayload.map((salesChannel) =>
          createSalesChannelAssociationPromise(
            salesChannel.id,
            stock_location.id
          )
        )
      )
        .then(() => {
          notification(
            t("new-success", "Success"),
            t("new-location-added-successfully", "Location added successfully"),
            "success"
          )
        })
        .catch(() => {
          notification(
            t("new-error", "Error"),
            t(
              "new-location-created",
              "Location was created successfully, but there was an error associating sales channels"
            ),
            "error"
          )
        })
        .finally(() => {
          onClose()
        })
    } catch (err) {
      notification(t("new-error", "Error"), getErrorMessage(err), "error")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <FocusModal>
        <FocusModal.Header>
          <div className="medium:w-8/12 flex w-full justify-between px-8">
            <Button
              size="small"
              variant="ghost"
              type="button"
              onClick={handleClose}
            >
              <CrossIcon size={20} />
            </Button>
            {isShowingClosePrompt && (
              <DeletePrompt
                heading={t(
                  "new-cancel-location-changes",
                  "Are you sure you want to cancel with unsaved changes"
                )}
                confirmText={t("new-yes-cancel", "Yes, cancel")}
                cancelText={t(
                  "new-no-continue-creating",
                  "No, continue creating"
                )}
                successText={false}
                handleClose={closeClosePrompt}
                onDelete={async () => onClose()}
              />
            )}
            <div className="gap-x-small flex">
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
              >
                {t("new-add-location", "Add location")}
              </Button>
            </div>
          </div>
        </FocusModal.Header>
        <FocusModal.Main className="no-scrollbar flex w-full justify-center">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 my-16 max-w-[700px]">
            <h1 className="mb-base text-grey-90 text-xlarge px-1 font-semibold">
              {t("new-add-new-location", "Add new location")}
            </h1>
            <Accordion
              value={accordionValue}
              onValueChange={setAccordionValue}
              type="single"
            >
              <Accordion.Item
                value={"general"}
                title={t("new-general-information", "General Information")}
                required
              >
                <p className="inter-base-regular text-grey-50">
                  {t(
                    "new-location-details",
                    "Specify the details about this location"
                  )}
                </p>
                <div className="mt-xlarge gap-y-xlarge flex flex-col pb-0.5">
                  <GeneralForm form={nestedForm(form, "general")} />
                  <AddressForm form={nestedForm(form, "address")} />
                  <div>
                    <h2 className="inter-base-semibold mb-base">
                      {t("new-metadata", "Metadata")}
                    </h2>
                    <MetadataForm form={nestedForm(form, "metadata")} />
                  </div>
                </div>
              </Accordion.Item>
              {isFeatureEnabled("sales_channels") && (
                <Accordion.Item
                  value={"sales_channels"}
                  title={"Sales Channels"}
                >
                  <p className="inter-base-regular text-grey-50">
                    {t(
                      "new-select-location-channel",
                      "Specify which Sales Channels this location's items can be purchased through."
                    )}
                  </p>
                  <div className="mt-xlarge flex">
                    <SalesChannelsForm
                      location={null}
                      form={nestedForm(form, "salesChannels")}
                    />
                  </div>
                </Accordion.Item>
              )}
            </Accordion>
          </div>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

const createPayload = (
  data
): {
  locationPayload: AdminPostStockLocationsReq
  salesChannelsPayload: SalesChannel[]
} => {
  const { general, address, metadata } = data

  let addressInput
  if (address.address_1) {
    addressInput = address as StockLocationAddressInput
    addressInput.country_code = address.country_code.value
  }
  return {
    locationPayload: {
      name: general.name,
      address: addressInput,
      metadata: getSubmittableMetadata(metadata),
    },
    salesChannelsPayload: data.salesChannels.channels,
  }
}

export default NewLocation
