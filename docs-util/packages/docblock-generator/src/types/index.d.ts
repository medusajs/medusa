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
  type: "all" | "oas" | "docs"
  generateExamples?: boolean
}
