import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251121150408 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "notification" add column if not exists "provider_data" jsonb null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "notification" drop column if exists "provider_data";`
    )
  }
}
