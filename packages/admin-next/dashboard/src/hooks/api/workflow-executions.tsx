import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import {
  WorkflowExecutionListRes,
  WorkflowExecutionRes,
} from "../../types/api-responses"

const WORKFLOW_EXECUTIONS_QUERY_KEY = "workflow_executions" as const
export const workflowExecutionsQueryKeys = queryKeysFactory(
  WORKFLOW_EXECUTIONS_QUERY_KEY
)

export const useWorkflowExecutions = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      WorkflowExecutionListRes,
      Error,
      WorkflowExecutionListRes,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.workflowExecutions.list(query),
    queryKey: workflowExecutionsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useWorkflowExecution = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      WorkflowExecutionRes,
      Error,
      WorkflowExecutionRes,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.workflowExecutions.retrieve(id, query),
    queryKey: workflowExecutionsQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}
