import { TestDatabaseUtils } from "medusa-test-utils"

import * as WorkflowOrchestratorModels from "@models"

const pathToMigrations = "../../src/migrations"
const mikroOrmEntities = WorkflowOrchestratorModels as unknown as any[]

export const MikroOrmWrapper = TestDatabaseUtils.getMikroOrmWrapper(
  mikroOrmEntities,
  pathToMigrations
)

export const MikroOrmConfig = TestDatabaseUtils.getMikroOrmConfig(
  mikroOrmEntities,
  pathToMigrations
)

export const DB_URL = TestDatabaseUtils.getDatabaseURL()
