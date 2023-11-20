import { useTranslation } from "react-i18next"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"

export type CustomerGroupGeneralFormType = {
  name: string
}

type CustomerGroupGeneralFormProps = {
  form: NestedForm<CustomerGroupGeneralFormType>
}

export const CustomerGroupGeneralForm = ({
  form,
}: CustomerGroupGeneralFormProps) => {
  const { t } = useTranslation()

  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <InputField
        label={t("Name")}
        required
        {...register(path("name"), {
          required: FormValidator.required(t("Name")),
        })}
        errors={errors}
      />
    </div>
  )
}
