import type { OperationError } from "./OperationError"
import type { OperationParameters } from "./OperationParameters"
import type { OperationResponse } from "./OperationResponse"
import type { OperationCodegen } from "./OperationCodegen"

export interface Operation extends OperationParameters {
  service: string
  name: string
  operationId: string | null
  summary: string | null
  description: string | null
  deprecated: boolean
  method: string
  path: string
  errors: OperationError[]
  results: OperationResponse[]
  responseHeader: string | null
  codegen: OperationCodegen
}
