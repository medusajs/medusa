import { OpenAPIV3 } from "openapi-types"

type CodeSample = {
  lang: string
  label: string
  source: string
}

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

export type Path = OpenAPIV3.PathItemObject & {
  [method in OpenAPIV3.HttpMethods]?: Operation
}

export type ArraySchemaObject = Omit<
  OpenAPIV3.ArraySchemaObject,
  "properties" | "anyOf"
> & {
  items: SchemaObject
  properties: {
    [name: string]: SchemaObject
  }
  anyOf?: SchemaObject[]
}

export type NonArraySchemaObject = Omit<
  OpenAPIV3.NonArraySchemaObject,
  "properties" | "anyOf"
> & {
  properties: {
    [name: string]: SchemaObject
  }
  anyOf?: SchemaObject[]
}

export type SchemaObject = ArraySchemaObject | NonArraySchemaObject
