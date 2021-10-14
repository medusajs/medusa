import path from "path"
import { getConfigFile } from "medusa-core-utils"

let dbType

function getDbType() {
  if (!dbType) {
    try {
      const { configModule } = getConfigFile(path.resolve("."), `medusa-config`)
      dbType = configModule.projectConfig.database_type
    } catch (error) {
      // Default to Postgres to allow for e.g. migrations to run
      dbType = "postgres"
    }
  }
}

export function ILikeOperator() {
  getDbType()

  return dbType == "sqlite" ? "LIKE" : "ILIKE"
}
