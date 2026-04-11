import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251208130704 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "cart" add column if not exists "locale" text null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "cart" drop column if exists "locale";`)
  }
}
