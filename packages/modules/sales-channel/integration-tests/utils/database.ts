import {TestDatabaseUtils} from "medusa-test-utils"

import * as SalesChannelModels from "@models"

const pathToMigrations = "../../src/migrations"
const mikroOrmEntities = SalesChannelModels as unknown as any[]

export const MikroOrmWrapper = TestDatabaseUtils.getMikroOrmWrapper({
  mikroOrmEntities,
  pathToMigrations,
})

export const MikroOrmConfig = TestDatabaseUtils.getMikroOrmConfig({
  mikroOrmEntities,
  pathToMigrations,
})

export const DB_URL = TestDatabaseUtils.getDatabaseURL()
