import { Controller } from "react-hook-form"
import { NestedForm } from "../../../utils/nested-form"
import { RadioGroup } from "../../organisms"

export type ClaimTypeFormType = {
  type: "replace" | "refund"
}

type Props = {
  form: NestedForm<ClaimTypeFormType>
}

export const ClaimTypeForm = ({ form }: Props) => {
  const { control, path } = form

  return (
    <div>
      <Controller
        name={path("type")}
        control={control}
        render={({ field: { value, onChange } }) => {
          return (
            <RadioGroup.Root
              value={value}
              onValueChange={onChange}
              className="flex items-center"
            >
              <RadioGroup.SimpleItem
                label="Refund"
                value="refund"
                onChange={onChange}
              />
              <RadioGroup.SimpleItem
                label="Replace"
                value="replace"
                onChange={onChange}
              />
            </RadioGroup.Root>
          )
        }}
      />
    </div>
  )
}
