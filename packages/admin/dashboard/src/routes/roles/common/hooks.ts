import { HttpTypes } from "@medusajs/types"
import { usePrompt } from "@medusajs/ui"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  useRbacAssignablePolicies,
  useRbacPolicies,
} from "../../../hooks/api/rbac-policies"
import { sdk } from "../../../lib/client"
import { usePermissions } from "../../../providers/permissions-provider"
import {
  buildMatrix,
  formatFallbackLabel,
  getWildcardPolicies,
  MatrixPolicy,
} from "./utils"

/**
 * Returns a function resolving the label of a policy resource, falling back
 * to a sentence-cased version of its name for resources without a translation.
 */
export const useResourceLabel = () => {
  const { t } = useTranslation()

  return useCallback(
    (resource: string): string =>
      t(`permissions.resources.${resource}`, {
        defaultValue: formatFallbackLabel(resource),
      }) as string,
    [t]
  )
}

/**
 * Returns a function resolving the label of a policy operation, falling back
 * to a sentence-cased version of its name for operations without a translation.
 */
export const useOperationLabel = () => {
  const { t } = useTranslation()

  return useCallback(
    (operation: string): string =>
      t(`permissions.actions.${operation}`, {
        defaultValue: formatFallbackLabel(operation),
      }) as string,
    [t]
  )
}

/**
 * Returns functions resolving the label and description of a permission group.
 */
export const useGroupLabels = () => {
  const { t } = useTranslation()

  return useMemo(
    () => ({
      label: (id: string): string =>
        t(`roles.permissions.matrix.groups.${id}.label`, {
          defaultValue: formatFallbackLabel(id),
        }) as string,
      description: (id: string): string =>
        t(`roles.permissions.matrix.groups.${id}.description`, {
          defaultValue: "",
        }) as string,
    }),
    [t]
  )
}

/**
 * Loads every policy and the subset the current user can assign, and builds
 * the permissions matrix from them. `extraPolicies` (e.g. policies a role holds
 * that are missing from the list) are merged in, de-duplicated by id.
 */
export const usePermissionsMatrix = (extraPolicies?: MatrixPolicy[]) => {
  const {
    policies: allPolicies,
    isPending: isPoliciesPending,
    isError: isPoliciesError,
    error: policiesError,
  } = useRbacPolicies({ limit: 9999, fields: "id,key,resource,operation" })

  const {
    data: assignableData,
    isPending: isAssignablePending,
    isError: isAssignableError,
    error: assignableError,
  } = useRbacAssignablePolicies({ limit: 9999 })

  const policies = useMemo(() => {
    const byId = new Map<string, MatrixPolicy>()

    for (const policy of [...(allPolicies ?? []), ...(extraPolicies ?? [])]) {
      if (!byId.has(policy.id)) {
        byId.set(policy.id, policy)
      }
    }

    return [...byId.values()]
  }, [allPolicies, extraPolicies])

  const assignableIds = useMemo(
    () => new Set((assignableData?.policies ?? []).map((policy) => policy.id)),
    [assignableData]
  )

  const matrix = useMemo(
    () => buildMatrix(policies, assignableIds),
    [policies, assignableIds]
  )

  const wildcardPolicies = useMemo(
    () => getWildcardPolicies(policies),
    [policies]
  )

  return {
    policies,
    matrix,
    assignableIds,
    wildcardPolicies,
    isPending: isPoliciesPending || isAssignablePending,
    isError: isPoliciesError || isAssignableError,
    error: policiesError ?? assignableError,
  }
}

/**
 * Returns a function asking the user to confirm deleting a role. When the
 * user can see who holds the role, the prompt says how many users will lose
 * the access it grants.
 */
export const useConfirmDeleteRole = () => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { hasAllPermissions } = usePermissions()

  const canReadUsers = hasAllPermissions([
    "user:read",
    "rbac_role_assignment:read",
  ])

  return useCallback(
    async (role: Pick<HttpTypes.AdminRbacRole, "id" | "name">) => {
      let userCount = 0

      if (canReadUsers) {
        try {
          const { count } = await sdk.admin.rbacRole.listUsers(role.id, {
            limit: 1,
          })
          userCount = count
        } catch {
          // The count is a courtesy, fall back to the plain prompt without it.
        }
      }

      return prompt({
        title: t("roles.delete.title"),
        description:
          userCount > 0
            ? t("roles.delete.descriptionWithUsers", {
                name: role.name,
                count: userCount,
              })
            : t("roles.delete.description", { name: role.name }),
        confirmText: t("actions.delete"),
        cancelText: t("actions.cancel"),
      })
    },
    [t, prompt, canReadUsers]
  )
}
