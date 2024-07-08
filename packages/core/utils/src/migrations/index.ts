import { EventEmitter } from "events"
import {
  MigrateOptions,
  MigrationResult,
  UmzugMigration,
} from "@mikro-orm/migrations"
import { MikroORM, MikroORMOptions } from "@mikro-orm/core"

/**
 * Events emitted by the migrations class
 */
export type MigrationsEvents = {
  migrating: [
    {
      name: string
      path?: string
      context: object
    }
  ]
  migrated: [
    {
      name: string
      path?: string
      context: object
    }
  ]
}

/**
 * Exposes the API to programmatically manage Mikro ORM migrations
 */
export class Migrations extends EventEmitter<MigrationsEvents> {
  #config: Partial<MikroORMOptions>

  constructor(config: Partial<MikroORMOptions>) {
    super()
    this.#config = config
  }

  /**
   * Returns an existing connection or instantiates a new
   * one
   */
  async #getConnection() {
    return await MikroORM.init({
      ...this.#config,
      migrations: {
        ...this.#config.migrations,
        silent: true,
      },
    })
  }

  /**
   * Generates migrations for a collection of entities defined
   * in the config
   */
  async generate(): Promise<MigrationResult> {
    const connection = await this.#getConnection()
    const migrator = connection.getMigrator()
    try {
      return await migrator.createMigration()
    } finally {
      await connection.close()
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

    migrator["umzug"].on(
      "migrating",
      (event: MigrationsEvents["migrating"][number]) =>
        this.emit("migrating", event)
    )
    migrator["umzug"].on(
      "migrated",
      (event: MigrationsEvents["migrated"][number]) => {
        this.emit("migrated", event)
      }
    )

    try {
      const res = await migrator.up(options)
      return res
    } finally {
      migrator["umzug"].clearListeners()
      await connection.close()
    }
  }
}
