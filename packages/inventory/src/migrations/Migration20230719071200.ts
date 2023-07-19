import { Migration } from "@mikro-orm/migrations"

export class Migration20230719071200 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table "inventory_item" (
        "id" text not null, 
        "created_at" timestamptz not null, 
        "updated_at" timestamptz not null, 
        "deleted_at" timestamptz null, 
        "sku" text null, 
        "origin_country" text null, 
        "hs_code" text null, 
        "mid_code" text null, 
        "material" text null, 
        "weight" numeric null, 
        "length" numeric null, 
        "height" numeric null, 
        "width" numeric null, 
        "requires_shipping" boolean not null default true, 
        "description" text null, 
        "title" text null, 
        "thumbnail" text null, 
        "metadata" jsonb null, 
        constraint "PK_inventory_item_id" primary key ("id"));`
    )
    this.addSql(
      `alter table "inventory_item" add constraint "IDX_inventory_item_sku" unique ("sku");`
    )

    this.addSql(
      `create table "inventory_level" (
        "id" text not null, 
        "created_at" timestamptz not null, 
        "updated_at" timestamptz not null, 
        "deleted_at" timestamptz null, 
        "inventory_item_id" text not null, 
        "location_id" text not null, 
        "stocked_quantity" numeric not null default 0, 
        "reserved_quantity" numeric not null default 0, 
        "incoming_quantity" numeric not null default 0, 
        "metadata" jsonb null, 
        constraint "PK_inventory_level_id" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX "IDX_inventory_level_inventory_item_id" ON "inventory_level" ("inventory_item_id") WHERE deleted_at IS NULL;;`
    )
    this.addSql(
      `CREATE INDEX "IDX_inventory_level_location_id" ON "inventory_level" ("location_id") WHERE deleted_at IS NULL;;`
    )
    this.addSql(
      `alter table "inventory_level" add constraint "IDX_inventory_level_item_id_location_id" unique ("inventory_item_id", "location_id");`
    )

    this.addSql(
      `create table "reservation_item" (
        "id" text not null, 
        "created_at" timestamptz not null, 
        "updated_at" timestamptz not null, 
        "deleted_at" timestamptz not null, 
        "line_item_id" text null, 
        "inventory_item_id" text not null, 
        "location_id" text not null, 
        "quantity" numeric not null, 
        "external_id" text null, 
        "description" text null, 
        "created_by" text null, 
        "metadata" jsonb null, 
        constraint "PK_reservation_item_id" primary key ("id"));`
    )

    this.addSql(
      `CREATE INDEX "IDX_reservation_item_line_item_id" ON "reservation_item" ("line_item_id") WHERE deleted_at IS NULL;;`
    )
    this.addSql(
      `CREATE INDEX "IDX_reservation_item_inventory_item_id" ON "reservation_item" ("inventory_item_id") WHERE deleted_at IS NULL;;`
    )
    this.addSql(
      `CREATE INDEX "IDX_reservation_item_location_id" ON "reservation_item" ("location_id") WHERE deleted_at IS NULL;;`
    )
  }
}
