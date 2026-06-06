import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241129124827 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "order_address" add column if not exists "deleted_at" timestamptz null;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_order_address_deleted_at" ON "order_address" (deleted_at) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(`
       ALTER TABLE "order_address" DROP COLUMN if exists "deleted_at";
    `)
  }
}
