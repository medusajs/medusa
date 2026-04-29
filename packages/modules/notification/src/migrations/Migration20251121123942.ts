import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251121123942 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "notification" add column if not exists "from" text null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "notification" drop column if exists "from";`
    )
  }
}
