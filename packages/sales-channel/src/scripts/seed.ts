import { EOL } from "os"
import { resolve } from "path"
import { EntitySchema, RequiredEntityData } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"

import { LoaderOptions, Logger, ModulesSdkTypes } from "@medusajs/types"
import { DALUtils, ModulesSdkUtils } from "@medusajs/utils"

import * as SalesChannelModels from "@models"

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

  const { salesChannelData } = await import(resolve(process.cwd(), path)).catch(
    (e) => {
      logger?.error(
        `Failed to load seed data from ${path}. Please, provide a relative path and check that you export the following: salesChannelData.${EOL}${e}`
      )
      throw e
    }
  )

  const dbData = ModulesSdkUtils.loadDatabaseConfig("sales-channel", options)!
  const entities = Object.values(
    SalesChannelModels
  ) as unknown as EntitySchema[]
  const pathToMigrations = __dirname + "/../migrations"

  const orm = await DALUtils.mikroOrmCreateConnection(
    dbData,
    entities,
    pathToMigrations
  )

  const manager = orm.em.fork() as unknown as SqlEntityManager

  try {
    logger.info("Inserting sales channel data")

    await createSalesChannels(manager, salesChannelData)
  } catch (e) {
    logger.error(
      `Failed to insert the sales channel seed data in the PostgreSQL database ${dbData.clientUrl}.${EOL}${e}`
    )
  }

  await orm.close(true)
}

async function createSalesChannels(
  manager: SqlEntityManager,
  data: RequiredEntityData<SalesChannelModels.SalesChannel>[]
) {
  const channels = data.map((channel) => {
    return manager.create(SalesChannelModels.SalesChannel, channel)
  })

  await manager.persistAndFlush(channels)

  return channels
}
