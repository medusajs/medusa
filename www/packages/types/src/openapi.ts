import type { OpenAPIV3 } from "openapi-types"

export type { OpenAPIV3 }

export type Area = "admin" | "store"

export type Code = {
  lang: string
  label: string
  source: string
}

export type Operation = OpenAPIV3.OperationObject<{
  operationId: string
  summary: string
  description: string
  "x-authenticated": boolean
  "x-codeSamples": Code[]
  requestBody: RequestObject
  responses: ResponsesObject
  parameters: Parameter[]
  "x-featureFlag"?: string
  "x-workflow"?: string
  "x-sidebar-summary"?: string
  // Precomputed API-reference page path (without basePath) and its last
  // segment, injected at request time from the generated path map.
  "x-path"?: string
  "x-slug"?: string
  "x-events"?: OasEvents[]
  "x-since"?: string
  "x-deprecated_message"?: string
  "x-badges"?: {
    text: string
    description: string
    variant?: "purple" | "orange" | "green" | "blue" | "red" | "neutral"
  }[]
}>

export type RequestObject = OpenAPIV3.RequestBodyObject & {
  content: {
    [media: string]: OpenAPIV3.MediaTypeObject & {
      schema: SchemaObject
    }
  }
}

export type ResponseObject = OpenAPIV3.ResponseObject & {
  content: {
    [media: string]: Omit<OpenAPIV3.MediaTypeObject, "examples"> & {
      schema: SchemaObject
    }
  }
  contentSample?: string
}

export type ResponsesObject = {
  [code: string]: ResponseObject
}

export type ExampleObject = {
  title: string
  value: string
  content: string
  contentDetailed?: string
  contentSchema?: string
}

export type PathsObject = {
  [pattern: string]: Path
}

export type Path = OpenAPIV3.PathItemObject & {
  [method in OpenAPIV3.HttpMethods]?: Operation
}

export type ArraySchemaObject = Omit<
  OpenAPIV3.ArraySchemaObject,
  "properties" | "anyOf" | "allOf" | "oneOf" | "examples"
> & {
  items: SchemaObject
  properties: PropertiesObject
  anyOf?: SchemaObject[]
  allOf?: SchemaObject[]
  oneOf?: SchemaObject[]
}

export type NonArraySchemaObject = Omit<
  OpenAPIV3.NonArraySchemaObject,
  | "properties"
  | "anyOf"
  | "allOf"
  | "oneOf"
  | "examples"
  | "additionalProperties"
> & {
  properties: PropertiesObject
  additionalProperties?: SchemaObject
  anyOf?: SchemaObject[]
  allOf?: SchemaObject[]
  oneOf?: SchemaObject[]
}

export type SchemaObject = (ArraySchemaObject | NonArraySchemaObject) & {
  parameterName?: string
  resolvedRef?: SchemaObject
  examples?: {
    [media: string]: OpenAPIV3.ExampleObject
  }
  isRequired?: boolean
  "x-featureFlag"?: string
  "x-expandable"?: string
  "x-schemaName"?: string
  additionalProperties?: SchemaObject
}

export type PropertiesObject = {
  [name: string]: SchemaObject
}

export type SecuritySchemeObject = OpenAPIV3.SecuritySchemeObject & {
  "x-displayName"?: string
  "x-is-auth"?: boolean
}

export type Parameter = OpenAPIV3.ParameterObject & {
  examples: {
    [media: string]: OpenAPIV3.ExampleObject
  }
  schema: SchemaObject
}

export type Document = Omit<OpenAPIV3.Document, "paths"> & {
  paths: PathsObject
}

export type ExpandedDocument = Document & {
  expandedTags?: {
    [k: string]: PathsObject
  }
}

export type TagObject = OpenAPIV3.TagObject & {
  "x-associatedSchema"?: OpenAPIV3.ReferenceObject
}

export type ParsedPathItemObject = OpenAPIV3.PathItemObject<Operation> & {
  operationPath?: string
}

export type OasEvents = {
  name: string
  payload: string
  description?: string
  deprecated?: boolean
  deprecated_message?: string
  since?: string
}
