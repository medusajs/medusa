import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241213063611 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop index if exists "IDX_inventory_item_sku_unique";')
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_inventory_item_sku" ON "inventory_item" (sku) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "inventory_level" add column if not exists "raw_stocked_quantity" jsonb not null, add column if not exists "raw_reserved_quantity" jsonb not null, add column if not exists "raw_incoming_quantity" jsonb not null;'
    )
    this.addSql(
      'alter table if exists "inventory_level" alter column "stocked_quantity" type numeric using ("stocked_quantity"::numeric);'
    )
    this.addSql(
      'alter table if exists "inventory_level" alter column "reserved_quantity" type numeric using ("reserved_quantity"::numeric);'
    )
    this.addSql(
      'alter table if exists "inventory_level" alter column "incoming_quantity" type numeric using ("incoming_quantity"::numeric);'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_inventory_level_location_id_inventory_item_id" ON "inventory_level" (inventory_item_id, location_id) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "reservation_item" add column if not exists "allow_backorder" boolean not null default false, add column if not exists "raw_quantity" jsonb not null;'
    )
    this.addSql(
      'alter table if exists "reservation_item" alter column "quantity" type numeric using ("quantity"::numeric);'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_inventory_item_sku";')
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_inventory_item_sku_unique" ON "inventory_item" (sku);'
    )

    this.addSql(
      'alter table if exists "inventory_level" alter column "stocked_quantity" type int using ("stocked_quantity"::int);'
    )
    this.addSql(
      'alter table if exists "inventory_level" alter column "reserved_quantity" type int using ("reserved_quantity"::int);'
    )
    this.addSql(
      'alter table if exists "inventory_level" alter column "incoming_quantity" type int using ("incoming_quantity"::int);'
    )
    this.addSql(
      'drop index if exists "IDX_inventory_level_location_id_inventory_item_id";'
    )
    this.addSql(
      'alter table if exists "inventory_level" drop column if exists "raw_stocked_quantity";'
    )
    this.addSql(
      'alter table if exists "inventory_level" drop column if exists "raw_reserved_quantity";'
    )
    this.addSql(
      'alter table if exists "inventory_level" drop column if exists "raw_incoming_quantity";'
    )

    this.addSql(
      'alter table if exists "reservation_item" alter column "quantity" type integer using ("quantity"::integer);'
    )
    this.addSql(
      'alter table if exists "reservation_item" drop column if exists "allow_backorder";'
    )
    this.addSql(
      'alter table if exists "reservation_item" drop column if exists "raw_quantity";'
    )
  }
}
