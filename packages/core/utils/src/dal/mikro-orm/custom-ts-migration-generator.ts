import { TSMigrationGenerator } from "@medusajs/deps/mikro-orm/migrations"
import { isString } from "../../common"
import { normalizeMigrationSQL } from "../utils"

const expectedMigrationsImportStatement =
  'import { Migration } from "@medusajs/framework/mikro-orm/migrations"'

export class CustomTsMigrationGenerator extends TSMigrationGenerator {
  // TODO: temporary fix to drop unique constraint before creating unique index
  private dropUniqueConstraintBeforeUniqueIndex(
    sqlPatches: string[],
    sql: string
  ) {
    // DML unique index
    const uniqueIndexName = sql.match(/"IDX_(.+?)_unique"/)?.[1]
    if (!uniqueIndexName) {
      return
    }

    // Add drop unique constraint if it exists, using the same name as index without IDX_ prefix
    const tableName = sql.match(/ON "(.+?)"/)?.[1]
    if (tableName) {
      sqlPatches.push(
        `alter table if exists "${tableName}" drop constraint if exists "${uniqueIndexName}_unique";`
      )
    }
  }

  generateMigrationFile(
    className: string,
    diff: { up: string[]; down: string[] }
  ): string {
    const sqlPatches: string[] = []
    for (const sql of diff.up) {
      this.dropUniqueConstraintBeforeUniqueIndex(sqlPatches, sql)
    }

    for (const sql of sqlPatches) {
      diff.up.unshift(sql)
    }

    let migrationFileContent = super.generateMigrationFile(className, diff)
    migrationFileContent = migrationFileContent
      .replace(
        'import { Migration } from "@mikro-orm/migrations"',
        expectedMigrationsImportStatement
      )
      .replace(
        "import { Migration } from '@mikro-orm/migrations'",
        expectedMigrationsImportStatement
      )
    return migrationFileContent
  }

  createStatement(sql: string, padLeft: number): string {
    if (isString(sql)) {
      sql = normalizeMigrationSQL(sql)
    }

    return super.createStatement(sql, padLeft)
  }
}
