import { Input } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { Form } from "../../../../components/common/form"
import {
  FormFieldExtension,
  FormFieldImport,
  FormFieldSection,
} from "../../types"

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

function getComponent(field: FormFieldExtension) {
  if (field.component) {
    return field.component
  }

  return Input
}

type FormExtensionFieldProps = {
  field: FormFieldExtension
  name: string
  form: UseFormReturn<any>
}

const FormExtensionField = ({ field, name, form }: FormExtensionFieldProps) => {
  const label = getFieldLabel(field, name)
  const description = field.description
  const Component = getComponent(field)

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
              <Component {...field} />
            </Form.Control>
            <Form.ErrorMessage />
          </Form.Item>
        )
      }}
    />
  )
}
