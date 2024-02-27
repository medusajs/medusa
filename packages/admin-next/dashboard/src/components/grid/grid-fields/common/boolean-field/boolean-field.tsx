import { Select } from "@medusajs/ui"
import { Controller, FieldValues } from "react-hook-form"
import { FieldProps } from "../../../types"

interface BooleanFieldProps<TFieldValues extends FieldValues = any>
  extends FieldProps<TFieldValues> {}

export const BooleanField = <TFieldValues extends FieldValues = any>({
  field,
  meta,
}: BooleanFieldProps<TFieldValues>) => {
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
