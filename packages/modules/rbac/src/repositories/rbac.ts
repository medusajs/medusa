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
      WITH RECURSIVE role_hierarchy AS (
        SELECT id, name, id as original_role_id, ARRAY[id] as path
        FROM rbac_role
        WHERE id IN (${placeholders}) AND deleted_at IS NULL
        
        UNION ALL
        
        SELECT r.id, r.name, rh.original_role_id, rh.path || r.id
        FROM rbac_role r
        INNER JOIN rbac_role_parent ri ON ri.parent_id = r.id
        INNER JOIN role_hierarchy rh ON rh.id = ri.role_id
        WHERE r.deleted_at IS NULL 
          AND ri.deleted_at IS NULL
          AND NOT (r.id = ANY(rh.path))
      )
      SELECT DISTINCT
        rh.original_role_id,
        p.id,
        p.key,
        p.resource,
        p.operation,
        p.name,
        p.description,
        p.metadata,
        p.created_at,
        p.updated_at,
        CASE WHEN rp.role_id = rh.original_role_id THEN NULL ELSE rp.role_id END as inherited_from_role_id
      FROM rbac_policy p
      INNER JOIN rbac_role_policy rp ON rp.policy_id = p.id
      INNER JOIN role_hierarchy rh ON rh.id = rp.role_id
      WHERE p.deleted_at IS NULL AND rp.deleted_at IS NULL
      ORDER BY rh.original_role_id, p.resource, p.operation, p.key
    `

    const result = await knex.raw(query, roleIds)
    const rows = result.rows || []

    // Group policies by role_id
    const policiesByRole = new Map<string, any[]>()

    for (const row of rows) {
      const roleId = row.original_role_id
      delete row.original_role_id

      if (!policiesByRole.has(roleId)) {
        policiesByRole.set(roleId, [])
      }

      policiesByRole.get(roleId)!.push(row)
    }

    return policiesByRole
  }

  async checkForCycle(
    roleId: string,
    parentId: string,
    sharedContext: Context = {}
  ): Promise<boolean> {
    const manager = this.getActiveManager<SqlEntityManager>(sharedContext)
    const knex = manager.getKnex()

    // Check if adding this parent would create a circular dependency
    // A cycle exists if role_id is already an ancestor of parent_id
    // (i.e., if we traverse up from parent_id, we reach role_id)
    const query = `
      WITH RECURSIVE role_hierarchy AS (
        SELECT id, ARRAY[id] as path
        FROM rbac_role
        WHERE id = ? AND deleted_at IS NULL
        
        UNION ALL
        
        SELECT r.id, rh.path || r.id
        FROM role_hierarchy rh
        INNER JOIN rbac_role_parent ri ON ri.role_id = rh.id
        INNER JOIN rbac_role r ON r.id = ri.parent_id
        WHERE r.deleted_at IS NULL 
          AND ri.deleted_at IS NULL
          AND NOT (r.id = ANY(rh.path))
      )
      SELECT EXISTS(
        SELECT 1 FROM role_hierarchy WHERE id = ?
      ) as has_cycle
    `

    const result = await knex.raw(query, [parentId, roleId])
    return result.rows[0]?.has_cycle || false
  }
}
