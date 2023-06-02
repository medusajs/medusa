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
}>

export type Path = OpenAPIV3.PathItemObject & {
  [method in OpenAPIV3.HttpMethods]?: Operation
}
