import { Badge, Select } from "@medusajs/ui"
import { Controller, FieldValues } from "react-hook-form"
import { CellProps } from "../../../types"
import { GridCellType } from "../../../constants"

interface BooleanCellProps<TFieldValues extends FieldValues = any>
  extends CellProps<TFieldValues> {
  disabled?: boolean
}

export const BooleanCell = <TFieldValues extends FieldValues = any>({
  field,
  meta,
  ...propsRest
}: BooleanCellProps<TFieldValues>) => {
  const { control } = meta

  return (
    <Controller
      control={control}
      name={field}
      render={({ field: { value, onChange, ref, ...rest } }) => {
        return (
          <Select
            value={value === true ? "true" : "false"}
            onValueChange={(v) => onChange(v === "true")}
            data-input-field="true"
            data-field-id={field}
            data-field-type="boolean"
            data-cell-type={GridCellType.EDITABLE}
            {...propsRest}
          >
            <Select.Trigger
              ref={ref}
              className="bg-ui-bg-base h-[100%] rounded-none px-4 shadow-none"
            >
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="true">
                <Badge size="small" color="green">
                  True
                </Badge>
              </Select.Item>
              <Select.Item value="false">
                <Badge size="small" color="grey">
                  False
                </Badge>
              </Select.Item>
            </Select.Content>
          </Select>
        )
      }}
    />
  )
}
