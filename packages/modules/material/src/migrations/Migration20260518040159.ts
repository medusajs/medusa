import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260518040159 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "basic_material" drop constraint if exists "basic_material_code_unique";`);
    this.addSql(`alter table if exists "basic_material" drop constraint if exists "basic_material_material_code_unique";`);
    this.addSql(`create table if not exists "basic_material" ("id" text not null, "material_code" text not null, "material_name" text not null, "spu_code" text null, "material_type" text check ("material_type" in ('finished', 'semi', 'normal', 'box', 'virtual')) not null default 'normal', "category_id" text null, "sn_managed" boolean not null default false, "stock_controlled" boolean not null default true, "tax_rate" real null, "tax_name" text null, "tax_code" text null, "omnichannel" boolean not null default false, "o2o_enabled" boolean not null default false, "color" text null, "size" text null, "source" text check ("source" in ('local', 'api')) not null default 'local', "org_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "basic_material_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_basic_material_material_code_unique" ON "basic_material" ("material_code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_basic_material_deleted_at" ON "basic_material" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_basic_material_code_unique" ON "basic_material" ("material_code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_basic_material_spu_code" ON "basic_material" ("spu_code") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "combo_item" ("id" text not null, "quantity" integer not null default 1, "is_optional" boolean not null default false, "sort_order" integer not null default 0, "parent_material_id" text not null, "child_material_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "combo_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_combo_item_parent_material_id" ON "combo_item" ("parent_material_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_combo_item_child_material_id" ON "combo_item" ("child_material_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_combo_item_deleted_at" ON "combo_item" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_combo_item_parent" ON "combo_item" ("parent_material_id") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "sales_material" ("id" text not null, "shop_id" text not null, "sales_code" text not null, "sales_name" text not null, "sales_type" text check ("sales_type" in ('normal', 'combo', 'gift', 'choice', 'box', 'lucky_bag')) not null default 'normal', "is_bound" boolean not null default false, "customer_class_id" text null, "org_id" text null, "tax_rate" real null, "tax_name" text null, "tax_code" text null, "source" text check ("source" in ('local', 'api')) not null default 'local', "status" text check ("status" in ('active', 'inactive')) not null default 'active', "metadata" jsonb null, "basic_material_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "sales_material_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_sales_material_basic_material_id" ON "sales_material" ("basic_material_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_sales_material_deleted_at" ON "sales_material" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_sales_material_shop_code" ON "sales_material" ("shop_id", "sales_code") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "combo_item" drop constraint if exists "combo_item_parent_material_id_foreign";`);
    this.addSql(`alter table if exists "combo_item" add constraint "combo_item_parent_material_id_foreign" foreign key ("parent_material_id") references "basic_material" ("id") on update cascade;`);
    this.addSql(`alter table if exists "combo_item" drop constraint if exists "combo_item_child_material_id_foreign";`);
    this.addSql(`alter table if exists "combo_item" add constraint "combo_item_child_material_id_foreign" foreign key ("child_material_id") references "basic_material" ("id") on update cascade;`);

    this.addSql(`alter table if exists "sales_material" drop constraint if exists "sales_material_basic_material_id_foreign";`);
    this.addSql(`alter table if exists "sales_material" add constraint "sales_material_basic_material_id_foreign" foreign key ("basic_material_id") references "basic_material" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "combo_item" drop constraint if exists "combo_item_parent_material_id_foreign";`);

    this.addSql(`alter table if exists "combo_item" drop constraint if exists "combo_item_child_material_id_foreign";`);

    this.addSql(`alter table if exists "sales_material" drop constraint if exists "sales_material_basic_material_id_foreign";`);

    this.addSql(`drop table if exists "basic_material" cascade;`);

    this.addSql(`drop table if exists "combo_item" cascade;`);

    this.addSql(`drop table if exists "sales_material" cascade;`);
  }

}
