import * as UserModels from "@models"

import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"

import { EOL } from "os"
import { EntitySchema } from "@mikro-orm/core"
import { Modules } from "@medusajs/modules-sdk"
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

  const { userData } = await import(resolve(process.cwd(), path)).catch((e) => {
    logger?.error(
      `Failed to load seed data from ${path}. Please, provide a relative path and check that you export the following: userData.${EOL}${e}`
    )
    throw e
  })

  const dbData = ModulesSdkUtils.loadDatabaseConfig(Modules.USER, options)!
  const entities = Object.values(UserModels) as unknown as EntitySchema[]
  const pathToMigrations = __dirname + "/../migrations"

  const orm = await DALUtils.mikroOrmCreateConnection(
    dbData,
    entities,
    pathToMigrations
  )

  const manager = orm.em.fork()

  try {
    logger.info("Seeding user data..")

    // TODO: implement user seed data
    // await createUsers(manager, usersData)
  } catch (e) {
    logger.error(
      `Failed to insert the seed data in the PostgreSQL database ${dbData.clientUrl}.${EOL}${e}`
    )
  }

  await orm.close(true)
}
