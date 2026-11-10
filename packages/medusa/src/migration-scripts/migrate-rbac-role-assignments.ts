import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ExecArgs, IRbacModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  defineFileConfig,
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

const PAGE_SIZE = 500

function pairKey(roleId: string, referenceId: string): string {
  return `${roleId}::${referenceId}`
}

/**
 * Creates the assignments of one page of legacy rows that don't exist yet.
 * Returns the number of created assignments.
 */
async function migrateChunk(
  rbacModuleService: IRbacModuleService,
  source: (typeof LEGACY_LINK_SOURCES)[number],
  rows: Record<string, any>[]
): Promise<number> {
  const referenceIds = Array.from(
    new Set(rows.map((row) => row[source.referenceColumn] as string))
  )

  const existingAssignments = await rbacModuleService.listRbacRoleAssignments({
    reference: source.reference,
    reference_id: referenceIds,
  })
  const existingPairs = new Set(
    existingAssignments.map((assignment) =>
      pairKey(assignment.role_id, assignment.reference_id)
    )
  )

  const toCreate = rows.filter(
    (row) =>
      !existingPairs.has(pairKey(row.rbac_role_id, row[source.referenceColumn]))
  )

  if (toCreate.length) {
    await rbacModuleService.createRbacRoleAssignments(
      toCreate.map((row) => ({
        role_id: row.rbac_role_id,
        reference: source.reference,
        reference_id: row[source.referenceColumn],
      }))
    )
  }

  return toCreate.length
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
    let migrated = 0
    let skip = 0

    while (true) {
      const { data } = await query.graph({
        entity: source.table,
        fields: ["rbac_role_id", source.referenceColumn],
        pagination: { take: PAGE_SIZE, skip, order: { id: "ASC" } },
      })

      if (data.length) {
        migrated += await migrateChunk(rbacModuleService, source, data)
      }

      if (data.length < PAGE_SIZE) {
        break
      }
      skip += PAGE_SIZE
    }

    logger.info(
      `Migrated ${migrated} legacy "${source.table}" links to rbac_role_assignment.`
    )
  }
}

defineFileConfig({
  isDisabled: () => !MedusaModule.isInstalled(Modules.RBAC),
})
