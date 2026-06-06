import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250508081510 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion" add column if not exists "is_tax_inclusive" boolean not null default false;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "promotion" drop column if exists "is_tax_inclusive";`
    )
  }
}
