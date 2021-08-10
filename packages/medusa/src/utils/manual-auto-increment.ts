import path from "path"
import { getConnection } from "typeorm"
import { getConfigFile } from "medusa-core-utils"

export async function manualAutoIncrement(
  tableName: string
): Promise<number | null> {
  const { configModule } = getConfigFile(path.resolve("."), `medusa-config`)
  const dbType = configModule.projectConfig.database_type
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
