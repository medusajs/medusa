import { ComponentType } from "react"

type FormConfigExtension = {
  defaultValue: ((data: any) => any) | any
  validation: any
}

export type FormConfigObject = Record<string, FormConfigExtension>

export type FormConfigImport = {
  configs: FormConfigObject[]
}

export type FormFieldExtension = {
  component?: ComponentType<any>
  label?: string
  description?: string
  placeholder?: string
  validation?: any
}

export type FormFieldSection = Record<string, FormFieldExtension>

export type FormFieldImport = {
  sections: FormFieldSection[]
}
