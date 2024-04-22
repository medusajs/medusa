import { Control, FieldValues, Path, UseFormRegister } from "react-hook-form"

export type DataGridMeta<TFieldValues extends FieldValues = FieldValues> = {
  register: UseFormRegister<TFieldValues>
  control: Control<TFieldValues>
}

export interface CellProps<TFieldValues extends FieldValues = FieldValues> {
  field: Path<TFieldValues>
  meta: DataGridMeta<TFieldValues>
}
