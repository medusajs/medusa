import { PaginatedResponse } from "../../common/response"
import { AdminWorkflowExecution } from "./entities"

export interface AdminWorkflowExecutionResponse {
  workflow_execution: AdminWorkflowExecution
}

export type AdminWorkflowExecutionListResponse = PaginatedResponse<{
  workflow_executions: AdminWorkflowExecution[]
}>
