import { Acknowledgement } from "../../../workflows-sdk"
import { PaginatedResponse } from "../../common/response"
import { AdminWorkflowExecution } from "./entities"

export interface AdminWorkflowExecutionResponse {
  workflow_execution: AdminWorkflowExecution
}

export type AdminWorkflowExecutionListResponse = PaginatedResponse<{
  workflow_executions: AdminWorkflowExecution[]
}>

export type AdminWorkflowRunResponse = {
  acknowledgement: Acknowledgement
}
