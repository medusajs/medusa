import { Migration } from "@mikro-orm/migrations"

export class Migration20240821170920 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "return" add column if not exists "created_by" text null;'
    )

    this.addSql(
      'alter table if exists "order_exchange" add column if not exists "created_by" text null;'
    )

    this.addSql(
      'alter table if exists "order_claim" add column if not exists "created_by" text null;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "return" drop column if exists "created_by";'
    )

    this.addSql(
      'alter table if exists "order_exchange" drop column if exists "created_by";'
    )

    this.addSql(
      'alter table if exists "order_claim" drop column if exists "created_by";'
    )
  }
}
