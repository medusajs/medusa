import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20260629120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion_application_method" add column if not exists "max_value" numeric null, add column if not exists "raw_max_value" jsonb null;`
    )
    this.addSql(
      `alter table if exists "promotion" add column if not exists "is_exclusive" boolean not null default false;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion_application_method" drop column if exists "max_value", drop column if exists "raw_max_value";`
    )
    this.addSql(
      `alter table if exists "promotion" drop column if exists "is_exclusive";`
    )
  }
}
