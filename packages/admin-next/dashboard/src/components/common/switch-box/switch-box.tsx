import { Switch } from "@medusajs/ui"
import { ReactNode } from "react"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"

import { Form } from "../../common/form"

interface HeadlessControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>  extends Omit<ControllerProps<TFieldValues, TName>, "render"> {}

interface SwitchBoxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends HeadlessControllerProps<TFieldValues, TName>{
  label: string
  description: string
  optional?: boolean
  tooltip?: ReactNode
  /**
   * Callback for performing additional actions when the checked state changes.
   * This does not intercept the form control, it is only used for injecting side-effects.
   */
  onCheckedChange?: (checked: boolean) => void
}

/**
 * Wrapper for the Switch component to be used with `react-hook-form`.
 * 
 * Use this component whenever a design calls for wrapping the Switch component
 * in a container with a label and description.
 */
export const SwitchBox = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  label,
  description,
  optional = false,
  tooltip,
  onCheckedChange,
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
                <Switch {...field} checked={value} onCheckedChange={(e) => {
                  onCheckedChange?.(e)
                  onChange(e)
                }} />
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