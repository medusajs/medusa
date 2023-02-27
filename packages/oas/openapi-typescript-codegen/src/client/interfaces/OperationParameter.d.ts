import type { Model } from "./Model"
import { OpenApiParameter } from "../../openApi/v3/interfaces/OpenApiParameter"
import { OpenApiRequestBody } from "../../openApi/v3/interfaces/OpenApiRequestBody"

export interface OperationParameter extends Model {
  spec: OpenApiParameter | OpenApiRequestBody
  in: "path" | "query" | "header" | "formData" | "body" | "cookie"
  prop: string
  mediaType: string | null
}
