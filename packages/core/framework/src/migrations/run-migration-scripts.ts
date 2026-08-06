import { MedusaContainer } from "@medusajs/types"
import { dynamicImport, isFileSkipped, Modules } from "@medusajs/utils"
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

        /**
         * In case another process is running in parallel, the migration might
         * have already been completed and therefore the claim will not return
         * a row.
         */
        const claimed = await this.#claimMigration(scriptName)
        if (!claimed) {
          continue
        }

        logger.info(`Running migration script ${script}`)
        try {
          const tracker = this.trackDuration()

          await scriptFn.default({ container: this.container })

          /**
           * The script is only considered executed once it ran to completion.
           * Until `finished_at` is set, the record is treated as pending and
           * the script will be picked up again by the next run.
           */
          await this.#updateMigrationFinishedAt(scriptName)

          logger.info(
            `Migration script ${script} completed (${tracker.getSeconds()}s)`
          )
        } catch (error) {
          logger.error(`Failed to run migration script ${script}:`, error)
          throw error
        }
      }
    } finally {
      await lockService.release(lockKey)
    }
  }

  async getPendingMigrations(migrationPaths: string[]): Promise<string[]> {
    const migrationRecords = await this.getExecutedMigrations()

    /**
     * A script is only considered executed once it has finished running. Scripts
     * that were interrupted (e.g. a deadlock, a crash or a killed process) have
     * a record without a `finished_at` and must be run again.
     */
    const executedMigrations = new Set(
      migrationRecords
        .filter((item) => !!item.finished_at)
        .map((item) => item.script_name)
    )
    const unfinishedMigrations = new Set(
      migrationRecords
        .filter((item) => !item.finished_at)
        .map((item) => item.script_name)
    )

    const all = await this.loadMigrationFiles(migrationPaths)
    const pending = all.filter(
      (item) => !executedMigrations.has(basename(item))
    )

    for (const script of pending) {
      if (unfinishedMigrations.has(basename(script))) {
        logger.warn(
          `Migration script ${script} did not complete during a previous run and will be executed again`
        )
      }
    }

    return pending
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

  /**
   * Atomically claims a migration script before running it.
   *
   * The record is inserted (or re-claimed, in case a previous run was
   * interrupted and left it without a `finished_at`) in a single statement, so
   * that two processes running in parallel can never claim the same script.
   *
   * @param scriptName - The name of the script to claim
   * @returns Whether the script was claimed. `false` means it has already
   * been executed to completion.
   */
  async #claimMigration(scriptName: string): Promise<boolean> {
    const result = await this.pgConnection.raw(
      `INSERT INTO ${this.migration_table_name} (script_name) VALUES (?)
       ON CONFLICT (script_name) DO UPDATE SET created_at = NOW()
       WHERE ${this.migration_table_name}.finished_at IS NULL
       RETURNING id`,
      [scriptName]
    )

    return !!result?.rows?.length
  }

  #updateMigrationFinishedAt(scriptName: string) {
    return this.pgConnection.raw(
      `UPDATE ${this.migration_table_name} SET finished_at = NOW() WHERE script_name = ?`,
      [scriptName]
    )
  }
}
