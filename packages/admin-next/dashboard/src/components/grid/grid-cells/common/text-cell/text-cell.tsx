import { FieldValues } from "react-hook-form"
import { CellProps } from "../../../types"

interface TextCellProps<TFieldValues extends FieldValues = any>
  extends CellProps<TFieldValues> {}

export const TextCell = <TFieldValues extends FieldValues = any>({
  field,
  meta,
}: TextCellProps<TFieldValues>) => {
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
