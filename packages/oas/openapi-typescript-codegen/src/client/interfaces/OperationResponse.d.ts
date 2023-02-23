import type { Model } from "./Model"
import { OpenApiResponse } from "../../openApi/v3/interfaces/OpenApiResponse"

export interface OperationResponse extends Model {
  spec: OpenApiResponse
  in: "response" | "header"
  code: number
}
