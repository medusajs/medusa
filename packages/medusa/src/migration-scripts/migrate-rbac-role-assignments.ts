import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ExecArgs, IRbacModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
  FeatureFlag,
  Modules,
} from "@medusajs/framework/utils"

/**
 * Legacy actor-role pivot tables.
 */
const LEGACY_LINK_SOURCES = [
  { table: "user_rbac_role", reference: "user", referenceColumn: "user_id" },
  {
    table: "invite_rbac_role",
    reference: "invite",
    referenceColumn: "invite_id",
  },
]

function pairKey(roleId: string, referenceId: string): string {
  return `${roleId}::${referenceId}`
}

export default async function migrateRbacRoleAssignments({
  container,
}: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (!MedusaModule.isInstalled(Modules.RBAC)) {
    logger.info(
      "RBAC module not installed. Skipping role assignment migration."
    )
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const rbacModuleService = container.resolve<IRbacModuleService>(Modules.RBAC)

  for (const source of LEGACY_LINK_SOURCES) {
    const { data } = await query.graph({
      entity: source.table,
      fields: ["rbac_role_id", source.referenceColumn],
    })

    if (!data.length) {
      continue
    }

    const referenceIds = Array.from(
      new Set(data.map((row) => row[source.referenceColumn]))
    )

    const existingAssignments = await rbacModuleService.listRbacRoleAssignments(
      {
        reference: source.reference,
        reference_id: referenceIds,
      }
    )
    const existingPairs = new Set(
      existingAssignments.map((assignment) =>
        pairKey(assignment.role_id, assignment.reference_id)
      )
    )

    const toCreate = data.filter((row) => {
      const lgeacyPair = pairKey(row.rbac_role_id, row[source.referenceColumn])
      if (existingPairs.has(lgeacyPair)) {
        return false
      }
      return true
    })

    if (toCreate.length) {
      await rbacModuleService.createRbacRoleAssignments(
        toCreate.map((row) => ({
          role_id: row.rbac_role_id,
          reference: source.reference,
          reference_id: row[source.referenceColumn],
        }))
      )
    }

    logger.info(
      `Migrated ${toCreate.length} legacy "${source.table}" links to rbac_role_assignment.`
    )
  }
}

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("rbac"),
})
