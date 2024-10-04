import { Migration } from "@mikro-orm/migrations"

export class Migration20240902195921 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "order_line_item" add column if not exists "is_custom_price" boolean not null default false;'
    )

    this.addSql(
      'alter table if exists "order_shipping_method" add column if not exists "is_custom_amount" boolean not null default false;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "order_line_item" drop column if exists "is_custom_price";'
    )

    this.addSql(
      'alter table if exists "order_shipping_method" drop column if exists "is_custom_amount";'
    )
  }
}
