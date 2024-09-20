import { SqlEntityManager } from "@mikro-orm/postgresql"
import { schemaObjectRepresentationPropertiesToOmit } from "@types"
import { IndexTypes } from "@medusajs/types"

export async function createPartitions(
  schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation,
  manager: SqlEntityManager
): Promise<void> {
  const activeSchema = manager.config.get("schema")
    ? `"${manager.config.get("schema")}".`
    : ""

  const keys = Object.keys(schemaObjectRepresentation).filter(
    (key) =>
      !schemaObjectRepresentationPropertiesToOmit.includes(key) &&
      schemaObjectRepresentation[key].listeners.length > 0
  )

  for (const key of keys) {
    const cName = key.toLowerCase()
    const part: string[] = []
    part.push(
      `
      CREATE TABLE IF NOT EXISTS ${activeSchema}cat_${cName} PARTITION OF ${activeSchema}index_data FOR VALUES IN ('${key}');
      CREATE INDEX IF NOT EXISTS IDX_index_data_${cName}_data ON ${activeSchema}cat_${cName} USING GIN ("data");
      CREATE INDEX IF NOT EXISTS IDX_index_data_${cName}_id ON ${activeSchema}cat_${cName} ("id");
      CREATE INDEX IF NOT EXISTS IDX_index_data_${cName}_id ON ${activeSchema}cat_${cName} ("name");
      `
    )

    for (const parent of schemaObjectRepresentation[key].parents) {
      const pKey = `${parent.ref.entity}-${key}`
      const pName = `${parent.ref.entity}${key}`.toLowerCase()
      part.push(
        `
        CREATE TABLE IF NOT EXISTS ${activeSchema}cat_pivot_${pName} PARTITION OF ${activeSchema}index_relation FOR VALUES IN ('${pKey}');
        CREATE INDEX IF NOT EXISTS IDX_index_relation_${pName}_pivot_parent_id_child_id ON ${activeSchema}cat_pivot_${pName} ("pivot", "parent_id", "child_id");
        CREATE INDEX IF NOT EXISTS IDX_index_relation_${pName}_pivot_child_id_paren_id ON ${activeSchema}cat_pivot_${pName} ("pivot", "child_id", "parent_id");
        `
      )
    }

    await manager.execute(part.join("; "))
  }

  const partitions = [
    `analyse ${activeSchema}index_data`,
    `analyse ${activeSchema}index_relation`,
  ]

  await manager.execute(partitions.join("; "))
}
