import Button from "../../../fundamentals/button"
import CrossIcon from "../../../fundamentals/icons/cross-icon"
import FocusModal from "../../../molecules/modal/focus-modal"
import { useForm } from "react-hook-form"
import ReservationForm, {
  GeneralFormType,
} from "../components/reservation-form"
import { MetadataFormType } from "../../../forms/general/metadata-form"
import { nestedForm } from "../../../../utils/nested-form"
import { useAdminCreateReservation } from "medusa-react"
import { AdminPostReservationsReq } from "@medusajs/medusa"

type NewReservationFormType = {
  general: GeneralFormType
  metadata: MetadataFormType
}

const NewReservation = ({ onClose }: { onClose: () => void }) => {
  const { mutateAsync: createReservation } = useAdminCreateReservation()
  const form = useForm<NewReservationFormType>({
    defaultValues: {
      general: {
        location: undefined,
        item: undefined,
        description: undefined,
      },
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
  })

  const { handleSubmit, formState } = form

  const onSubmit = async (data) => {
    const payload = await createPayload(data)
    console.log({ payload })
    // const {reservation} = await createReservation(payload)
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
              <Button size="small" variant="secondary">
                Cancel
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                // disabled={!isDirty}
              >
                Save reservation
              </Button>
            </div>
          </div>
        </FocusModal.Header>
        <FocusModal.Main className="no-scrollbar flex w-full justify-center">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 my-16 max-w-[700px]">
            <h1 className="mb-base text-grey-90 text-xlarge font-semibold">
              Reserve Item
            </h1>
            <div className="mt-xlarge gap-y-xlarge flex w-full pb-0.5">
              <ReservationForm form={nestedForm(form, "general")} />
            </div>
          </div>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

const createPayload = (data): AdminPostReservationsReq => {
  return {
    location_id: "1234",
    inventory_item_id: "asdf",
    quantity: 1,
  }
}

export default NewReservation
