import { Input, Switch } from "@medusajs/ui"
import { ComponentType } from "react"
import { ControllerRenderProps, UseFormReturn } from "react-hook-form"
import { Form } from "../../../components/common/form"
import { InlineTip } from "../../../components/common/inline-tip"
import { FormField } from "../../types"
import { FormFieldType } from "./types"
import { getFieldType } from "./utils"

type FormExtensionZoneProps = {
  fields: FormField[]
  form: UseFormReturn<any>
}

export const FormExtensionZone = ({ fields, form }: FormExtensionZoneProps) => {
  return (
    <div>
      {fields.map((field, index) => (
        <FormExtensionField key={index} field={field} form={form} />
      ))}
    </div>
  )
}

function getFieldLabel(field: FormField) {
  if (field.label) {
    return field.label
  }

  return field.name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

type FormExtensionFieldProps = {
  field: FormField
  form: UseFormReturn<any>
}

const FormExtensionField = ({ field, form }: FormExtensionFieldProps) => {
  const label = getFieldLabel(field)
  const description = field.description
  const placeholder = field.placeholder
  const Component = field.Component

  const type = getFieldType(field.validation)

  const { control } = form

  return (
    <Form.Field
      control={control}
      name={`additional_data.${field.name}`}
      render={({ field }) => {
        return (
          <Form.Item>
            <Form.Label>{label}</Form.Label>
            {description && <Form.Hint>{description}</Form.Hint>}
            <Form.Control>
              <FormExtensionFieldComponent
                field={field}
                type={type}
                component={Component}
                placeholder={placeholder}
              />
            </Form.Control>
            <Form.ErrorMessage />
          </Form.Item>
        )
      }}
    />
  )
}

type FormExtensionFieldComponentProps = {
  field: ControllerRenderProps
  type: FormFieldType
  component?: ComponentType<any>
  placeholder?: string
}

const FormExtensionFieldComponent = ({
  field,
  type,
  component,
  placeholder,
}: FormExtensionFieldComponentProps) => {
  if (component) {
    const Component = component

    return <Component {...field} placeholder={placeholder} />
  }

  switch (type) {
    case "text": {
      return <Input {...field} placeholder={placeholder} />
    }
    case "number": {
      return <Input {...field} placeholder={placeholder} type="number" />
    }
    case "boolean": {
      return <Switch {...field} />
    }
    default: {
      return (
        <InlineTip variant="warning">
          The field type does not support rendering a fallback component. Please
          provide a component prop.
        </InlineTip>
      )
    }
  }
}
