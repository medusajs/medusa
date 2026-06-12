import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

import { useRbacPolicy } from "../../../hooks/api/rbac-policies"
import { POLICY_DETAIL_FIELDS } from "./constants"

type PolicyDetailBreadcrumbProps = UIMatch<HttpTypes.AdminRbacPolicyResponse>

export const PolicyDetailBreadcrumb = (props: PolicyDetailBreadcrumbProps) => {
  const { id } = props.params || {}

  const { policy } = useRbacPolicy(
    id!,
    {
      fields: POLICY_DETAIL_FIELDS,
    },
    {
      initialData: props.data,
      enabled: Boolean(id),
    }
  )

  if (!policy) {
    return null
  }

  return <span>{policy.key}</span>
}
