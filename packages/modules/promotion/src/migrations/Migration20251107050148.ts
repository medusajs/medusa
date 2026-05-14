import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251107050148 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion" add column if not exists "metadata" jsonb null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion" drop column if exists "metadata";`
    )
  }
}
