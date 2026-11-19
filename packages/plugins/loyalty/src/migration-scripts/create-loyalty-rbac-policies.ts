import { createRbacPoliciesWorkflow } from "@medusajs/medusa/core-flows"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ExecArgs } from "@medusajs/framework/types"
import {
  buildPolicies,
  ContainerRegistrationKeys,
  defineFileConfig,
  Modules,
} from "@medusajs/framework/utils"
import { LOYALTY_POLICY_RESOURCES } from "../types/rbac"

/**
 * Creates the policies guarding the plugin's admin routes, so they can be
 * added to roles. Policies that already exist are left untouched.
 */
export default async function createLoyaltyRbacPolicies({
  container,
}: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const rbacModule = container.resolve(Modules.RBAC)

  const policies = buildPolicies({ resource: LOYALTY_POLICY_RESOURCES })
  const existing = await rbacModule.listRbacPolicies(
    { key: policies.map((policy) => policy.key) },
    { select: ["key"] }
  )
  const existingKeys = new Set(existing.map((policy) => policy.key))
  const missing = policies.filter((policy) => !existingKeys.has(policy.key))

  if (!missing.length) {
    return
  }

  await createRbacPoliciesWorkflow(container).run({
    input: { policies: missing },
  })

  logger.info(
    `Created loyalty RBAC policies: ${missing.map((p) => p.key).join(", ")}`
  )
}

defineFileConfig({
  isDisabled: () => !MedusaModule.isInstalled(Modules.RBAC),
})
