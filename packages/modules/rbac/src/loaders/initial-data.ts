import {
  InferEntityType,
  LoaderOptions,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import {
  RBAC_SUPER_ADMIN_POLICY_ID,
  RBAC_SUPER_ADMIN_ROLE_ID,
  WILDCARD,
} from "@medusajs/framework/utils"
import { RbacPolicy, RbacRole, RbacRolePolicy } from "@models"

export default async ({
  container,
  options,
}: LoaderOptions<
  | ModulesSdkTypes.ModuleServiceInitializeOptions
  | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  const rbacRoleService = container.resolve(
    "rbacRoleService"
  ) as ModulesSdkTypes.IMedusaInternalService<InferEntityType<typeof RbacRole>>

  const rbacPolicyService = container.resolve(
    "rbacPolicyService"
  ) as ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof RbacPolicy>
  >

  const rbacRolePolicyService = container.resolve(
    "rbacRolePolicyService"
  ) as ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof RbacRolePolicy>
  >

  // Create super admin role
  const role = await rbacRoleService.upsert({
    id: RBAC_SUPER_ADMIN_ROLE_ID,
    name: "Super Admin",
    description:
      "Super admin role with full access to all resources and operations",
  })

  const policy = await rbacPolicyService.upsert({
    id: RBAC_SUPER_ADMIN_POLICY_ID,
    key: `${WILDCARD}:${WILDCARD}`,
    resource: WILDCARD,
    operation: WILDCARD,
    name: "Super Admin",
    description:
      "Super admin policy with full access to all resources and operations",
  })

  await rbacRolePolicyService.upsert({
    id: "rlpl_super_admin",
    role_id: role.id,
    policy_id: policy.id,
  })
}
