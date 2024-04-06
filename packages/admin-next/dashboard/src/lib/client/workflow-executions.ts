import {
  WorkflowExecutionListRes,
  WorkflowExecutionRes,
} from "../../types/api-responses"
import { getRequest } from "./common"

async function retrieveWorkflowExecution(
  id: string,
  query?: Record<string, any>
) {
  return getRequest<WorkflowExecutionRes>(
    `/admin/workflows-executions/${id}`,
    query
  )
}

async function listWorkflowExecutions(query?: Record<string, any>) {
  return getRequest<WorkflowExecutionListRes>(
    `/admin/workflows-executions`,
    query
  )
}

export const workflowExecutions = {
  retrieve: retrieveWorkflowExecution,
  list: listWorkflowExecutions,
}
