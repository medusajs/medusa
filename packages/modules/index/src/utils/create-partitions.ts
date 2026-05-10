import { IndexTypes } from "@medusajs/framework/types"
import { SqlEntityManager } from "@medusajs/framework/mikro-orm/postgresql"
import { schemaObjectRepresentationPropertiesToOmit } from "@types"
import { getPivotTableName, normalizeTableName } from "./normalze-table-name"

export async function createPartitions(
  schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation,
  manager: SqlEntityManager
): Promise<void> {
  const activeSchema = manager.config.get("schema")
    ? `"${manager.config.get("schema")}".`
    : ""

  const createdPartitions: Set<string> = new Set()
  const partitions = Object.keys(schemaObjectRepresentation)
    .filter(
      (key) =>
        !schemaObjectRepresentationPropertiesToOmit.includes(key) &&
        schemaObjectRepresentation[key].listeners.length > 0
    )
    .map((key) => {
      const cName = normalizeTableName(key)

      if (createdPartitions.has(cName)) {
        return []
      }
      createdPartitions.add(cName)

      const part: string[] = []
      part.push(
        `CREATE TABLE IF NOT EXISTS ${activeSchema}cat_${cName} PARTITION OF ${activeSchema}index_data FOR VALUES IN ('${key}')`
      )

      for (const parent of schemaObjectRepresentation[key].parents) {
        if (parent.isInverse) {
          continue
        }

        const pName = getPivotTableName(`${parent.ref.entity}${key}`)

        if (createdPartitions.has(pName)) {
          continue
        }
        createdPartitions.add(pName)

        part.push(
          `CREATE TABLE IF NOT EXISTS ${activeSchema}${pName} PARTITION OF ${activeSchema}index_relation FOR VALUES IN ('${parent.ref.entity}-${key}')`
        )
      }
      return part
    })
    .flat()

  if (!partitions.length) {
    return
  }

  await manager.execute(partitions.join("; "))

  // Create indexes for each partition
  const indexCreationCommands = Object.keys(schemaObjectRepresentation)
    .filter(
      (key) =>
        !schemaObjectRepresentationPropertiesToOmit.includes(key) &&
        schemaObjectRepresentation[key].listeners.length > 0
    )
    .map((key) => {
      const cName = normalizeTableName(key)
      const part: string[] = []

      part.push(
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_cat_${cName}_data_gin" ON ${activeSchema}cat_${cName} USING GIN ("data" jsonb_path_ops)`
      )

      part.push(
        `CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_cat_${cName}_id" ON ${activeSchema}cat_${cName} ("id")`
      )

      for (const parent of schemaObjectRepresentation[key].parents) {
        if (parent.isInverse) {
          continue
        }

        const pName = getPivotTableName(`${parent.ref.entity}${key}`)

        part.push(
          `CREATE INDEX CONCURRENTLY IF NOT EXISTS "IDX_${pName}_child_id" ON ${activeSchema}${pName} ("child_id")`
        )
      }

      return part
    })
    .flat()

  for (const cmd of indexCreationCommands) {
    try {
      await manager.execute(cmd)
    } catch (error) {
      console.error(`Failed to create index: ${error.message}`)
    }
  }

  // Create count estimate function
  await manager.execute(`
    CREATE OR REPLACE FUNCTION count_estimate(query text) RETURNS bigint AS $$
    DECLARE
        plan jsonb;
    BEGIN
        EXECUTE 'EXPLAIN (FORMAT JSON) ' || query INTO plan;
        RETURN (plan->0->'Plan'->>'Plan Rows')::bigint;
    END;
    $$ LANGUAGE plpgsql;
  `)
}
