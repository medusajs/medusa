import { Switch } from "@zjedene-medusa/ui"
import type { Control, FieldValues, Path } from "react-hook-form"
import { Form } from "../common/form"

interface SwitchBlockProps<TValues extends FieldValues> {
  label: string
  description: string
  name: Path<TValues>
  control: Control<TValues>
}

export const SwitchBlock = <TValues extends FieldValues>(
  props: SwitchBlockProps<TValues>
) => {
  return (
    <Form.Field
      name={props.name}
      control={props.control}
      render={({ field: { value, onChange, ...field } }) => (
        <Form.Item>
          <div className="flex items-start gap-3 bg-ui-bg-component shadow-elevation-card-rest rounded-lg p-3">
            <Form.Control>
              <Switch
                size="small"
                checked={value}
                onCheckedChange={onChange}
                {...field}
              />
            </Form.Control>
            <div className="flex flex-col">
              <Form.Label>{props.label}</Form.Label>
              <Form.Hint>{props.description}</Form.Hint>
            </div>
          </div>
        </Form.Item>
      )}
    />
  )
}
