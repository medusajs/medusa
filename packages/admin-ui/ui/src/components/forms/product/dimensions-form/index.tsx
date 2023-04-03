import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"

export type DimensionsFormType = {
  length: number | null
  width: number | null
  height: number | null
  weight: number | null
}

type DimensionsFormProps = {
  form: NestedForm<DimensionsFormType>
}

/**
 * Re-usable nested form used to submit dimensions information for products and their variants.
 * @example
 * <DimensionsForm form={nestedForm(form, "dimensions")} />
 */
const DimensionsForm = ({ form }: DimensionsFormProps) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div className="gap-x-large grid grid-cols-4">
      <InputField
        label="Width"
        placeholder="100..."
        type="number"
        {...register(path("width"), {
          min: FormValidator.nonNegativeNumberRule("Width"),
          valueAsNumber: true,
        })}
        errors={errors}
      />
      <InputField
        label="Length"
        placeholder="100..."
        type="number"
        {...register(path("length"), {
          min: FormValidator.nonNegativeNumberRule("Length"),
          valueAsNumber: true,
        })}
        errors={errors}
      />
      <InputField
        label="Height"
        placeholder="100..."
        type="number"
        {...register(path("height"), {
          min: FormValidator.nonNegativeNumberRule("Height"),
          valueAsNumber: true,
        })}
        errors={errors}
      />
      <InputField
        label="Weight"
        placeholder="100..."
        type="number"
        {...register(path("weight"), {
          min: FormValidator.nonNegativeNumberRule("Weight"),
          valueAsNumber: true,
        })}
        errors={errors}
      />
    </div>
  )
}

export default DimensionsForm
