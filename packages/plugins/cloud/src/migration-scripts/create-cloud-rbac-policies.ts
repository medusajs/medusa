import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ExecArgs } from "@medusajs/framework/types"
import {
  buildPolicies,
  ContainerRegistrationKeys,
  defineFileConfig,
  Modules,
  PolicyOperation,
} from "@medusajs/framework/utils"
import { CLOUD_POLICY_RESOURCE } from "../types/rbac"

/**
 * Creates the policies guarding the plugin's admin routes, so they can be
 * added to roles. Policies that already exist are left untouched.
 */
export default async function createCloudRbacPolicies({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const rbacModule = container.resolve(Modules.RBAC)

  const policies = buildPolicies({
    resource: [CLOUD_POLICY_RESOURCE],
    operation: [PolicyOperation.read, PolicyOperation.update],
  })
  const existing = await rbacModule.listRbacPolicies(
    { key: policies.map((policy) => policy.key) },
    { select: ["key"] }
  )
  const existingKeys = new Set(existing.map((policy) => policy.key))
  const missing = policies.filter((policy) => !existingKeys.has(policy.key))

  if (!missing.length) {
    return
  }

  await rbacModule.createRbacPolicies(missing)

  logger.info(
    `Created cloud RBAC policies: ${missing.map((p) => p.key).join(", ")}`
  )
}

defineFileConfig({
  isDisabled: () => !MedusaModule.isInstalled(Modules.RBAC),
})
