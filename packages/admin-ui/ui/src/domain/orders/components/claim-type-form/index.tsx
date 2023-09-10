import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import RadioGroup from "../../../../components/organisms/radio-group"
import { NestedForm } from "../../../../utils/nested-form"

export type ClaimTypeFormType = {
  type: "replace" | "refund"
}

type Props = {
  form: NestedForm<ClaimTypeFormType>
}

const ClaimTypeForm = ({ form }: Props) => {
  const { t } = useTranslation()
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
                label={t("claim-type-form-refund", "Refund")}
                value="refund"
                onChange={onChange}
              />
              <RadioGroup.SimpleItem
                label={t("claim-type-form-replace", "Replace")}
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

export default ClaimTypeForm
