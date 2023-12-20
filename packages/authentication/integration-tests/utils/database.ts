import { TestDatabaseUtils } from "medusa-test-utils"

import * as AuthenticationModels from "@models"

const pathToMigrations = "../../src/migrations"
const mikroOrmEntities = AuthenticationModels as unknown as any[]

export const MikroOrmWrapper = TestDatabaseUtils.getMikroOrmWrapper(
  mikroOrmEntities,
  pathToMigrations
)

export const MikroOrmConfig = TestDatabaseUtils.getMikroOrmConfig(
  mikroOrmEntities,
  pathToMigrations
)

export const DB_URL = TestDatabaseUtils.getDatabaseURL()
