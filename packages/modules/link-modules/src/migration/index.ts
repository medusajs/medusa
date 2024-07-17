import {
  ModuleJoinerConfig,
  ModuleServiceInitializeOptions,
} from "@medusajs/types"

import { generateEntity } from "../utils"
import { EntitySchema, MikroORM } from "@mikro-orm/core"
import { DatabaseSchema, PostgreSqlDriver } from "@mikro-orm/postgresql"
import {
  arrayDifference,
  DALUtils,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/utils"

/**
 * A list of actions prepared and executed
 * by the "MigrationsExecutionPlanner".
 */
export type PlannerAction =
  | {
      action: "create" | "update" | "notify"
      sql: string
      tableName: string
      entity: EntitySchema
    }
  | {
      action: "noop"
      tableName: string
      entity: EntitySchema
    }
  | {
      action: "delete"
      tableName: string
    }

/**
 * The migrations execution planner creates a plan of SQL queries
 * to be executed to keep link modules database state in sync
 * with the links defined inside the user application.
 */
export class MigrationsExecutionPlanner {
  /**
   * Database options for the module service
   */
  #dbConfig: ReturnType<typeof ModulesSdkUtils.loadDatabaseConfig>

  /**
   * The set of commands that are unsafe to execute automatically when
   * performing "alter table"
   */
  #unsafeSQLCommands = ["alter column", "drop column"]

  /**
   * On-the-fly computed set of entities for the user provided
   * joinerConfig
   */
  #linksEntities: EntitySchema[]

  /**
   * The table that keeps a track of tables generated by the link
   * module.
   */
  protected tableName = "link_module_migrations"

  constructor(
    joinerConfig: ModuleJoinerConfig[],
    options?: ModuleServiceInitializeOptions
  ) {
    this.#dbConfig = ModulesSdkUtils.loadDatabaseConfig("link_modules", options)
    this.#linksEntities = joinerConfig
      .map((config) => {
        if (config.isReadOnlyLink) {
          return
        }
        const [primary, foreign] = config.relationships ?? []
        return generateEntity(config, primary, foreign)
      })
      .filter((entity): entity is EntitySchema => !!entity)
  }

  /**
   * Initializes the ORM using the normalized dbConfig and set
   * of provided entities
   */
  protected async createORM(entities: EntitySchema[] = []) {
    return await DALUtils.mikroOrmCreateConnection(this.#dbConfig, entities, "")
  }

  /**
   * Ensure the table to track link modules migrations
   * exists.
   *
   * @param orm MikroORM
   */
  protected async ensureMigrationsTable(
    orm: MikroORM<PostgreSqlDriver>
  ): Promise<void> {
    await orm.em.getDriver().getConnection().execute(`
      CREATE TABLE IF NOT EXISTS "${this.tableName}" (
        id SERIAL PRIMARY KEY,
        table_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  /**
   * Insert or delete tuple from the migrations table
   *
   * @param orm
   * @param tableName
   * @param action
   * @protected
   */
  protected async trackLinkMigrationsTable(
    orm: MikroORM<PostgreSqlDriver>,
    tableName: string,
    action: "insert" | "delete"
  ) {
    if (action === "insert") {
      await orm.em.getDriver().getConnection().execute(`
        INSERT INTO "${this.tableName}" (table_name) VALUES ('${tableName}')
      `)
    } else if (action === "delete") {
      await orm.em.getDriver().getConnection().execute(`
        DELETE FROM "${this.tableName}" WHERE table_name = '${tableName}')
      `)
    }
  }

  /**
   * Returns an array of table names that have been tracked during
   * the last run. In short, these tables were created by the
   * link modules migrations runner.
   *
   * @param orm MikroORM
   */
  protected async getTrackedLinksTables(
    orm: MikroORM<PostgreSqlDriver>
  ): Promise<string[]> {
    const results = await orm.em.getDriver().getConnection().execute<
      {
        table_name: string
      }[]
    >(`
      SELECT table_name from "${this.tableName}"
    `)

    return results.map((tuple) => tuple.table_name)
  }

  /**
   * Returns the migration plan for a specific link entity.
   */
  protected async getEntityMigrationPlan(
    entity: EntitySchema,
    trackedLinksTables: string[]
  ): Promise<PlannerAction> {
    const tableName = entity.meta.collection
    const orm = await this.createORM([entity])

    const generator = orm.getSchemaGenerator()
    const platform = orm.em.getPlatform()
    const connection = orm.em.getConnection()
    const schemaName = this.#dbConfig.schema || "public"

    /**
     * If the table name for the entity has not been
     * managed by us earlier, then we should create
     * it.
     */
    if (!trackedLinksTables.includes(tableName)) {
      return {
        action: "create",
        tableName,
        entity,
        sql: await generator.getCreateSchemaSQL(),
      }
    }

    /**
     * Pre-fetching information schema from the database and using that
     * as the way to compute the update diff.
     *
     * @note
     * The "loadInformationSchema" mutates the "dbSchema" argument provided
     * to it as the first argument.
     */
    const dbSchema = new DatabaseSchema(platform, schemaName)
    await platform
      .getSchemaHelper?.()
      ?.loadInformationSchema(dbSchema, connection, [
        {
          table_name: tableName,
          schema_name: schemaName,
        },
      ])

    const updateSQL = await generator.getUpdateSchemaSQL({
      fromSchema: dbSchema,
    })

    /**
     * Entity is upto-date and hence we do not have to perform
     * any updates on it.
     */
    if (!updateSQL.length) {
      return {
        action: "noop",
        tableName,
        entity,
      }
    }

    const usesUnsafeCommands = this.#unsafeSQLCommands.some((fragment) => {
      return updateSQL.match(new RegExp(`^.*${fragment}.*$`, "ig"))
    })

    return {
      action: usesUnsafeCommands ? "notify" : "update",
      tableName,
      entity,
      sql: updateSQL,
    }
  }

  /**
   * Creates a plan to executed in order to keep the database state in
   * sync with the user-defined links.
   *
   * This method only creates a plan and does not change the database
   * state. You must call the "executePlan" method for that.
   */
  async createPlan() {
    const orm = await this.createORM()
    await this.ensureMigrationsTable(orm)

    const executionActions: PlannerAction[] = []
    const trackedTables = await this.getTrackedLinksTables(orm)

    /**
     * Looping through the new set of entities and generating
     * execution plan for them
     */
    for (let entity of this.#linksEntities) {
      executionActions.push(
        await this.getEntityMigrationPlan(entity, trackedTables)
      )
    }

    const linksTableNames = this.#linksEntities.map(
      (entity) => entity.meta.collection
    )

    /**
     * Finding the tables to be removed
     */
    const tablesToRemove = arrayDifference(trackedTables, linksTableNames)
    tablesToRemove.forEach((tableToRemove) => {
      executionActions.push({
        action: "delete",
        tableName: tableToRemove,
      })
    })

    return executionActions
  }

  /**
   * From a given planner action, execute the actions
   * @param actionPlan
   */
  async executeActionPlan(actionPlan: PlannerAction[]): Promise<void> {
    const orm = await this.createORM()

    await promiseAll(
      actionPlan.map(async (action) => {
        if (action.action === "noop") {
          return
        }

        if (action.action === "delete") {
          await orm.em.getDriver().getConnection().execute(`
          DROP TABLE IF EXISTS "${action.tableName}"
        `)
          await this.trackLinkMigrationsTable(orm, action.tableName, "delete")
          return
        }

        if (["create", "update"].includes(action.action)) {
          await orm.em.getDriver().getConnection().execute(action.sql)

          if (action.action === "create") {
            await this.trackLinkMigrationsTable(orm, action.tableName, "insert")
          }
        }
      })
    )
  }
}
