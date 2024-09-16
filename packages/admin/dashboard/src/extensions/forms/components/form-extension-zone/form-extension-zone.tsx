import { Input, Switch } from "@medusajs/ui"
import { ComponentType } from "react"
import { ControllerRenderProps, UseFormReturn } from "react-hook-form"
import { Form } from "../../../../components/common/form"
import { InlineTip } from "../../../../components/common/inline-tip"
import {
  FormFieldExtension,
  FormFieldImport,
  FormFieldSection,
} from "../../types"
import { FormFieldType } from "./types"
import { getFieldType } from "./utils"

type FormExtensionZoneProps = {
  extensions: FormFieldImport
  form: UseFormReturn<any>
}

export const FormExtensionZone = ({
  extensions,
  form,
}: FormExtensionZoneProps) => {
  const sections = extensions.sections || []

  return (
    <div>
      {sections.map((section, index) => (
        <FormExtensionSection key={index} section={section} form={form} />
      ))}
    </div>
  )
}

type FormExtensionSectionProps = {
  section: FormFieldSection
  form: UseFormReturn<any>
}

const FormExtensionSection = ({ section, form }: FormExtensionSectionProps) => {
  return (
    <div>
      {Object.entries(section).map(([key, field], index) => (
        <FormExtensionField key={index} field={field} name={key} form={form} />
      ))}
    </div>
  )
}

function getFieldLabel(field: FormFieldExtension, name: string) {
  if (field.label) {
    return field.label
  }

  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

type FormExtensionFieldProps = {
  field: FormFieldExtension
  name: string
  form: UseFormReturn<any>
}

const FormExtensionField = ({ field, name, form }: FormExtensionFieldProps) => {
  const label = getFieldLabel(field, name)
  const description = field.description
  const placeholder = field.placeholder
  const component = field.component

  const type = getFieldType(field.type)

  const { control } = form

  return (
    <Form.Field
      control={control}
      name={`additional_data.${name}`}
      render={({ field }) => {
        return (
          <Form.Item>
            <Form.Label>{label}</Form.Label>
            {description && <Form.Hint>{description}</Form.Hint>}
            <Form.Control>
              <FormExtensionFieldComponent
                field={field}
                type={type}
                component={component}
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
