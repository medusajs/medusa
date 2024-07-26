import { OpenAPIV3 } from "openapi-types"

declare type CodeSample = {
  lang: string
  label: string
  source: string
}

export declare type OpenApiOperation = Partial<OpenAPIV3.OperationObject> & {
  "x-authenticated"?: boolean
  "x-codeSamples"?: CodeSample[]
}

export declare type CommonCliOptions = {
  type: "all" | "oas" | "docs" | "dml"
  generateExamples?: boolean
  tag?: string
}

export declare type OpenApiSchema = OpenAPIV3.SchemaObject & {
  "x-schemaName"?: string
}

export declare interface OpenApiTagObject extends OpenAPIV3.TagObject {
  "x-associatedSchema"?: OpenAPIV3.ReferenceObject
}

export declare interface OpenApiDocument extends OpenAPIV3.Document {
  tags?: OpenApiTagObject[]
}
