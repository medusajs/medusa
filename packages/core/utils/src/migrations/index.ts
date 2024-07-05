import { MigrationResult } from "@mikro-orm/migrations"
import { MikroORM, MikroORMOptions } from "@mikro-orm/core"

/**
 * Exposes the API to programmatically manage Mikro ORM migrations
 */
export class Migrations {
  #config: Partial<MikroORMOptions>

  constructor(config: Partial<MikroORMOptions>) {
    this.#config = config
  }

  /**
   * Returns an existing connection or instantiates a new
   * one
   */
  async #getConnection() {
    return MikroORM.init({
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
}
