import { MedusaContainer } from "@zjedene-medusa/types"
import { glob } from "glob"
import { join } from "path"
import { Knex } from "../deps/mikro-orm-knex"
import { logger } from "../logger"
import { ContainerRegistrationKeys } from "../utils"

export class Migrator {
  protected migration_table_name: string

  protected container: MedusaContainer
  protected pgConnection: Knex<any>

  #alreadyLoadedPaths: Map<string, any> = new Map()

  constructor({ container }: { container: MedusaContainer }) {
    this.container = container
    this.pgConnection = this.container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    )
    this.migration_table_name = "mikro_orm_migrations"
  }

  /**
   * Util to track duration using hrtime
   */
  protected trackDuration() {
    const startTime = process.hrtime()
    return {
      getSeconds() {
        const duration = process.hrtime(startTime)
        return (duration[0] + duration[1] / 1e9).toFixed(2)
      },
    }
  }

  async ensureDatabase(): Promise<void> {
    const pgConnection = this.container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    )

    try {
      await pgConnection.raw("SELECT 1 + 1;")
    } catch (error) {
      if (error.code === "3D000") {
        logger.error(
          `Cannot run migrations. ${error.message.replace("error: ", "")}`
        )
        logger.info(`Run command "db:create" to create the database`)
      } else {
        logger.error(error)
      }
      throw error
    }
  }

  async ensureMigrationsTable(): Promise<void> {
    try {
      // Check if table exists
      const tableExists = await this.pgConnection.raw(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = '${this.migration_table_name}'
        );
      `)

      if (!tableExists.rows[0].exists) {
        logger.info(
          `Creating migrations table '${this.migration_table_name}'...`
        )
        await this.createMigrationTable()
        logger.info("Migrations table created successfully")
      }
    } catch (error) {
      logger.error("Failed to ensure migrations table exists:", error)
      throw error
    }
  }

  async getExecutedMigrations(): Promise<{ script_name: string }[]> {
    try {
      const result = await this.pgConnection.raw(
        `SELECT * FROM ${this.migration_table_name}`
      )
      return result.rows
    } catch (error) {
      logger.error("Failed to get executed migrations:", error)
      throw error
    }
  }

  async insertMigration(records: Record<string, any>[]): Promise<void> {
    try {
      const values = records.map((record) => Object.values(record))
      const columns = Object.keys(records[0])

      await this.pgConnection.raw(
        `INSERT INTO ${this.migration_table_name} (${columns.join(
          ", "
        )}) VALUES ${values
          .map(
            (itemValues) =>
              `(${new Array(itemValues.length).fill("?").join(",")})`
          )
          .join(",")}`,
        values.flat()
      )
    } catch (error) {
      logger.error(
        `Failed to update migration table '${this.migration_table_name}':`,
        error
      )
      throw error
    }
  }

  /**
   * Load migration files from the given paths
   *
   * @param paths - The paths to load migration files from
   * @param options - The options for loading migration files
   * @param options.force - Whether to force loading migration files even if they have already been loaded
   * @returns The loaded migration file paths
   */
  async loadMigrationFiles(
    paths: string[],
    { force }: { force?: boolean } = { force: false }
  ): Promise<string[]> {
    const allScripts: string[] = []

    for (const basePath of paths) {
      if (!force && this.#alreadyLoadedPaths.has(basePath)) {
        allScripts.push(...this.#alreadyLoadedPaths.get(basePath))
        continue
      }

      try {
        const scriptFiles = glob.sync("*.{js,ts}", {
          cwd: basePath,
          ignore: ["**/index.{js,ts}", "**/*.d.ts"],
        })
        scriptFiles.sort((a, b) => a.localeCompare(b))

        if (!scriptFiles?.length) {
          continue
        }

        const filePaths = scriptFiles.map((script) => join(basePath, script))
        this.#alreadyLoadedPaths.set(basePath, filePaths)

        allScripts.push(...filePaths)
      } catch (error) {
        logger.error(`Failed to load migration files from ${basePath}:`, error)
        throw error
      }
    }

    return allScripts
  }

  protected async createMigrationTable(): Promise<void> {
    await this.pgConnection.raw(`
      CREATE TABLE IF NOT EXISTS ${this.migration_table_name} (
        id serial PRIMARY KEY,
        name varchar(255),
        executed_at timestamptz DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  run(...args: any[]): Promise<any> {
    throw new Error("Method not implemented")
  }

  getPendingMigrations(migrationPaths: string[]): Promise<string[]> {
    throw new Error("Method not implemented")
  }
}
