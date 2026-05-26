import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"

import { useRbacAssignablePolicies } from "./api/rbac-policies"

/**
 * Filters a set of policies down to the ones the authenticated
 * actor is allowed to assign.
 *
 * @param policies The set of policies to filter.
 * @returns The subset of `policies` whose ids appear in the actor's assignable set.
 *
 * @example
 * ```tsx
 * const { policies } = useRbacPolicies({ q, order, offset, limit })
 * const visiblePolicies = useAssignablePoliciesFilter(policies)
 * <DataTable data={visiblePolicies} … />
 * ```
 */
export const useAssignablePoliciesFilter = (
  policies: HttpTypes.AdminRbacPolicy[] | undefined
): HttpTypes.AdminRbacPolicy[] => {
  const { data: assignableData } = useRbacAssignablePolicies()

  const assignablePolicyIds = useMemo(
    () => new Set((assignableData?.policies ?? []).map((p) => p.id)),
    [assignableData?.policies]
  )

  return useMemo(
    () => (policies ?? []).filter((p) => assignablePolicyIds.has(p.id)),
    [policies, assignablePolicyIds]
  )
}
