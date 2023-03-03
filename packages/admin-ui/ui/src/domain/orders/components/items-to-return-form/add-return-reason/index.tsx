import { Row } from "@tanstack/react-table"
import { Controller, useWatch } from "react-hook-form"
import {
  ItemsToReturnFormType,
  ReturnItemObject,
  ReturnReasonDetails,
} from ".."
import InputError from "../../../../../components/atoms/input-error"
import Button from "../../../../../components/fundamentals/button"
import { NestedForm } from "../../../../../utils/nested-form"
import { useAddReasonScreen } from "./add-return-reason-screen"

type Props = {
  row: Row<ReturnItemObject>
  form: NestedForm<ItemsToReturnFormType>
  isClaim?: boolean
}

const AddReturnReason = ({ row, form, isClaim = false }: Props) => {
  const {
    control,
    path,
    setValue,
    clearErrors,
    formState: { errors },
  } = form

  const { pushScreen } = useAddReasonScreen()

  const reasonDetails = useWatch({
    control,
    name: path(`items.${row.index}.return_reason_details`),
  })

  const addReasonDetails = (index: number, details: ReturnReasonDetails) => {
    setValue(path(`items.${index}.return_reason_details`), details)

    if (details.reason) {
      clearErrors(path(`items.${index}.return_reason_details`))
    }
  }

  return (
    <div className="grid w-full grid-cols-[74px,1fr,1fr] pb-small">
      <span />
      <div className="flex items-center">
        <p className="inter-small-semibold">{reasonDetails?.reason?.label}</p>
      </div>
      <div className="flex justify-end">
        <div className="flex flex-col items-end">
          <Controller
            control={control}
            name={path(`items.${row.index}.return_reason_details`)}
            render={({ field: { ref }, fieldState: { error } }) => {
              return (
                <Button
                  ref={ref}
                  variant={error ? "danger" : "secondary"}
                  size="small"
                  type="button"
                  className="max-w-[120px]"
                  onClick={() =>
                    pushScreen({
                      reasonDetails,
                      index: row.index,
                      isClaim,
                      addReasonDetails,
                    })
                  }
                >
                  <span>
                    {reasonDetails?.reason ? "Edit" : "Select"} reason
                  </span>
                </Button>
              )
            }}
          />
          {!reasonDetails?.reason && (
            <InputError
              errors={errors}
              name={path(`items.${row.index}.return_reason_details`)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AddReturnReason
