import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260429163502 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "price_list" add column if not exists "metadata" jsonb null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "price_list" drop column if exists "metadata";`
    )
  }
}
