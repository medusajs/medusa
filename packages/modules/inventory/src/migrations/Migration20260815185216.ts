import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260815185216 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "inventory_item" add column if not exists "unit_of_measure" text null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "inventory_item" drop column if exists "unit_of_measure";`
    )
  }
}
