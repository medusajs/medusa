import { Modules } from "@medusajs/modules-sdk"
import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema } from "@mikro-orm/core"
import * as CustomerModels from "@models"
import { EOL } from "os"
import { resolve } from "path"

export async function run({
  options,
  logger,
  path,
}: Partial<
  Pick<
    LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>,
    "options" | "logger"
  >
> & {
  path: string
}) {
  logger ??= console as unknown as Logger

  logger.info(`Loading seed data from ${path}...`)

  const { customerData } = await import(resolve(process.cwd(), path)).catch(
    (e) => {
      logger?.error(
        `Failed to load seed data from ${path}. Please, provide a relative path and check that you export the following: customerData.${EOL}${e}`
      )
      throw e
    }
  )

  const dbData = ModulesSdkUtils.loadDatabaseConfig(Modules.CUSTOMER, options)!
  const entities = Object.values(CustomerModels) as unknown as EntitySchema[]
  const pathToMigrations = __dirname + "/../migrations"

  const orm = await DALUtils.mikroOrmCreateConnection(
    dbData,
    entities,
    pathToMigrations
  )

  const manager = orm.em.fork()

  try {
    logger.info("Seeding customer data..")

    // TODO: implement customer seed data
    // await createCustomers(manager, customersData)
  } catch (e) {
    logger.error(
      `Failed to insert the seed data in the PostgreSQL database ${dbData.clientUrl}.${EOL}${e}`
    )
  }

  await orm.close(true)
}
