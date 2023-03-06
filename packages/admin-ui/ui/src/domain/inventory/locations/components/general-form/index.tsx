import InputField from "../../../../../components/molecules/input"
import FormValidator from "../../../../../utils/form-validator"
import { NestedForm } from "../../../../../utils/nested-form"

export type GeneralFormType = {
  name: string
}

type Props = {
  form: NestedForm<GeneralFormType>
}

const GeneralForm = ({ form }: Props) => {
  const {
    register,
    path,
    formState: { errors },
  } = form
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-large mb-small">
        <InputField
          label="Location name"
          placeholder="Flagship store, warehouse"
          required
          {...register(path("name"), {
            required: "Name is required",
            pattern: FormValidator.whiteSpaceRule("Location name"),
          })}
          errors={errors}
        />
      </div>
    </div>
  )
}

export default GeneralForm
