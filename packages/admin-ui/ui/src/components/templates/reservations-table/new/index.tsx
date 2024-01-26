import { useTranslation } from "react-i18next"
import MetadataForm, {
  MetadataFormType,
  getSubmittableMetadata,
} from "../../../forms/general/metadata-form"
import ReservationForm, {
  GeneralFormType,
} from "../components/reservation-form"

import { AdminPostReservationsReq } from "@medusajs/medusa"
import Button from "../../../fundamentals/button"
import CrossIcon from "../../../fundamentals/icons/cross-icon"
import FocusModal from "../../../molecules/modal/focus-modal"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import { useAdminCreateReservation } from "medusa-react"
import { useForm } from "react-hook-form"
import useNotification from "../../../../hooks/use-notification"

type NewReservationFormType = {
  general: GeneralFormType
  metadata: MetadataFormType
}

const NewReservation = ({
  onClose,
  locationId,
}: {
  onClose: () => void
  locationId?: string
}) => {
  const { t } = useTranslation()
  const { mutateAsync: createReservation } = useAdminCreateReservation()
  const form = useForm<NewReservationFormType>({
    defaultValues: {
      general: {
        location: locationId,
        item: undefined,
        description: undefined,
        quantity: 0,
      },
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
  })

  const { handleSubmit } = form

  const notification = useNotification()

  const onSubmit = async (data: NewReservationFormType) => {
    const payload = await createPayload(data)

    createReservation(payload, {
      onSuccess: () => {
        notification(
          t("new-success", "Success"),
          t(
            "new-successfully-created-reservation",
            "Successfully created reservation"
          ),
          "success"
        )
        onClose()
      },
      onError: (err: Error) => {
        notification(t("new-error", "Error"), getErrorMessage(err), "error")
      },
    })
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
              onClick={onClose}
            >
              <CrossIcon size={20} />
            </Button>
            <div className="gap-x-small flex">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onClose}
              >
                {t("new-cancel", "Cancel")}
              </Button>
              <Button size="small" variant="primary" type="submit">
                {t("new-save-reservation", "Save reservation")}
              </Button>
            </div>
          </div>
        </FocusModal.Header>
        <FocusModal.Main className="no-scrollbar flex w-full justify-center">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 my-16 max-w-[700px]">
            <h1 className="mb-base text-grey-90 text-xlarge font-semibold">
              {t("new-reserve-item", "Reserve Item")}
            </h1>
            <div className="mt-xlarge gap-y-xlarge flex w-full pb-0.5">
              <ReservationForm form={nestedForm(form, "general")} />
            </div>
            <div className="border-grey border-grey-20 w-full items-center border-t pt-6">
              <p className="inter-base-semibold mb-2">
                {t("new-metadata", "Metadata")}
              </p>
              <MetadataForm form={nestedForm(form, "metadata")} />
            </div>
          </div>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

const createPayload = (
  data: NewReservationFormType
): AdminPostReservationsReq => {
  return {
    location_id: data.general.location!,
    inventory_item_id: data.general.item!.id!,
    quantity: data.general.quantity,
    description: data.general.description,
    metadata: getSubmittableMetadata(data.metadata),
  }
}

export default NewReservation
