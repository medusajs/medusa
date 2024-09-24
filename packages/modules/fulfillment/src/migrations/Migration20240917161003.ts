import { Migration } from "@mikro-orm/migrations"

export class Migration20240917161003 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "fulfillment" add column if not exists "requires_shipping" boolean not null default true;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "fulfillment" drop column if exists "requires_shipping";'
    )
  }
}
