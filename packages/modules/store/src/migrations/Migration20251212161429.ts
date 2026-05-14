import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251212161429 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "store_locale" drop column if exists "is_default";`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "store_locale" add column if not exists "is_default" boolean not null default false;`
    )
  }
}
