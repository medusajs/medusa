import { Migration } from "@mikro-orm/migrations"

export class Migration20240924114005 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'update "tax_rate" set code = default where code is null;'
    )
    this.addSql(
      'alter table if exists "tax_rate" alter column "code" set not null;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "tax_rate" alter column "code" drop not null;'
    )
  }
}
