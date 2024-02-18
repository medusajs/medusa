import { Control, FieldValues, Path, UseFormRegister } from "react-hook-form"

type DataGridMeta<TFieldValues extends FieldValues = any> = {
  register: UseFormRegister<TFieldValues>
  control: Control<TFieldValues>
}

export interface FieldProps<TFieldValues extends FieldValues = any> {
  field: Path<TFieldValues>
  meta: DataGridMeta<TFieldValues>
}
