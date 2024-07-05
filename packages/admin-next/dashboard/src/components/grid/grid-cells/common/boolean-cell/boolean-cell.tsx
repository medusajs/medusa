import { Select } from "@medusajs/ui"
import { Controller, FieldValues } from "react-hook-form"
import { CellProps } from "../../../types"

interface BooleanCellProps<TFieldValues extends FieldValues = any>
  extends CellProps<TFieldValues> {}

export const BooleanCell = <TFieldValues extends FieldValues = any>({
  field,
  meta,
}: BooleanCellProps<TFieldValues>) => {
  const { control } = meta

  return (
    <Controller
      control={control}
      name={field}
      render={({ field: { value, onChange, ref, ...rest } }) => {
        return <Select value={value} onValueChange={onChange}></Select>
      }}
    />
  )
}
