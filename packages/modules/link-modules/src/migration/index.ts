import {
  JoinerRelationship,
  LoaderOptions,
  Logger,
  ModuleJoinerConfig,
  ModuleServiceInitializeOptions,
} from "@medusajs/types"
import { generateEntity } from "../utils"

import { arrayDifference, DALUtils, ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema, MikroORM } from "@mikro-orm/core"
import { DatabaseSchema, Table } from "@mikro-orm/postgresql"

const linkMigrationTableName = "link_module_migrations"

export async function ensureLinkMigrationTable(orm: MikroORM<any>) {
  await orm.em.getDriver().getConnection().execute(`
    CREATE TABLE IF NOT EXISTS "${linkMigrationTableName}" (
      id SERIAL PRIMARY KEY,
      table_name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export async function addLinkTableToMigrationTable(
  orm: MikroORM<any>,
  tableName: string
) {
  await orm.em.getDriver().getConnection().execute(`
    INSERT INTO "${linkMigrationTableName}" (table_name) VALUES ('${tableName}')
  `)
}

export async function removeLinkTableToMigrationTable(
  orm: MikroORM<any>,
  tableName: string
) {
  await orm.em.getDriver().getConnection().execute(`
    DELETE FROM "${linkMigrationTableName}" WHERE table_name = '${tableName}'
  `)
}

export async function getExecutionPlan({
  linkJoinerConfigs,
  options,
}: {
  linkJoinerConfigs: ModuleJoinerConfig[]
  options?: ModuleServiceInitializeOptions
}) {
  const linkEntities = linkJoinerConfigs
    .map((config) => {
      if (config.isReadOnlyLink) {
        return
      }
      const [primary, foreign] = config.relationships ?? []
      return generateEntity(config, primary, foreign)
    })
    .filter((entity): entity is EntitySchema => !!entity)

  const dbData = ModulesSdkUtils.loadDatabaseConfig("link_modules", options)
  const mainOrm = await DALUtils.mikroOrmCreateConnection(dbData, [], "")

  await ensureLinkMigrationTable(mainOrm)

  const summary: {
    toCreate: { tableName: string; entity: EntitySchema }[]
    toUpdate: { tableName: string; entity: EntitySchema }[]
    toNotify: { tableName: string; entity: EntitySchema; hintSql: string }[]
    toDelete: { tableName: string }[]
  } = {
    toCreate: [],
    toUpdate: [],
    toDelete: [],
    toNotify: [],
  }

  const allMigratedTables = (
    await mainOrm.em.getDriver().getConnection().execute(`
    SELECT table_name from "${linkMigrationTableName}"
  `)
  ).map((tuple) => tuple.table_name as string)

  const currentEntitiesTableName = linkEntities.map(
    (entity) => entity.meta.collection
  )

  for (const entity of linkEntities) {
    const tableName = entity.meta.collection

    const doesAlreadyExists = allMigratedTables.includes(tableName)

    if (!doesAlreadyExists) {
      summary.toCreate.push({
        entity,
        tableName,
      })
      continue
    }

    const entityOrm = await DALUtils.mikroOrmCreateConnection(
      dbData,
      [entity],
      ""
    )

    try {
      const generator = entityOrm.getSchemaGenerator()
      const platform = entityOrm.em.getPlatform()
      const connection = entityOrm.em.getConnection()
      const schemaName = dbData.schema || "public"
      const schema = new DatabaseSchema(platform, schemaName)
      const table: Table = {
        table_name: tableName,
        schema_name: schemaName,
      }
      await entityOrm.em
        .getPlatform()
        ?.getSchemaHelper?.()
        ?.loadInformationSchema(schema, connection, [table])

      const updateSql = await generator.getUpdateSchemaSQL({
        fromSchema: schema,
      })

      if (!!updateSql.length) {
        const unsafeSqlList = ["alter column", "drop column"]

        const isAutoUpdateSafe = !unsafeSqlList.some((fragment) => {
          return updateSql.match(new RegExp(`^.*${fragment}.*$`, "ig"))
        })

        if (!isAutoUpdateSafe) {
          summary.toNotify.push({
            entity,
            tableName,
            hintSql: updateSql,
          })
        } else {
          summary.toUpdate.push({
            entity,
            tableName,
          })
        }
      }
    } finally {
      await entityOrm.close()
    }
  }

  const tableToRemove = arrayDifference(
    allMigratedTables,
    currentEntitiesTableName
  )

  if (tableToRemove.length) {
    summary.toDelete.push(...tableToRemove.map((tableName) => ({ tableName })))
  }

  return summary
}

export function getMigration(
  joinerConfig: ModuleJoinerConfig,
  serviceName: string,
  primary: JoinerRelationship,
  foreign: JoinerRelationship
) {
  return async function runMigrations(
    {
      options,
      logger,
    }: Pick<
      LoaderOptions<ModuleServiceInitializeOptions>,
      "options" | "logger"
    > = {} as any
  ) {
    logger ??= console as unknown as Logger

    const dbData = ModulesSdkUtils.loadDatabaseConfig("link_modules", options)
    const entity = generateEntity(joinerConfig, primary, foreign)
    const pathToMigrations = __dirname + "/../migrations"

    const orm = await DALUtils.mikroOrmCreateConnection(
      dbData,
      [entity],
      pathToMigrations
    )

    await ensureLinkMigrationTable(orm)

    const tableName = entity.meta.collection

    let hasTable = false
    try {
      await orm.em
        .getConnection()
        .execute(`SELECT 1 FROM "${tableName}" LIMIT 0`)
      hasTable = true
    } catch {}

    const generator = orm.getSchemaGenerator()
    if (hasTable) {
      /* const updateSql = await generator.getUpdateSchemaSQL()
      const entityUpdates = updateSql
        .split(";")
        .map((sql) => sql.trim())
        .filter((sql) =>
          sql.toLowerCase().includes(`alter table "${tableName.toLowerCase()}"`)
        )

      if (entityUpdates.length > 0) {
        try {
          await generator.execute(entityUpdates.join(";"))
          logger.info(`Link module "${serviceName}" migration executed`)
        } catch (error) {
          logger.error(
            `Link module "${serviceName}" migration failed to run - Error: ${error.errros ?? error}`
          )
        }
      } else {
        logger.info(`Skipping "${tableName}" migration.`)
      }*/
      // Note: Temporarily skipping this for handling no logs on the CI. Bring this back if necessary.
      // logger.info(
      //   `Link module('${serviceName}'): Table already exists. Write your own migration if needed.`
      // )
    } else {
      try {
        await generator.createSchema()
        await addLinkTableToMigrationTable(orm, tableName)

        logger.info(`Link module('${serviceName}'): Migration executed`)
      } catch (error) {
        logger.error(
          `Link module('${serviceName}'): Migration failed - Error: ${
            error.errros ?? error
          }`
        )
      }
    }

    await orm.close()
  }
}

export function getRevertMigration(
  joinerConfig: ModuleJoinerConfig,
  serviceName: string,
  primary: JoinerRelationship,
  foreign: JoinerRelationship
) {
  return async function revertMigrations(
    {
      options,
      logger,
    }: Pick<
      LoaderOptions<ModuleServiceInitializeOptions>,
      "options" | "logger"
    > = {} as any
  ) {
    logger ??= console as unknown as Logger

    const dbData = ModulesSdkUtils.loadDatabaseConfig("link_modules", options)
    const entity = generateEntity(joinerConfig, primary, foreign)
    const pathToMigrations = __dirname + "/../migrations"

    const orm = await DALUtils.mikroOrmCreateConnection(
      dbData,
      [entity],
      pathToMigrations
    )

    await ensureLinkMigrationTable(orm)

    try {
      const migrator = orm.getMigrator()
      await migrator.down()
      logger.info(`Link module "${serviceName}" migration executed`)
    } catch (error) {
      logger.error(
        `Link module "${serviceName}" migration failed to run - Error: ${
          error.errros ?? error
        }`
      )
    }

    await orm.close()
  }
}
