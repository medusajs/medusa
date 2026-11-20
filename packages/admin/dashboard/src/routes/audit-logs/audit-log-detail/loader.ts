import { LoaderFunctionArgs } from "react-router-dom"

import { auditLogsQueryKeys } from "../../../hooks/api/audit-logs"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

export const auditLogDetailQuery = (id: string) => ({
  queryKey: auditLogsQueryKeys.detail(id),
  queryFn: async () => sdk.admin.auditLog.retrieve(id),
})

export const auditLogLoader = async ({ params }: LoaderFunctionArgs) => {
  const query = auditLogDetailQuery(params.id!)

  return (
    queryClient.getQueryData<Awaited<ReturnType<typeof query.queryFn>>>(
      query.queryKey
    ) ?? (await queryClient.fetchQuery(query))
  )
}
