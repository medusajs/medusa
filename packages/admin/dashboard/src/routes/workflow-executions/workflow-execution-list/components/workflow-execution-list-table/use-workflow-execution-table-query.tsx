import { HttpTypes } from "@medusajs/types"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useWorkflowExecutionTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(
    ["q", "offset", "order", "workflow_id", "state", "created_at"],
    prefix
  )

  const { offset, order, workflow_id, state, created_at, ...rest } = raw

  const searchParams: HttpTypes.AdminGetWorkflowExecutionsParams = {
    limit: pageSize,
    offset: offset ? parseInt(offset) : 0,
    order: order ? order : "-created_at",
    workflow_id: workflow_id?.split(","),
    state: state?.split(","),
    created_at: created_at ? JSON.parse(created_at) : undefined,
    ...rest,
  }

  return {
    searchParams,
    raw,
  }
}
