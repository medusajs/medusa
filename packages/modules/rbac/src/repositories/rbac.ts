import { SqlEntityManager } from "@medusajs/framework/mikro-orm/postgresql"
import { Context } from "@medusajs/framework/types"
import { MikroOrmBase } from "@medusajs/framework/utils"

export class RbacRepository extends MikroOrmBase {
  constructor() {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
  }

  async listPoliciesForRole(
    roleId: string,
    sharedContext: Context = {}
  ): Promise<any[]> {
    const policiesByRole = await this.listPoliciesForRoles(
      [roleId],
      sharedContext
    )
    return policiesByRole.get(roleId) || []
  }

  async listPoliciesForRoles(
    roleIds: string[],
    sharedContext: Context = {}
  ): Promise<Map<string, any[]>> {
    const manager = this.getActiveManager<SqlEntityManager>(sharedContext)
    const knex = manager.getKnex()

    if (!roleIds?.length) {
      return new Map()
    }

    const placeholders = roleIds.map(() => "?").join(",")

    const query = `
      SELECT DISTINCT
        rp.role_id AS role_id,
        p.id,
        p.key,
        p.resource,
        p.operation,
        p.name,
        p.description,
        p.metadata,
        p.created_at,
        p.updated_at
      FROM rbac_policy p
      INNER JOIN rbac_role_policy rp ON rp.policy_id = p.id
      INNER JOIN rbac_role r ON r.id = rp.role_id
      WHERE rp.role_id IN (${placeholders})
        AND r.deleted_at IS NULL
        AND p.deleted_at IS NULL
        AND rp.deleted_at IS NULL
      ORDER BY rp.role_id, p.resource, p.operation, p.key
    `

    const result = await knex.raw(query, roleIds)
    const rows = result.rows || []

    // Group policies by role_id
    const policiesByRole = new Map<string, any[]>()

    for (const row of rows) {
      const roleId = row.role_id
      delete row.role_id

      if (!policiesByRole.has(roleId)) {
        policiesByRole.set(roleId, [])
      }

      policiesByRole.get(roleId)!.push(row)
    }

    return policiesByRole
  }
}
