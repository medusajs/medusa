import { getConfigFile } from "medusa-core-utils"
import path from "path"
import { getConnection } from "typeorm"

export async function manualAutoIncrement(
  tableName: string
): Promise<number | null> {
  const { configModule } = getConfigFile(
    path.resolve("."),
    `medusa-config`
  ) as any

  const dbType = configModule?.projectConfig?.database_type || "postgres"

  if (dbType === "sqlite") {
    const connection = getConnection()
    const [rec] = await connection.query(
      `SELECT MAX(rowid) as mr FROM "${tableName}"`
    )

    let mr = 0
    if (rec && rec.mr) {
      mr = rec.mr
    }
    return mr + 1
  }

  return null
}
