import {
  InferEntityType,
  LoaderOptions,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import { MedusaError, WILDCARD } from "@medusajs/framework/utils"
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

  const role = await rbacRoleService
    .retrieve("role_super_admin")
    .catch((err) => {
      if (MedusaError.isMedusaError(err) && err.type === MedusaError.Types.NOT_FOUND) {
        return rbacRoleService.create({
          id: "role_super_admin",
          name: "Super Admin",
          description:
            "Super admin role with full access to all resources and operations",
        })
      }
      throw err
    })

  const policy = await rbacPolicyService
    .retrieve("rpol_super_admin")
    .catch((err) => {
      if (MedusaError.isMedusaError(err) && err.type === MedusaError.Types.NOT_FOUND) {
        return rbacPolicyService.create({
          id: "rpol_super_admin",
          key: `${WILDCARD}:${WILDCARD}`,
          resource: WILDCARD,
          operation: WILDCARD,
          name: "Super Admin",
          description:
            "Super admin policy with full access to all resources and operations",
        })
      }
      throw err
    })

  await rbacRolePolicyService.retrieve("rlpl_super_admin").catch((err) => {
    if (MedusaError.isMedusaError(err) && err.type === MedusaError.Types.NOT_FOUND) {
      return rbacRolePolicyService.create({
        id: "rlpl_super_admin",
        role_id: role.id,
        policy_id: policy.id,
      })
    }
    throw err
  })
}
