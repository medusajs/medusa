import { AdminGetWorkflowExecutionsParams } from "@medusajs/medusa"
import { Container } from "@medusajs/ui"
import { useAdminCustomQuery } from "medusa-react"

/**
 * Type isn't exported from the package
 */
type WorkflowExecutionsRes = {
  workflow_executions: any[]
  count: number
  offset: number
  limit: number
}

const getQueryKey = (params?: AdminGetWorkflowExecutionsParams) => {
  return ["workflow_executions", "list", { params }]
}

export const ExecutionsListTable = () => {
  const { data, isLoading, isError, error } = useAdminCustomQuery<
    AdminGetWorkflowExecutionsParams,
    WorkflowExecutionsRes
  >(
    "/workflows-executions",
    getQueryKey(),
    {},
    {
      keepPreviousData: true,
    }
  )

  if (isError) {
    throw error
  }

  return <Container className="divide-y p-0"></Container>
}
