import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { HttpTypes } from "@medusajs/types"
import { FetchError } from "@medusajs/js-sdk"

const WORKFLOW_EXECUTIONS_QUERY_KEY = "workflow_executions" as const
export const workflowExecutionsQueryKeys = queryKeysFactory(
  WORKFLOW_EXECUTIONS_QUERY_KEY
)

export const useWorkflowExecutions = (
  query?: HttpTypes.AdminGetWorkflowExecutionsParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminGetWorkflowExecutionsParams,
      FetchError,
      HttpTypes.AdminWorkflowExecutionListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.workflowExecution.list(query),
    queryKey: workflowExecutionsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useWorkflowExecution = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminWorkflowExecutionResponse,
      FetchError,
      HttpTypes.AdminWorkflowExecutionResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.workflowExecution.retrieve(id),
    queryKey: workflowExecutionsQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}
