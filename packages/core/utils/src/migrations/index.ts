import { MikroORM, MikroORMOptions } from "@mikro-orm/core"
import { MigrationResult } from "@mikro-orm/migrations"

/**
 * Exposes the API to programmatically manage Mikro ORM migrations
 */
export class Migrations {
  #connection?: MikroORM
  #config: MikroORMOptions

  constructor(config: MikroORMOptions) {
    this.#config = config
  }

  /**
   * Returns an existing connection or instantiates a new
   * one
   */
  async #getConnection() {
    if (!this.#connection) {
      this.#connection = await MikroORM.init({
        ...this.#config,
        migrations: {
          ...this.#config.migrations,
          silent: true,
        },
      })
    }

    return this.#connection
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
}
