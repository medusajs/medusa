import { Migration } from "@mikro-orm/migrations"

export class Migration20240919092913 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "order" add column if not exists "type" text not null default \'standard\';'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_order_type" ON "order" (type) WHERE deleted_at IS NOT NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_order_type";')
    this.addSql('alter table if exists "order" drop column if exists "type";')
  }
}
