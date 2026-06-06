import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250113094144 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table if exists \"promotion\" add column if not exists \"status\" text check (\"status\" in ('draft', 'active', 'inactive')) not null default 'draft';"
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_promotion_status" ON "promotion" (status) WHERE deleted_at IS NULL;'
    )

    // Data Migration
    this.addSql(`UPDATE promotion SET status = 'active';`)
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_promotion_status";')
    this.addSql(
      'alter table if exists "promotion" drop column if exists "status";'
    )
  }
}
