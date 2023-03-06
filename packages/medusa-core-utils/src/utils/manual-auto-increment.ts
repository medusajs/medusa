import path from "path"
import { getConnection } from "typeorm"
import getConfigFile from "../get-config-file"

// TODO: remove
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
