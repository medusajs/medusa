import { Migration } from "@mikro-orm/migrations"

export class Migration20240924114005 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "tax_rate" alter column "code" set not null;'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_tax_rate_code" ON "tax_rate" (code) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "tax_rate" alter column "code" drop not null;'
    )
    this.addSql('drop index if exists "IDX_tax_rate_code";')
  }
}
