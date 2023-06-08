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

export type SchemaObject = OpenAPIV3.SchemaObject & {
  properties?: {
    [name: string]: OpenAPIV3.SchemaObject
  }
}
