import { OpenApiSchema } from "../../openApi/v3/interfaces/OpenApiSchema"

export interface Schema {
  spec: OpenApiSchema
  isDefinition: boolean
  isReadOnly: boolean
  isRequired: boolean
  isNullable: boolean
  format?:
    | "int32"
    | "int64"
    | "float"
    | "double"
    | "string"
    | "boolean"
    | "byte"
    | "binary"
    | "date"
    | "date-time"
    | "password"
  maximum?: number
  exclusiveMaximum?: boolean
  minimum?: number
  exclusiveMinimum?: boolean
  multipleOf?: number
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxProperties?: number
  minProperties?: number
}
