import { OpenAPIV3 } from "openapi-types"

type CodeSample = {
  lang: string
  label: string
  source: string
}

// export type Document = OpenAPIV3.Document<{
//   security?: OpenAPIV3.SecurityRequirementObject
// }>

export type Operation = OpenAPIV3.OperationObject<{
  operationId: string
  summary: string
  description: string
  "x-authenticated": boolean
  "x-codeSamples": CodeSample[]
  requestBody: OpenAPIV3.RequestBodyObject & {
    content: {
      [media: string]: OpenAPIV3.MediaTypeObject & {
        schema: SchemaObject
      }
    }
  }
  responses: {
    [code: string]: OpenAPIV3.ResponseObject & {
      content: {
        [media: string]: OpenAPIV3.MediaTypeObject & {
          schema: SchemaObject
        }
      }
    }
  }
}>

export type PathsObject = {
  [pattern: string]: Path
}

export type Path = OpenAPIV3.PathItemObject & {
  [method in OpenAPIV3.HttpMethods]?: Operation
}

export type ArraySchemaObject = Omit<
  OpenAPIV3.ArraySchemaObject,
  "properties" | "anyOf" | "allOf" | "oneOf"
> & {
  items: SchemaObject
  properties: PropertiesObject
  anyOf?: SchemaObject[]
  allOf?: SchemaObject[]
  oneOf?: SchemaObject[]
}

export type NonArraySchemaObject = Omit<
  OpenAPIV3.NonArraySchemaObject,
  "properties" | "anyOf" | "allOf" | "oneOf"
> & {
  properties: PropertiesObject
  anyOf?: SchemaObject[]
  allOf?: SchemaObject[]
  oneOf?: SchemaObject[]
}

export type SchemaObject = (ArraySchemaObject | NonArraySchemaObject) & {
  resolvedRef?: SchemaObject
}

export type PropertiesObject = {
  [name: string]: SchemaObject
}

export type SecuritySchemeObject = OpenAPIV3.SecuritySchemeObject & {
  "x-displayName"?: string
}
