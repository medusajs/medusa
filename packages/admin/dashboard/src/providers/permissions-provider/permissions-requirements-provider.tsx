import { PropsWithChildren, useCallback, useMemo, useState } from "react"
import type {
  PermissionRequirement,
  PermissionsRequirementsContextValue,
} from "../../lib/permissions"
import { PermissionsRequirementsContext } from "./permissions-requirements-context"

export const PermissionsRequirementsProvider = ({
  children,
}: PropsWithChildren) => {
  const [requirements, setRequirements] = useState<
    Record<string, PermissionRequirement>
  >({})

  const registerRequiredPermissions = useCallback(
    (id: string, requirement: PermissionRequirement) => {
      setRequirements((prevState) => ({
        ...prevState,
        [id]: requirement,
      }))
    },
    []
  )

  const unregisterRequiredPermissions = useCallback((id: string) => {
    setRequirements((prevState) => {
      const newState = { ...prevState }
      delete newState[id]
      return newState
    })
  }, [])

  const requiredPermissions = useMemo(() => {
    const deduped: PermissionRequirement[] = []
    const seen = new Set<string>()

    for (const requirement of Object.values(requirements)) {
      if (!requirement.permissions.length) {
        continue
      }

      const key = [
        requirement.requireAll ? "all" : "any",
        [...requirement.permissions].sort().join("|"),
        requirement.source || "",
      ].join("::")

      if (seen.has(key)) {
        continue
      }

      seen.add(key)
      deduped.push(requirement)
    }

    return deduped
  }, [requirements])

  const value: PermissionsRequirementsContextValue = useMemo(
    () => ({
      requiredPermissions,
      registerRequiredPermissions,
      unregisterRequiredPermissions,
    }),
    [
      requiredPermissions,
      registerRequiredPermissions,
      unregisterRequiredPermissions,
    ]
  )

  return (
    <PermissionsRequirementsContext.Provider value={value}>
      {children}
    </PermissionsRequirementsContext.Provider>
  )
}
