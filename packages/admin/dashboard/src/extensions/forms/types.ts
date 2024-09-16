import { ComponentType } from "react"
import { ZodType } from "zod"

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
  type: ZodType
}

export type FormFieldSection = Record<string, FormFieldExtension>

export type FormFieldImport = {
  sections: FormFieldSection[]
}
