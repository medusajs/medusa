import { LoaderFunctionArgs } from "react-router-dom"

import { rbacRolesQueryKeys } from "../../../hooks/api/rbac-roles"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { ROLE_DETAIL_FIELDS } from "./constants"

const roleDetailQuery = (id: string) => ({
  queryKey: rbacRolesQueryKeys.detail(id, { fields: ROLE_DETAIL_FIELDS }),
  queryFn: async () =>
    sdk.admin.rbacRole.retrieve(id, { fields: ROLE_DETAIL_FIELDS }),
})

export const roleLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = roleDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}
