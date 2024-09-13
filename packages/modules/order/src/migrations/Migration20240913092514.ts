import { Migration } from "@mikro-orm/migrations"

export class Migration20240913092514 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "order_item" add column if not exists "delivered_quantity" numeric not null default 0, add column if not exists "raw_delivered_quantity" jsonb;'
    )

    this.addSql(
      `UPDATE "order_item" SET raw_delivered_quantity = '{"value": "0", "precision": 20}'::jsonb;`
    )

    this.addSql(
      'ALTER TABLE IF EXISTS "order_item" ALTER COLUMN "raw_delivered_quantity" SET NOT NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "order_item" drop column if exists "delivered_quantity";'
    )
    this.addSql(
      'alter table if exists "order_item" drop column if exists "raw_delivered_quantity";'
    )
  }
}
