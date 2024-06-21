import { Migration } from "@mikro-orm/migrations"

export class Migration20240621141533 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "region" add column "is_tax_inclusive" boolean not null default true;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "region" drop column if exists "is_tax_inclusive";'
    )
  }
}
