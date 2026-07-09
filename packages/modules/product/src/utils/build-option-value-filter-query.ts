import { Context, DAL } from "@medusajs/framework/types"
import { raw, SqlEntityManager } from "@medusajs/framework/mikro-orm/postgresql"

/**
 * Builds a query filter to find products that have variants matching
 * at least one option value from each option group.
 *
 * @param optionValueIds - Array of option value IDs to filter by
 * @param sharedContext - Shared Medusa context
 * @returns Filter query object with raw subquery, or null if no valid option groups
 */
export async function buildOptionValueFilterQuery(
  optionValueIds: string[],
  sharedContext?: Context
): Promise<DAL.FilterQuery<any> | null> {
  if (!optionValueIds?.length) {
    return null
  }

  const manager = (sharedContext?.transactionManager ??
    sharedContext?.manager) as SqlEntityManager

  const knex = manager.getKnex()

  const optionGroups = await knex
    .select("option_id")
    .select(knex.raw("array_agg(id) as option_value_ids"))
    .from("product_option_value")
    .whereIn("id", optionValueIds)
    .whereNotNull("option_id")
    .whereNull("deleted_at")
    .groupBy("option_id")

  if (!optionGroups.length) {
    return null
  }

  const optionIds = optionGroups.map(
    (row: { option_id: string }) => row.option_id
  )
  const allValueIds = optionGroups
    .map((row: { option_value_ids: string[] }) => row.option_value_ids)
    .flat()

  const escapeValue = (value: string) => `'${value.replace(/'/g, "''")}'`
  const valueIdsSql = allValueIds.map(escapeValue).join(",")
  const optionIdsSql = optionIds.map(escapeValue).join(",")

  const subquery = (alias: string) =>
    `
    EXISTS (
      SELECT 1
      FROM product_variant pv
      INNER JOIN product_variant_option pvo ON pv.id = pvo.variant_id
      INNER JOIN product_option_value pov ON pvo.option_value_id = pov.id
      WHERE pv.product_id = ${alias}.id
        AND pv.deleted_at IS NULL
        AND pov.deleted_at IS NULL
        AND pvo.option_value_id IN (${valueIdsSql})
        AND pov.option_id IN (${optionIdsSql})
      GROUP BY pv.id
      HAVING COUNT(DISTINCT pov.option_id) = ${optionIds.length}
    )
  `.trim()

  return {
    [raw((alias) => subquery(alias))]: true,
  }
}
