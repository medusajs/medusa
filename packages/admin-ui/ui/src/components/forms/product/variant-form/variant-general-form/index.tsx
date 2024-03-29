import FormValidator from "../../../../../utils/form-validator"
import { NestedForm } from "../../../../../utils/nested-form"
import InputField from "../../../../molecules/input"
import { useTranslation } from "react-i18next"

export type VariantGeneralFormType = {
  title: string | null
  material: string | null
}

type Props = {
  form: NestedForm<VariantGeneralFormType>
}

const VariantGeneralForm = ({ form }: Props) => {
  const { t } = useTranslation()
  const {
    path,
    register,
    formState: { errors },
  } = form

  return (
    <div>
      <p className="inter-base-regular text-grey-50">
        {t(
          "variant-general-form-description",
          "Configure the general information for this variant."
        )}
      </p>
      <div className="pt-large">
        <div className="gap-x-large grid grid-cols-2">
          <InputField
            label={t("variant-general-form-title-input-label", "Custom title")}
            placeholder={t(
              "variant-general-form-title-input-placeholder",
              "Green / XL..."
            )}
            {...register(path("title"), {
              pattern: FormValidator.whiteSpaceRule("Title"),
            })}
            errors={errors}
          />
          <InputField
            label={t("variant-general-form-material-input-label", "Material")}
            placeholder={t(
              "variant-general-form-material-input-placeholder",
              "80% wool, 20% cotton..."
            )}
            {...form.register(path("material"), {
              pattern: FormValidator.whiteSpaceRule("Material"),
            })}
            errors={errors}
          />
        </div>
      </div>
    </div>
  )
}

export default VariantGeneralForm
