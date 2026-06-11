import { LoaderFunctionArgs } from "react-router-dom"

import { rbacPoliciesQueryKeys } from "../../../hooks/api/rbac-policies"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"
import { POLICY_DETAIL_FIELDS } from "./constants"

const policyDetailQuery = (id: string) => ({
  queryKey: rbacPoliciesQueryKeys.detail(id, { fields: POLICY_DETAIL_FIELDS }),
  queryFn: async () =>
    sdk.admin.rbacPolicy.retrieve(id, { fields: POLICY_DETAIL_FIELDS }),
})

export const policyLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = policyDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}
