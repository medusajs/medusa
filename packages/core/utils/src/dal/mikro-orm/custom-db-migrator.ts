import { Constructor } from "@medusajs/types"
import { MikroORM, Utils } from "@medusajs/deps/mikro-orm/core"
import {
  Migrator as BaseMigrator,
  Migration,
  UmzugMigration,
} from "@medusajs/deps/mikro-orm/migrations"
import { isFileDisabled, isFileSkipped } from "../../common/define-file-config"
import { dynamicImport } from "../../common/dynamic-import"

export class CustomDBMigrator extends BaseMigrator {
  static register(orm: MikroORM): void {
    orm.config.registerExtension(
      "@mikro-orm/migrator",
      () => new CustomDBMigrator(orm.em as any)
    )
  }

  resolve(params) {
    require(params.path)
    if (isFileDisabled(params.path)) {
      return {
        name: "Noop",
        up: () => {},
        down: () => {},
      } as any
    }

    const $this = this as any
    const createMigrationHandler = async (method) => {
      const migration = await Utils.dynamicImport(params.path)
      const MigrationClass = Object.values(
        migration
      )[0] as Constructor<Migration>
      const instance = new MigrationClass(
        $this.driver,
        $this.config
      ) as Migration

      const customSchema = $this.config.options.schema
      if (customSchema) {
        const up = instance.up
        const down = instance.down
        instance.up = async function (...args) {
          this.driver.execute(`SET LOCAL search_path TO ${customSchema}`)
          return up.bind(this)(...args)
        }
        instance.down = async function (...args) {
          this.driver.execute(`SET LOCAL search_path TO ${customSchema}`)
          return down.bind(this)(...args)
        }
      }

      await $this.runner.run(instance, method)
    }

    return {
      name: $this.storage.getMigrationName(params.name),
      up: () => createMigrationHandler("up"),
      down: () => createMigrationHandler("down"),
    }
  }

  async getPendingMigrations(): Promise<UmzugMigration[]> {
    const pending = await super.getPendingMigrations()

    // Filter out migrations that are disabled by file config
    return pending.filter(async (pendingFile: UmzugMigration) => {
      const migration = await dynamicImport(pendingFile.path!)
      if (isFileSkipped(migration)) {
        return false
      }

      return true
    })
  }
}
