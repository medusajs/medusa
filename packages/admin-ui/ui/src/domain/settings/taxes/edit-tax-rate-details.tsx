import { useTranslation } from "react-i18next"
import LockIcon from "../../../components/fundamentals/icons/lock-icon"
import Input from "../../../components/molecules/input"
import FormValidator from "../../../utils/form-validator"
import { NestedForm } from "../../../utils/nested-form"

export type EditTaxRateFormType = {
  name: string
  rate: number
  code: string
}

type EditTaxRateProps = {
  form: NestedForm<EditTaxRateFormType>
  lockName?: boolean
}

export const EditTaxRateDetails = ({
  lockName = false,
  form,
}: EditTaxRateProps) => {
  const { t } = useTranslation()
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <p className="inter-base-semibold mb-base">
        {t("taxes-details", "Details")}
      </p>
      <Input
        disabled={lockName}
        label={t("taxes-name", "Name")}
        prefix={
          lockName ? <LockIcon size={16} className="text-grey-40" /> : undefined
        }
        placeholder={
          lockName
            ? t("taxes-default", "Default")
            : t("taxes-rate-name", "Rate name")
        }
        {...register(path("name"), {
          required: !lockName ? FormValidator.required("Name") : undefined,
        })}
        required={!lockName}
        className="mb-base w-full min-w-[335px]"
        errors={errors}
      />
      <Input
        type="number"
        min={0}
        max={100}
        step={0.01}
        formNoValidate
        label={t("taxes-tax-rate", "Tax Rate")}
        prefix="%"
        placeholder="12"
        {...register(path("rate"), {
          min: FormValidator.min("Tax Rate", 0),
          max: FormValidator.max("Tax Rate", 100),
          required: FormValidator.required("Tax Rate"),
          valueAsNumber: true,
        })}
        required
        className="mb-base w-full min-w-[335px]"
        errors={errors}
      />
      <Input
        placeholder="1000"
        label={t("taxes-tax-code", "Tax Code")}
        {...register(path("code"), {
          required: FormValidator.required("Tax Code"),
        })}
        required
        className="mb-base w-full min-w-[335px]"
        errors={errors}
      />
    </div>
  )
}
