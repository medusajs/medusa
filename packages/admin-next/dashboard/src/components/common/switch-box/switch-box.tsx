import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"

import { Switch } from "@medusajs/ui"
import { ReactNode } from "react"
import { Form } from "../../common/form"

interface SwitchBoxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label: string
  description: string
  optional?: boolean
  tooltip?: ReactNode
}

export const SwitchBox = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  description,
  optional = false,
  tooltip,
  ...props
}: SwitchBoxProps<TFieldValues, TName>) => {
  return (
    <Form.Field
      {...props}
      render={({ field: { value, onChange, ...field } }) => {
        return (
          <Form.Item>
            <div className="bg-ui-bg-component shadow-elevation-card-rest flex items-start gap-x-3 rounded-lg p-3">
              <Form.Control>
                <Switch {...field} checked={value} onCheckedChange={onChange} />
              </Form.Control>
              <div>
                <Form.Label optional={optional} tooltip={tooltip}>
                  {label}
                </Form.Label>
                <Form.Hint>{description}</Form.Hint>
              </div>
            </div>
            <Form.ErrorMessage />
          </Form.Item>
        )
      }}
    />
  )
}
