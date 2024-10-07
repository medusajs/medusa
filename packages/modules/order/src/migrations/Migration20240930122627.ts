import { Migration } from "@mikro-orm/migrations"

export class Migration20240930122627 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "order_item" add column if not exists "unit_price" numeric null, add column if not exists "raw_unit_price" jsonb null;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "order_item" drop column if exists "unit_price";'
    )
    this.addSql(
      'alter table if exists "order_item" drop column if exists "raw_unit_price";'
    )
  }
}
