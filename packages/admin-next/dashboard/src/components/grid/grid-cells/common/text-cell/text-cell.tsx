import { FieldValues } from "react-hook-form"
import { CellProps } from "../../../types"
import { GridCellType } from "../../../constants"

interface TextCellProps<TFieldValues extends FieldValues = any>
  extends CellProps<TFieldValues>,
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    > {}

export const TextCell = <TFieldValues extends FieldValues = any>({
  field,
  meta,
  ...rest
}: TextCellProps<TFieldValues>) => {
  const { register } = meta

  return (
    <div className="flex items-center justify-center px-4 py-2.5">
      <input
        className="txt-compact-small text-ui-fg-subtle w-full bg-transparent outline-none"
        data-input-field="true"
        data-field-id={field}
        data-field-type="text"
        data-cell-type={GridCellType.EDITABLE}
        {...register(field)}
        {...rest}
      />
    </div>
  )
}
