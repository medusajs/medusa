import { useTranslation } from "react-i18next"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"

export type AddressContactFormType = {
  first_name: string
  last_name: string
  company: string | null
  phone: string | null
}

type AddressContactFormProps = {
  requireFields?: Partial<Record<keyof AddressContactFormType, boolean>>
  form: NestedForm<AddressContactFormType>
}

/**
 * Re-usable form for address contact information, used to create and edit addresses.
 * Fields are optional, but can be required by passing in a requireFields object.
 */
const AddressContactForm = ({
  form,
  requireFields,
}: AddressContactFormProps) => {
  const {
    path,
    register,
    formState: { errors },
  } = form
  const { t } = useTranslation()
  return (
    <div>
      <div className="gap-large grid grid-cols-2">
        <InputField
          {...register(path("first_name"), {
            required: requireFields?.first_name
              ? FormValidator.required(t("First name"))
              : false,
            pattern: FormValidator.whiteSpaceRule("First name"),
          })}
          placeholder={t("First Name")}
          label={t("First Name")}
          required={requireFields?.first_name}
          errors={errors}
        />
        <InputField
          {...form.register(path("last_name"), {
            required: requireFields?.last_name
              ? FormValidator.required(t("Last name"))
              : false,
            pattern: FormValidator.whiteSpaceRule("Last name"),
          })}
          placeholder={t("Last Name")}
          label={t("Last Name")}
          required={requireFields?.last_name}
          errors={errors}
        />
        <InputField
          {...form.register(path("company"), {
            pattern: FormValidator.whiteSpaceRule("Company"),
            required: requireFields?.company
              ? FormValidator.required(t("Company"))
              : false,
          })}
          placeholder={t("Company")}
          required={requireFields?.company}
          label={t("Company")}
          errors={errors}
        />
        <InputField
          {...form.register(path("phone"), {
            pattern: FormValidator.whiteSpaceRule("Phone"),
            required: requireFields?.phone
              ? FormValidator.required(t("Phone"))
              : false,
          })}
          required={requireFields?.phone}
          placeholder={t("Phone")}
          label={t("Phone")}
          errors={errors}
        />
      </div>
    </div>
  )
}

export default AddressContactForm
