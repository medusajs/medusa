import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250127144442 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "index_data" add column if not exists "staled_at" timestamptz null;`
    )

    this.addSql(
      `alter table if exists "index_relation" add column if not exists "staled_at" timestamptz null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "index_data" drop column if exists "staled_at";`
    )

    this.addSql(
      `alter table if exists "index_relation" drop column if exists "staled_at";`
    )
  }
}
