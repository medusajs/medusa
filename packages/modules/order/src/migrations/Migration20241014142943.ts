import { Migration } from "@mikro-orm/migrations"

export class Migration20241014142943 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "order_item" add column if not exists "compare_at_unit_price" numeric null, add column if not exists "raw_compare_at_unit_price" jsonb null;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "order_item" drop column if exists "compare_at_unit_price";'
    )
    this.addSql(
      'alter table if exists "order_item" drop column if exists "raw_compare_at_unit_price";'
    )
  }
}
