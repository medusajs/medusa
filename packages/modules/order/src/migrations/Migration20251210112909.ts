import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251210112909 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "order" add column if not exists "locale" text null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "order" drop column if exists "locale";`)
  }
}
