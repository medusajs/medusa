import { MikroORM, MikroORMOptions } from "@medusajs/deps/mikro-orm/core"
import {
  MigrateOptions,
  MigrationResult,
  UmzugMigration,
} from "@medusajs/deps/mikro-orm/migrations"
import {
  defineConfig,
  PostgreSqlDriver,
} from "@medusajs/deps/mikro-orm/postgresql"
import { EventEmitter } from "events"
import { access, mkdir, rename, writeFile } from "fs/promises"
import { dirname, join } from "path"
import { readDir } from "../common"
import { CustomDBMigrator } from "../dal/mikro-orm/custom-db-migrator"

// Define the replacement mappings
const replacements = [
  // MikroORM imports - replace mikro-orm/{subpath} with @medusajs/framework/mikro-orm/{subpath}
  {
    pattern: /from\s+['"]@?mikro-orm\/([^'"]+)['"]/g,
    // eslint-disable-next-line quotes
    replacement: 'from "@medusajs/framework/mikro-orm/$1"',
  },
  // PG imports - replace pg with @medusajs/framework/pg
  {
    pattern: /from\s+['"]pg['"]/g,
    // eslint-disable-next-line quotes
    replacement: 'from "@medusajs/framework/pg"',
  },
]

/**
 * Events emitted by the migrations class
 */
export type MigrationsEvents = {
  migrating: [UmzugMigration]
  migrated: [UmzugMigration]
  reverting: [UmzugMigration]
  reverted: [UmzugMigration]
  "revert:skipped": [UmzugMigration & { reason: string }]
}

/**
 * Exposes the API to programmatically manage Mikro ORM migrations
 */
export class Migrations extends EventEmitter<MigrationsEvents> {
  #configOrConnection: Partial<MikroORMOptions> | MikroORM<PostgreSqlDriver>

  constructor(
    configOrConnection: Partial<MikroORMOptions> | MikroORM<PostgreSqlDriver>
  ) {
    super()
    this.#configOrConnection = configOrConnection
  }

  /**
   * Returns an existing connection or instantiates a new
   * one
   */
  async #getConnection() {
    if ("connect" in this.#configOrConnection) {
      return this.#configOrConnection as MikroORM<PostgreSqlDriver>
    }

    return await MikroORM.init(
      defineConfig({
        ...(this.#configOrConnection as any),
        migrations: {
          ...this.#configOrConnection.migrations,
          silent: true,
        },
        extensions: [CustomDBMigrator],
      })
    )
  }

  /**
   * Generates migrations for a collection of entities defined
   * in the config
   */
  async generate(): Promise<MigrationResult> {
    const connection = await this.#getConnection()
    const migrator = connection.getMigrator()

    try {
      await this.migrateSnapshotFile(migrator["snapshotPath"])
      await this.ensureSnapshot(migrator["snapshotPath"])
      const migrationResult = await migrator.createMigration()
      const code = migrationResult.code
      if (code) {
        let modifiedContent = code
        let wasModified = false

        replacements.forEach(({ pattern, replacement }) => {
          const newContent = modifiedContent.replace(pattern, replacement)
          if (newContent !== modifiedContent) {
            wasModified = true
            modifiedContent = newContent
          }
        })

        if (wasModified) {
          await writeFile(
            join(
              connection.config.getDriver().config.get("migrations").path ?? "",
              migrationResult.fileName
            ),
            modifiedContent,
            "utf-8"
          )
        }
        migrationResult.code = modifiedContent
      }
      return migrationResult
    } finally {
      await connection.close(true)
    }
  }

  /**
   * Run migrations for the provided entities
   */
  async run(
    options?: string | string[] | MigrateOptions
  ): Promise<UmzugMigration[]> {
    const connection = await this.#getConnection()
    const migrator = connection.getMigrator()

    migrator["umzug"].on("migrating", (event: UmzugMigration) =>
      this.emit("migrating", event)
    )
    migrator["umzug"].on("migrated", (event: UmzugMigration) => {
      this.emit("migrated", event)
    })

    try {
      const res = await migrator.up(options)
      return res
    } finally {
      migrator["umzug"].clearListeners()
      await connection.close(true)
    }
  }

  /**
   * Run migrations for the provided entities
   */
  async revert(
    options?: string | string[] | MigrateOptions
  ): Promise<UmzugMigration[]> {
    const connection = await this.#getConnection()
    const migrator = connection.getMigrator()

    migrator["umzug"].on("reverting", (event: UmzugMigration) =>
      this.emit("reverting", event)
    )
    migrator["umzug"].on("reverted", (event: UmzugMigration) => {
      this.emit("reverted", event)
    })

    try {
      return await migrator.down(options)
    } catch (error) {
      /**
       * This is a very ugly hack to recover from an exception thrown by
       * MikrORM when the `down` method is not implemented by the
       * migration.
       *
       * We cannot check if "down" method exists on the migration, because it
       * always exists (as inherited from the parent class). Also, throwing
       * an exception is important, so that Mikro ORM does not consider the
       * given migration as reverted.
       */
      if (
        error?.migration &&
        error?.cause?.message === "This migration cannot be reverted"
      ) {
        this.emit("revert:skipped", {
          ...error.migration,
          reason: "Missing down method",
        })
        return []
      }

      throw error
    } finally {
      migrator["umzug"].clearListeners()
      await connection.close(true)
    }
  }

  /**
   * Migrates the existing snapshot file of a module to follow to be
   * named after the current snapshot file.
   *
   * If there are multiple snapshot files inside the directory, then
   * the first one will be used.
   */
  protected async migrateSnapshotFile(snapshotPath: string): Promise<void> {
    const entries = await readDir(dirname(snapshotPath), {
      ignoreMissing: true,
    })

    /**
     * We assume all JSON files are snapshot files in this directory
     */
    const snapshotFile = entries.find(
      (entry) => entry.isFile() && entry.name.endsWith(".json")
    )

    if (snapshotFile) {
      const absoluteName = join(snapshotFile.parentPath || snapshotFile.path, snapshotFile.name)

      if (absoluteName !== snapshotPath) {
        await rename(absoluteName, snapshotPath)
      }
    }
  }

  /**
   * Generate a default snapshot file if it does not already exists. This
   * prevent from creating a database to manage the migrations and instead
   * rely on the snapshot.
   *
   * @param snapshotPath
   * @protected
   */
  protected async ensureSnapshot(snapshotPath: string): Promise<void> {
    await mkdir(dirname(snapshotPath), { recursive: true })

    const doesFileExists = await access(snapshotPath)
      .then(() => true)
      .catch(() => false)

    if (doesFileExists) {
      return
    }

    const emptySnapshotContent = JSON.stringify(
      {
        tables: [],
        namespaces: [],
      },
      null,
      2
    )

    await writeFile(snapshotPath, emptySnapshotContent, "utf-8")
  }
}
