import { SchemaObjectRepresentation } from "../types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export async function createPartitions(
  schemaObjectRepresentation: SchemaObjectRepresentation,
  manager: SqlEntityManager
): Promise<void> {
  const partitions = Object.keys(schemaObjectRepresentation)
    .filter(
      (key) =>
        !["_serviceNameModuleConfigMap", "_schemaPropertiesMap"].includes(key)
    )
    .map((key) => {
      const cName = key.toLowerCase()
      const part: string[] = []
      part.push(
        `CREATE TABLE IF NOT EXISTS cat_${cName} PARTITION OF catalog FOR VALUES IN ('${key}')`
      )

      for (const parent of schemaObjectRepresentation[key].parents) {
        const pKey = `${parent.ref.entity}-${key}`
        const pName = `${parent.ref.entity}${key}`.toLowerCase()
        part.push(
          `CREATE TABLE IF NOT EXISTS cat_pivot_${pName} PARTITION OF catalog_relation FOR VALUES IN ('${pKey}')`
        )
      }
      return part
    })
    .flat()

  partitions.push("analyse catalog")
  partitions.push("analyse catalog_relation")

  await manager.execute(partitions.join("; "))
}
