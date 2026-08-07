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
         * The script is skipped when it has already been executed, or when
         * another process is running it right now.
         */
        const claim = await this.#claimMigration(scriptName)
        if (!claim.claimed) {
          if (claim.reason === "running-elsewhere") {
            /**
             * When a previous run died without closing its connection cleanly,
             * Postgres keeps that connection, and the advisory lock it holds,
             * until it detects the half-open connection. Until then the script
             * is reported as running elsewhere. It is picked up again by a
             * later run, once the connection has been reaped.
             */
            logger.info(
              `Skipping migration script ${script}. It is being executed by another process`
            )
          }
          continue
        }

        if (claim.wasInterrupted) {
          logger.warn(
            `Migration script ${script} did not complete during a previous run and is being executed again`
          )
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
        } finally {
          await claim.release()
        }
      }
    } finally {
      await lockService.release(lockKey)
    }
  }

  async getPendingMigrations(migrationPaths: string[]): Promise<string[]> {
    /**
     * A script is only considered executed once it has finished running. Scripts
     * that were interrupted (e.g. a deadlock, a crash or a killed process) have
     * a record without a `finished_at` and must be run again.
     */
    const executedMigrations = new Set(
      (await this.getExecutedMigrations())
        .filter((item) => !!item.finished_at)
        .map((item) => item.script_name)
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

  /**
   * Hashes a string into a signed 32-bit integer, as required by the Postgres
   * advisory lock functions.
   */
  #hashStringToInt(str: string): number {
    let hash = 5381
    for (let i = str.length; i--; ) {
      hash = (hash * 33) ^ str.charCodeAt(i)
    }
    return hash | 0
  }

  /**
   * Claims a migration script before running it.
   *
   * Two guarantees are needed here, and they pull in opposite directions:
   *
   * - A script that was interrupted (deadlock, crash, killed process) must be
   *   picked up again by a later run.
   * - A script that another process is running right now must not be run a
   *   second time in parallel.
   *
   * The database record alone cannot tell those two apart: in both cases the
   * record exists without a `finished_at`. The difference is whether the
   * process that claimed it is still alive, so a session-level advisory lock is
   * held on a dedicated connection for as long as the script runs. Postgres
   * releases that lock by itself once the connection goes away, which is
   * exactly what happens when a process dies, while a live process keeps
   * holding it.
   *
   * @param scriptName - The name of the script to claim
   * @returns The outcome of the claim, and a `release` to call once the script
   * is done.
   */
  async #claimMigration(scriptName: string): Promise<{
    claimed: boolean
    /**
     * Whether a previous run of this script was interrupted before completing.
     */
    wasInterrupted?: boolean
    reason?: "already-executed" | "running-elsewhere"
    release: () => Promise<void>
  }> {
    const lockKey = this.#hashStringToInt(
      `${this.migration_table_name}:${scriptName}`
    )

    const client = this.pgConnection.client
    const connection = await client.acquireConnection()

    let released = false
    const release = async (unlock: boolean) => {
      if (released) {
        return
      }
      released = true

      try {
        if (unlock) {
          await connection.query("SELECT pg_advisory_unlock($1)", [lockKey])
        }
      } finally {
        await client.releaseConnection(connection)
      }
    }

    try {
      /**
       * `pg_try_advisory_lock` never waits. It either takes the lock and
       * returns true, or returns false when someone else is holding it.
       */
      const lock = await connection.query(
        "SELECT pg_try_advisory_lock($1) AS acquired",
        [lockKey]
      )

      if (!lock.rows[0].acquired) {
        await release(false)
        return {
          claimed: false,
          reason: "running-elsewhere",
          release: async () => {},
        }
      }

      /**
       * The lock is held, so no other process can be claiming this script at
       * the same time and the existing record can be read safely.
       */
      const existing = await connection.query(
        `SELECT finished_at FROM ${this.migration_table_name} WHERE script_name = $1`,
        [scriptName]
      )

      const record = existing.rows[0]

      if (record?.finished_at) {
        await release(true)
        return {
          claimed: false,
          reason: "already-executed",
          release: async () => {},
        }
      }

      /**
       * A record without a `finished_at` belongs to a run that was interrupted.
       */
      const wasInterrupted = !!record

      /**
       * The record is inserted, or re-claimed when a previous run left it
       * without a `finished_at`. The `WHERE` clause keeps the statement safe on
       * its own, so a finished record can never be re-claimed by it.
       */
      await connection.query(
        `INSERT INTO ${this.migration_table_name} (script_name) VALUES ($1)
         ON CONFLICT (script_name) DO UPDATE SET created_at = NOW()
         WHERE ${this.migration_table_name}.finished_at IS NULL`,
        [scriptName]
      )

      return { claimed: true, wasInterrupted, release: () => release(true) }
    } catch (error) {
      await release(true)
      throw error
    }
  }

  #updateMigrationFinishedAt(scriptName: string) {
    return this.pgConnection.raw(
      `UPDATE ${this.migration_table_name} SET finished_at = NOW() WHERE script_name = ?`,
      [scriptName]
    )
  }
}
