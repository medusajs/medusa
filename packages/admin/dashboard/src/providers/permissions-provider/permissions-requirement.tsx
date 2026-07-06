import type { PropsWithChildren } from "react"
import type {
  Permission,
  PermissionOperation,
  PermissionResource,
} from "../../lib/permissions"
import { buildPermission } from "../../lib/permissions"
import { useRegisterPermissions } from "./use-register-permissions"

interface BasePermissionsRequirementProps extends PropsWithChildren {
  /**
   * Optional source label for debugging or display.
   */
  source?: string
  /**
   * Whether registration is enabled.
   */
  enabled?: boolean
}

interface PermissionsRequirementWithPermission
  extends BasePermissionsRequirementProps {
  permission: Permission
  permissions?: never
  resource?: never
  operation?: never
  requireAll?: never
}

interface PermissionsRequirementWithPermissions
  extends BasePermissionsRequirementProps {
  permissions: Permission[]
  requireAll?: boolean
  permission?: never
  resource?: never
  operation?: never
}

interface PermissionsRequirementWithResourceOperation
  extends BasePermissionsRequirementProps {
  resource: PermissionResource
  operation: PermissionOperation
  permission?: never
  permissions?: never
  requireAll?: never
}

export type PermissionsRequirementProps =
  | PermissionsRequirementWithPermission
  | PermissionsRequirementWithPermissions
  | PermissionsRequirementWithResourceOperation

/**
 * Component that registers required permissions for the current subtree.
 */
export const PermissionsRequirement = ({
  children,
  source,
  enabled = true,
  ...props
}: PermissionsRequirementProps) => {
  let permissions: Permission[] | null = null
  let requireAll = false

  if ("permission" in props && props.permission) {
    permissions = [props.permission]
  } else if ("permissions" in props && props.permissions) {
    permissions = props.permissions
    requireAll = !!props.requireAll
  } else if ("resource" in props && "operation" in props) {
    permissions = [buildPermission(props.resource, props.operation)]
  }

  useRegisterPermissions(permissions, {
    requireAll,
    source,
    enabled,
  })

  return <>{children}</>
}
