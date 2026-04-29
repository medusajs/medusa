import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20250226130616 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'alter table if exists "promotion" drop constraint if exists "IDX_promotion_code_unique";'
    )
    this.addSql(`drop index if exists "IDX_promotion_code_unique";`)
    this.addSql(`drop index if exists "IDX_promotion_code";`)
    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_unique_promotion_code" ON "promotion" (code) WHERE deleted_at IS NULL;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`drop index if exists "IDX_unique_promotion_code";`)

    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_promotion_code_unique" ON "promotion" (code) WHERE deleted_at IS NULL;`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_promotion_code" ON "promotion" (code) WHERE deleted_at IS NULL;`
    )
  }
}
