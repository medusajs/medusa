import { MedusaContainer } from "@zjedene-medusa/types"
import { dynamicImport, isFileSkipped, Modules } from "@zjedene-medusa/utils"
import { basename } from "path"
import { logger } from "../logger"
import { Migrator } from "./migrator"

export class MigrationScriptsMigrator extends Migrator {
  protected migration_table_name = "script_migrations"

  constructor({ container }: { container: MedusaContainer }) {
    super({ container })
  }

  /**
   * Run the migration scripts
   * @param paths - The paths from which to load the scripts
   */
  async run(paths: string[]): Promise<void> {
    const lockService = this.container.resolve(Modules.LOCKING)

    const lockKey = "migration-scripts-running"
    await lockService.acquire(lockKey, {
      expire: 60 * 60,
    })

    try {
      const scriptPaths = await this.getPendingMigrations(paths)
      for (const script of scriptPaths) {
        const scriptFn = await dynamicImport(script)

        if (isFileSkipped(scriptFn)) {
          continue
        }

        if (!scriptFn.default) {
          throw new Error(
            `Failed to load migration script ${script}. No default export found.`
          )
        }

        const scriptName = basename(script)

        const err = await this.insertMigration([
          { script_name: scriptName },
        ]).catch((e) => e)

        /**
         * In case another processes is running in parallel, the migration might
         * have already been executed and therefore the insert will fail because of the
         * unique constraint.
         */
        if (err) {
          if (err.constraint === "idx_script_name_unique") {
            continue
          }

          throw err
        }

        logger.info(`Running migration script ${script}`)
        try {
          const tracker = this.trackDuration()

          await scriptFn.default({ container: this.container })

          logger.info(
            `Migration script ${script} completed (${tracker.getSeconds()}s)`
          )

          await this.#updateMigrationFinishedAt(scriptName)
        } catch (error) {
          logger.error(`Failed to run migration script ${script}:`, error)
          await this.#deleteMigration(scriptName)
          throw error
        }
      }
    } finally {
      await lockService.release(lockKey)
    }
  }

  async getPendingMigrations(migrationPaths: string[]): Promise<string[]> {
    const executedMigrations = new Set(
      (await this.getExecutedMigrations()).map((item) => item.script_name)
    )
    const all = await this.loadMigrationFiles(migrationPaths)

    return all.filter((item) => !executedMigrations.has(basename(item)))
  }

  protected async createMigrationTable(): Promise<void> {
    await this.pgConnection.raw(`
      CREATE TABLE IF NOT EXISTS ${this.migration_table_name} (
        id SERIAL PRIMARY KEY,
        script_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        finished_at TIMESTAMP WITH TIME ZONE
      );

      CREATE UNIQUE INDEX IF NOT EXISTS idx_script_name_unique ON ${this.migration_table_name} (script_name);
    `)
  }

  #updateMigrationFinishedAt(scriptName: string) {
    return this.pgConnection.raw(
      `UPDATE ${this.migration_table_name} SET finished_at = NOW() WHERE script_name = ?`,
      [scriptName]
    )
  }

  #deleteMigration(scriptName: string) {
    return this.pgConnection.raw(
      `DELETE FROM ${this.migration_table_name} WHERE script_name = ?`,
      [scriptName]
    )
  }
}
