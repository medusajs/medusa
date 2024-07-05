import { AdminGetWorkflowExecutionsParams } from "@medusajs/medusa"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useWorkflowExecutionTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(["q", "offset"], prefix)

  const { offset, ...rest } = raw

  const searchParams: AdminGetWorkflowExecutionsParams = {
    limit: pageSize,
    offset: offset ? parseInt(offset) : 0,
    ...rest,
  }

  return {
    searchParams,
    raw,
  }
}
