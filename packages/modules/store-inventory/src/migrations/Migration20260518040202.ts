import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260518040202 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "store_inventory" ("id" text not null, "location_id" text not null, "material_id" text not null, "online_stock" integer not null default 0, "online_reserved" integer not null default 0, "share_stock" integer not null default 0, "share_reserved" integer not null default 0, "in_transit_stock" integer not null default 0, "store_mode" text check ("store_mode" in ('normal', 'discount')) not null default 'normal', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "store_inventory_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_store_inventory_deleted_at" ON "store_inventory" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_store_inventory_location_material" ON "store_inventory" ("location_id", "material_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "store_inventory" cascade;`);
  }

}
