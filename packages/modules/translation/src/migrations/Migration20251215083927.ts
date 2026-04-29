import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251215083927 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "translation" add column if not exists "translated_field_count" integer not null default 0;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "translation" drop column if exists "translated_field_count";`
    )
  }
}
