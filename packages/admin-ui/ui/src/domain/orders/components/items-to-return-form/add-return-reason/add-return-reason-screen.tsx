import { useAdminReturnReasons } from "medusa-react"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ReturnReasonDetails } from ".."
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { useLayeredModal } from "../../../../../components/molecules/modal/layered-modal"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import TextArea from "../../../../../components/molecules/textarea"

type Props = {
  reasonDetails: ReturnReasonDetails
  addReasonDetails: (index: number, details: ReturnReasonDetails) => void
  index: number
  isClaim?: boolean
}

const claimReturnReasons = [
  {
    label: "Missing Item",
    value: "missing_item",
  },
  {
    label: "Wrong Item",
    value: "wrong_item",
  },
  {
    label: "Production Failure",
    value: "production_failure",
  },
  {
    label: "Other",
    value: "other",
  },
]

const AddReasonScreen = ({
  reasonDetails,
  index,
  isClaim = false,
  addReasonDetails,
}: Props) => {
  const { t } = useTranslation()
  const { return_reasons } = useAdminReturnReasons()
  const returnReasonOptions = useMemo(() => {
    if (isClaim) {
      return claimReturnReasons
    }

    return (
      return_reasons?.map((reason) => ({
        label: reason.label,
        value: reason.id,
      })) || []
    )
  }, [return_reasons, isClaim])

  const {
    control,
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ReturnReasonDetails>({
    defaultValues: reasonDetails,
  })

  const { pop } = useLayeredModal()

  const onSubmit = handleSubmit((data) => {
    addReasonDetails(index, data)
    pop()
  })

  return (
    <>
      <Modal.Content>
        <div className="gap-y-base flex flex-col">
          <h2 className="inter-base-semibold">
            {t("add-return-reason-reason-for-return", "Reason for Return")}
          </h2>
          <Controller
            control={control}
            name="reason"
            render={({ field }) => {
              return (
                <NextSelect
                  label={t("add-return-reason-reason", "Reason")}
                  placeholder={t(
                    "add-return-reason-choose-a-return-reason",
                    "Choose a return reason"
                  )}
                  {...field}
                  options={returnReasonOptions}
                  isClearable
                />
              )
            }}
          />
          <TextArea
            label={t("add-return-reason-note", "Note")}
            placeholder={t(
              "add-return-reason-product-was-damaged-during-shipping",
              "Product was damaged during shipping"
            )}
            {...register("note")}
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="gap-x-xsmall flex w-full items-center justify-end">
          <Button size="small" variant="secondary" onClick={pop} type="button">
            {t("add-return-reason-cancel", "Cancel")}
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSubmit}
            disabled={!isDirty}
            type="button"
          >
            {t("add-return-reason-save-and-go-back", "Save and go back")}
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export const useAddReasonScreen = () => {
  const { pop, push } = useLayeredModal()
  const { t } = useTranslation()

  const pushScreen = (props: Props) => {
    push({
      title: t("add-return-reason-select-reason-title", "Select Reason"),
      onBack: () => pop(),
      view: <AddReasonScreen {...props} />,
    })
  }

  return { pushScreen }
}
