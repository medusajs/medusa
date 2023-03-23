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

const AddressContactForm = ({
  form,
  requireFields,
}: AddressContactFormProps) => {
  const {
    path,
    register,
    formState: { errors },
  } = form

  return (
    <div>
      <div className="gap-large mt-4 mb-8 grid grid-cols-2">
        <InputField
          {...register(path("first_name"), {
            required: requireFields?.first_name
              ? FormValidator.required("First name")
              : false,
            pattern: FormValidator.whiteSpaceRule("First name"),
          })}
          placeholder="First Name"
          label="First Name"
          required={requireFields?.first_name}
          errors={errors}
        />
        <InputField
          {...form.register(path("last_name"), {
            required: requireFields?.last_name
              ? FormValidator.required("Last name")
              : false,
            pattern: FormValidator.whiteSpaceRule("Last name"),
          })}
          placeholder="Last Name"
          label="Last Name"
          required={requireFields?.last_name}
          errors={errors}
        />
        <InputField
          {...form.register(path("company"), {
            pattern: FormValidator.whiteSpaceRule("Company"),
            required: requireFields?.company
              ? FormValidator.required("Company")
              : false,
          })}
          placeholder="Company"
          required={requireFields?.company}
          label="Company"
          errors={errors}
        />
        <InputField
          {...form.register(path("phone"), {
            pattern: FormValidator.whiteSpaceRule("Phone"),
            required: requireFields?.phone
              ? FormValidator.required("Phone")
              : false,
          })}
          required={requireFields?.phone}
          placeholder="Phone"
          label="Phone"
          errors={errors}
        />
      </div>
    </div>
  )
}

export default AddressContactForm
