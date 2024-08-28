import { Migration } from "@mikro-orm/migrations"

export class Migration20240827133639 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "return_item" add column if not exists "damaged_quantity" numeric not null default 0, add column if not exists "raw_damaged_quantity" jsonb not null default \'{"value": "0", "precision": 20}\'::jsonb;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "return_item" drop column if exists "damaged_quantity";'
    )
    this.addSql(
      'alter table if exists "return_item" drop column if exists "raw_damaged_quantity";'
    )
  }
}
