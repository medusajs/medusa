import { Migration } from "@mikro-orm/migrations"

export class Migration20230719100648 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table IF NOT EXISTS "product_category" ("id" text not null, "name" text not null, "description" text not null default \'\', "handle" text not null, "mpath" text not null, "is_active" boolean not null default false, "is_internal" boolean not null default false, "rank" numeric not null default 0, "parent_category_id" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "product_category_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_category_path" on "product_category" ("mpath");'
    )

    this.addSql('DROP INDEX IF EXISTS "IDX_product_category_handle";')

    this.addSql(
      'alter table "product_category" ADD CONSTRAINT "IDX_product_category_handle" unique ("handle");'
    )

    this.addSql(
      'create table IF NOT EXISTS "product_collection" ("id" text not null, "title" text not null, "handle" text not null, "metadata" jsonb null, "deleted_at" timestamptz null, constraint "product_collection_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_collection_deleted_at" on "product_collection" ("deleted_at");'
    )
    this.addSql(
      'alter table "product_collection" add constraint "IDX_product_collection_handle_unique" unique ("handle");'
    )

    this.addSql(
      'create table IF NOT EXISTS  "image" ("id" text not null, "url" text not null, "metadata" jsonb null, "deleted_at" timestamptz null, constraint "image_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_image_url" on "image" ("url");'
    )
    this.addSql(
      'create index IF NOT EXISTS  "IDX_product_image_deleted_at" on "image" ("deleted_at");'
    )

    this.addSql(
      'create table IF NOT EXISTS "product_tag" ("id" text not null, "value" text not null, "metadata" jsonb null, "deleted_at" timestamptz null, constraint "product_tag_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_tag_deleted_at" on "product_tag" ("deleted_at");'
    )

    this.addSql(
      'create table IF NOT EXISTS "product_type" ("id" text not null, "value" text not null, "metadata" json null, "deleted_at" timestamptz null, constraint "product_type_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_type_deleted_at" on "product_type" ("deleted_at");'
    )

    this.addSql(
      'create table IF NOT EXISTS "product" ("id" text not null, "title" text not null, "handle" text not null, "subtitle" text null, "description" text null, "is_giftcard" boolean not null default false, "status" text check ("status" in (\'draft\', \'proposed\', \'published\', \'rejected\')) not null, "thumbnail" text null, "weight" text null, "length" text null, "height" text null, "width" text null, "origin_country" text null, "hs_code" text null, "mid_code" text null, "material" text null, "collection_id" text null, "type_id" text null, "discountable" boolean not null default true, "external_id" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "metadata" jsonb null, constraint "product_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_type_id" on "product" ("type_id");'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_deleted_at" on "product" ("deleted_at");'
    )
    this.addSql(
      'alter table "product" add constraint "IDX_product_handle_unique" unique ("handle");'
    )

    this.addSql(
      'create table IF NOT EXISTS "product_option" ("id" text not null, "title" text not null, "product_id" text not null, "metadata" jsonb null, "deleted_at" timestamptz null, constraint "product_option_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_option_product_id" on "product_option" ("product_id");'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_option_deleted_at" on "product_option" ("deleted_at");'
    )

    this.addSql(
      'create table IF NOT EXISTS  "product_tags" ("product_id" text not null, "product_tag_id" text not null, constraint "product_tags_pkey" primary key ("product_id", "product_tag_id"));'
    )

    this.addSql(
      'create table IF NOT EXISTS "product_images" ("product_id" text not null, "image_id" text not null, constraint "product_images_pkey" primary key ("product_id", "image_id"));'
    )

    this.addSql(
      'create table IF NOT EXISTS "product_category_product" ("product_id" text not null, "product_category_id" text not null, constraint "product_category_product_pkey" primary key ("product_id", "product_category_id"));'
    )

    this.addSql(
      'create table IF NOT EXISTS "product_variant" ("id" text not null, "title" text not null, "sku" text null, "barcode" text null, "ean" text null, "upc" text null, "inventory_quantity" numeric not null default 100, "allow_backorder" boolean not null default false, "manage_inventory" boolean not null default true, "hs_code" text null, "origin_country" text null, "mid_code" text null, "material" text null, "weight" numeric null, "length" numeric null, "height" numeric null, "width" numeric null, "metadata" jsonb null, "variant_rank" numeric null default 0, "product_id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "product_variant_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_variant_deleted_at" on "product_variant" ("deleted_at");'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_variant_product_id" on "product_variant" ("product_id");'
    )
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_sku_unique" unique ("sku");'
    )
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_barcode_unique" unique ("barcode");'
    )
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_ean_unique" unique ("ean");'
    )
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_upc_unique" unique ("upc");'
    )

    this.addSql(
      'create table IF NOT EXISTS "product_option_value" ("id" text not null, "value" text not null, "option_id" text not null, "variant_id" text not null, "metadata" jsonb null, "deleted_at" timestamptz null, constraint "product_option_value_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_option_value_option_id" on "product_option_value" ("option_id");'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_option_value_variant_id" on "product_option_value" ("variant_id");'
    )
    this.addSql(
      'create index IF NOT EXISTS "IDX_product_option_value_deleted_at" on "product_option_value" ("deleted_at");'
    )

    this.addSql(
      'alter table "product_category" add constraint "product_category_parent_category_id_foreign" foreign key ("parent_category_id") references "product_category" ("id") on update cascade on delete set null;'
    )

    this.addSql(
      'alter table "product" add constraint "product_collection_id_foreign" foreign key ("collection_id") references "product_collection" ("id") on update cascade on delete set null;'
    )
    this.addSql(
      'alter table "product" add constraint "product_type_id_foreign" foreign key ("type_id") references "product_type" ("id") on update cascade on delete set null;'
    )

    this.addSql(
      'alter table "product_option" add constraint "product_option_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;'
    )

    this.addSql(
      'alter table "product_tags" add constraint "product_tags_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "product_tags" add constraint "product_tags_product_tag_id_foreign" foreign key ("product_tag_id") references "product_tag" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "product_images" add constraint "product_images_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "product_images" add constraint "product_images_image_id_foreign" foreign key ("image_id") references "image" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "product_category_product" add constraint "product_category_product_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "product_category_product" add constraint "product_category_product_product_category_id_foreign" foreign key ("product_category_id") references "product_category" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "product_variant" add constraint "product_variant_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "product_option_value" add constraint "product_option_value_option_id_foreign" foreign key ("option_id") references "product_option" ("id") on update cascade;'
    )
    this.addSql(
      'alter table "product_option_value" add constraint "product_option_value_variant_id_foreign" foreign key ("variant_id") references "product_variant" ("id") on update cascade on delete cascade;'
    )
  }
}
