import { isDefined } from "../../../utils/isDefined"
import type { Dictionary } from "../../../utils/types"
import type { OpenApi } from "../interfaces/OpenApi"
import type { OpenApiMediaType } from "../interfaces/OpenApiMediaType"
import type { OpenApiSchema } from "../interfaces/OpenApiSchema"

export interface Content {
  mediaType: string
  schema: OpenApiSchema
}

const BASIC_MEDIA_TYPES = [
  "application/json-patch+json",
  "application/json",
  "application/x-www-form-urlencoded",
  "text/json",
  "text/plain",
  "multipart/form-data",
  "multipart/mixed",
  "multipart/related",
  "multipart/batch",
]

export const getContent = (
  openApi: OpenApi,
  content: Dictionary<OpenApiMediaType>
): Content | null => {
  const basicMediaTypeWithSchema = Object.keys(content)
    .filter((mediaType) => {
      const cleanMediaType = mediaType.split(";")[0].trim()
      return BASIC_MEDIA_TYPES.includes(cleanMediaType)
    })
    .find((mediaType) => isDefined(content[mediaType]?.schema))
  if (basicMediaTypeWithSchema) {
    return {
      mediaType: basicMediaTypeWithSchema,
      schema: content[basicMediaTypeWithSchema].schema as OpenApiSchema,
    }
  }

  const firstMediaTypeWithSchema = Object.keys(content).find((mediaType) =>
    isDefined(content[mediaType]?.schema)
  )
  if (firstMediaTypeWithSchema) {
    return {
      mediaType: firstMediaTypeWithSchema,
      schema: content[firstMediaTypeWithSchema].schema as OpenApiSchema,
    }
  }
  return null
}
