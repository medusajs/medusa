import FormValidator from "../../../../../utils/form-validator"
import { NestedForm } from "../../../../../utils/nested-form"
import InputField from "../../../../molecules/input"

export type VariantGeneralFormType = {
  title: string | null
  material: string | null
}

type Props = {
  form: NestedForm<VariantGeneralFormType>
}

const VariantGeneralForm = ({ form }: Props) => {
  const {
    path,
    register,
    formState: { errors },
  } = form

  return (
    <div>
      <p className="inter-base-regular text-grey-50">
        Configure the general information for this variant.
      </p>
      <div className="pt-large">
        <div className="gap-x-large grid grid-cols-2">
          <InputField
            label="Custom title"
            placeholder="Green / XL..."
            {...register(path("title"), {
              pattern: FormValidator.whiteSpaceRule("Title"),
            })}
            errors={errors}
          />
          <InputField
            label="Material"
            placeholder="80% wool, 20% cotton..."
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
