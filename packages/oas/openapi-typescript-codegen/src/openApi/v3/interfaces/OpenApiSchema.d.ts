import type { Dictionary } from "../../../utils/types"
import type { WithEnumExtension } from "./Extensions/WithEnumExtension"
import type { OpenApiDiscriminator } from "./OpenApiDiscriminator"
import type { OpenApiExternalDocs } from "./OpenApiExternalDocs"
import type { OpenApiReference } from "./OpenApiReference"
import type { OpenApiXml } from "./OpenApiXml"
import { WithExtendedRelationsExtension } from "./Extensions/WithDefaultRelationsExtension"

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#schemaObject
 */
export interface OpenApiSchema
  extends OpenApiReference,
    WithEnumExtension,
    WithExtendedRelationsExtension {
  title?: string
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: boolean
  minimum?: number
  exclusiveMinimum?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxProperties?: number
  minProperties?: number
  required?: string[]
  enum?: (string | number)[]
  type?: string | string[]
  allOf?: OpenApiSchema[]
  oneOf?: OpenApiSchema[]
  anyOf?: OpenApiSchema[]
  not?: OpenApiSchema[]
  items?: OpenApiSchema
  properties?: Dictionary<OpenApiSchema>
  additionalProperties?: boolean | OpenApiSchema
  description?: string
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
  default?: any
  nullable?: boolean
  discriminator?: OpenApiDiscriminator
  readOnly?: boolean
  writeOnly?: boolean
  xml?: OpenApiXml
  externalDocs?: OpenApiExternalDocs
  example?: any
  deprecated?: boolean
}
