import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20251015113934 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion" add column if not exists "limit" integer null, add column if not exists "used" integer not null default 0;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion" drop column if exists "limit", drop column if exists "used";`
    )
  }
}
