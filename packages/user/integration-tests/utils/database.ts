import * as UserModels from "@models"

import {TestDatabaseUtils} from "medusa-test-utils"

const pathToMigrations = "../../src/migrations"
const mikroOrmEntities = UserModels as unknown as any[]

export const MikroOrmWrapper = TestDatabaseUtils.getMikroOrmWrapper({
  mikroOrmEntities,
  pathToMigrations,
})

export const MikroOrmConfig = TestDatabaseUtils.getMikroOrmConfig({
  mikroOrmEntities,
  pathToMigrations,
})

export const DB_URL = TestDatabaseUtils.getDatabaseURL()
