import { TestUtils } from "@medusajs/utils"
import * as PricingModels from "@models"

const pathToMigrations = "../../src/migrations"
const mikroOrmEntities = PricingModels as unknown as any[]

export const MikroOrmWrapper = TestUtils.getMikroOrmWrapper(
  mikroOrmEntities,
  pathToMigrations
)

export const MikroOrmConfig = TestUtils.getMikroOrmConfig(
  mikroOrmEntities,
  pathToMigrations
)
