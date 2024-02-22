import { FieldValues } from "react-hook-form"
import { FieldProps } from "../../../types"

interface TextFieldProps<TFieldValues extends FieldValues = any>
  extends FieldProps<TFieldValues> {}

export const TextField = <TFieldValues extends FieldValues = any>({
  field,
  meta,
}: TextFieldProps<TFieldValues>) => {
  const { register } = meta

  return (
    <div className="flex items-center justify-center px-4 py-2.5">
      <input
        className="txt-compact-small text-ui-fg-subtle w-full bg-transparent outline-none"
        data-input-field="true"
        data-field-id={field}
        data-field-type="text"
        {...register(field)}
      />
    </div>
  )
}
