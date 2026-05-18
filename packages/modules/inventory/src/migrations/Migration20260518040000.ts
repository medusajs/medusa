import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260518040000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table if exists "inventory_item" add column if not exists "alert_stock" integer null;`)
    this.addSql(`alter table if exists "inventory_item" add column if not exists "stock_controlled" boolean not null default true;`)
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "inventory_item" drop column if exists "alert_stock";`)
    this.addSql(`alter table if exists "inventory_item" drop column if exists "stock_controlled";`)
  }
}
