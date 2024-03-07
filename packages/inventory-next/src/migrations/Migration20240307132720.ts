import { Migration } from '@mikro-orm/migrations';

export class Migration20240307132720 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "inventory_item" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "sku" text null, "origin_country" text null, "hs_code" text null, "mid_code" text null, "material" text null, "weight" int null, "length" int null, "height" int null, "width" int null, "requires_shipping" boolean not null default true, "description" text null, "title" text null, "thumbnail" text null, "metadata" jsonb null, constraint "inventory_item_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_inventory_item_deleted_at" ON "inventory_item" (deleted_at) WHERE deleted_at IS NOT NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_inventory_item_sku_unique" ON "inventory_item" (sku);');

    this.addSql('create table if not exists "inventory_level" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "inventory_item_id" text not null, "location_id" text not null, "stocked_quantity" int not null default 0, "reserved_quantity" int not null default 0, "incoming_quantity" int not null default 0, "metadata" jsonb null, constraint "inventory_level_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_inventory_level_deleted_at" ON "inventory_level" (deleted_at) WHERE deleted_at IS NOT NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_inventory_level_inventory_item_id" ON "inventory_level" (inventory_item_id);');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_inventory_level_location_id" ON "inventory_level" (location_id);');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_inventory_level_location_id" ON "inventory_level" (location_id);');

    this.addSql('create table if not exists "reservation_item" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "line_item_id" text null, "location_id" text not null, "quantity" integer not null, "external_id" text null, "description" text null, "created_by" text null, "metadata" jsonb null, "inventory_item_id" text not null, constraint "reservation_item_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_reservation_item_deleted_at" ON "reservation_item" (deleted_at) WHERE deleted_at IS NOT NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_reservation_item_line_item_id" ON "reservation_item" (line_item_id);');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_reservation_item_location_id" ON "reservation_item" (location_id);');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_reservation_item_inventory_item_id" ON "reservation_item" (inventory_item_id);');

    this.addSql('alter table if exists "inventory_level" add constraint "inventory_level_inventory_item_id_foreign" foreign key ("inventory_item_id") references "inventory_item" ("id") on update cascade on delete cascade;');

    this.addSql('alter table if exists "reservation_item" add constraint "reservation_item_inventory_item_id_foreign" foreign key ("inventory_item_id") references "inventory_item" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "inventory_level" drop constraint if exists "inventory_level_inventory_item_id_foreign";');

    this.addSql('alter table if exists "reservation_item" drop constraint if exists "reservation_item_inventory_item_id_foreign";');

    this.addSql('drop table if exists "inventory_item" cascade;');

    this.addSql('drop table if exists "inventory_level" cascade;');

    this.addSql('drop table if exists "reservation_item" cascade;');
  }

}
