import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260625000000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "order_line_item_tax_line" add column if not exists "metadata" jsonb null;`
    )
    this.addSql(
      `alter table if exists "order_line_item_tax_line" add column if not exists "data" jsonb null;`
    )
    this.addSql(
      `alter table if exists "order_shipping_method_tax_line" add column if not exists "metadata" jsonb null;`
    )
    this.addSql(
      `alter table if exists "order_shipping_method_tax_line" add column if not exists "data" jsonb null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "order_line_item_tax_line" drop column if exists "data";`
    )
    this.addSql(
      `alter table if exists "order_line_item_tax_line" drop column if exists "metadata";`
    )
    this.addSql(
      `alter table if exists "order_shipping_method_tax_line" drop column if exists "data";`
    )
    this.addSql(
      `alter table if exists "order_shipping_method_tax_line" drop column if exists "metadata";`
    )
  }
}
