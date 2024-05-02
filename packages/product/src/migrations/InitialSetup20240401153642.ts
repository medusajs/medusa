import { Migration } from '@mikro-orm/migrations';

export class InitialSetup20240315083440 extends Migration {
  async up(): Promise<void> {
    const productTables = await this.execute(
      "select * from information_schema.tables where table_name = 'product' and table_schema = 'public'"
    )

    if (productTables.length > 0) {
      // This is so we can still run the api tests, remove completely once that is not needed
      this.addSql(
        `alter table "product_option_value" alter column "variant_id" drop not null;`
      )
      this.addSql(
        `alter table "product_variant" alter column "inventory_quantity" drop not null;`
      )
      this.addSql(
        `alter table "product_category" add column "deleted_at" timestamptz null;`
      )
    }

    /* --- ENTITY TABLES AND INDICES --- */
    this.addSql('create table if not exists "product" ("id" text not null, "title" text not null, "handle" text not null, "subtitle" text null, "description" text null, "is_giftcard" boolean not null default false, "status" text check ("status" in (\'draft\', \'proposed\', \'published\', \'rejected\')) not null, "thumbnail" text null, "weight" text null, "length" text null, "height" text null, "width" text null, "origin_country" text null, "hs_code" text null, "mid_code" text null, "material" text null, "collection_id" text null, "type_id" text null, "discountable" boolean not null default true, "external_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "metadata" jsonb null, constraint "product_pkey" primary key ("id"));');
    this.addSql('create unique index if not exists "IDX_product_handle_unique" on "product" (handle) where deleted_at is null;')
    this.addSql('create index if not exists "IDX_product_type_id" on "product" ("type_id") where deleted_at is null;');
    this.addSql('create index if not exists "IDX_product_collection_id" on "product" ("collection_id") where deleted_at is null;');
    this.addSql('create index if not exists "IDX_product_deleted_at" on "product" ("deleted_at");');

    this.addSql('create table if not exists "product_variant" ("id" text not null, "title" text not null, "sku" text null, "barcode" text null, "ean" text null, "upc" text null, "inventory_quantity" numeric not null default 100, "allow_backorder" boolean not null default false, "manage_inventory" boolean not null default true, "hs_code" text null, "origin_country" text null, "mid_code" text null, "material" text null, "weight" numeric null, "length" numeric null, "height" numeric null, "width" numeric null, "metadata" jsonb null, "variant_rank" numeric null default 0, "product_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_variant_pkey" primary key ("id"));');
    this.addSql('create unique index if not exists "IDX_product_variant_ean_unique" on "product_variant" (ean) where deleted_at is null;')
    this.addSql('create unique index if not exists "IDX_product_variant_upc_unique" on "product_variant" (upc) where deleted_at is null;')
    this.addSql('create unique index if not exists "IDX_product_variant_sku_unique" on "product_variant" (sku) where deleted_at is null;')
    this.addSql('create unique index if not exists "IDX_product_variant_barcode_unique" on "product_variant" (barcode) where deleted_at is null;')
    this.addSql('create index if not exists "IDX_product_variant_product_id" on "product_variant" ("product_id") where deleted_at is null;');
    this.addSql('create index if not exists "IDX_product_variant_deleted_at" on "product_variant" ("deleted_at");');

    this.addSql('create table if not exists "product_option" ("id" text not null, "title" text not null, "product_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_option_pkey" primary key ("id"));');
    this.addSql('create unique index if not exists "IDX_option_product_id_title_unique" on "product_option" (product_id, title) where deleted_at is null;')
    this.addSql('create index if not exists "IDX_product_option_deleted_at" on "product_option" ("deleted_at");');

    this.addSql('create table if not exists "product_option_value" ("id" text not null, "value" text not null, "option_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_option_value_pkey" primary key ("id"));');
    this.addSql('create unique index if not exists "IDX_option_value_option_id_unique" on "product_option_value" (option_id, value) where deleted_at is null;')
    this.addSql('create index if not exists "IDX_product_option_value_deleted_at" on "product_option_value" ("deleted_at");');

    this.addSql('create table if not exists "image" ("id" text not null, "url" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "image_pkey" primary key ("id"));');
    this.addSql('create index if not exists "IDX_product_image_url" on "image" ("url") where deleted_at is null;');
    this.addSql('create index if not exists "IDX_product_image_deleted_at" on "image" ("deleted_at");');

    this.addSql('create table if not exists "product_tag" ("id" text not null, "value" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_tag_pkey" primary key ("id"));');

    this.addSql('create unique index if not exists "IDX_tag_value_unique" on "product_tag" (value) where deleted_at is null;')
    this.addSql('create index if not exists "IDX_product_tag_deleted_at" on "product_tag" ("deleted_at");');

    this.addSql('create table if not exists "product_type" ("id" text not null, "value" text not null, "metadata" json null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_type_pkey" primary key ("id"));');
    this.addSql('create unique index if not exists "IDX_type_value_unique" on "product_type" (value) where deleted_at is null;')
    this.addSql('create index if not exists "IDX_product_type_deleted_at" on "product_type" ("deleted_at");');

    this.addSql('create table if not exists "product_collection" ("id" text not null, "title" text not null, "handle" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_collection_pkey" primary key ("id"));');
    this.addSql('create unique index if not exists "IDX_collection_handle_unique" on "product_collection" (handle) where deleted_at is null;')
    this.addSql('create index if not exists "IDX_product_collection_deleted_at" on "product_collection" ("deleted_at");');

    this.addSql('create table if not exists "product_category" ("id" text not null, "name" text not null, "description" text not null default \'\', "handle" text not null, "mpath" text not null, "is_active" boolean not null default false, "is_internal" boolean not null default false, "rank" numeric not null default 0, "parent_category_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_category_pkey" primary key ("id"));');
    this.addSql('create unique index if not exists "IDX_category_handle_unique" on "product_category" (handle) where deleted_at is null;')
    this.addSql('create index if not exists "IDX_product_category_path" on "product_category" ("mpath") where deleted_at is null;');
    this.addSql('create index if not exists "IDX_product_category_deleted_at" on "product_collection" ("deleted_at");');
    // TODO: Batch updating composite unique index in MikroORM is faulty. Should be added back when issue has been resolved.
    this.addSql(`drop index if exists "UniqProductCategoryParentIdRank";`)

    /* --- PIVOT TABLES --- */
    this.addSql('create table if not exists "product_tags" ("product_id" text not null, "product_tag_id" text not null, constraint "product_tags_pkey" primary key ("product_id", "product_tag_id"));');
    this.addSql('create table if not exists "product_images" ("product_id" text not null, "image_id" text not null, constraint "product_images_pkey" primary key ("product_id", "image_id"));');
    this.addSql('create table if not exists "product_category_product" ("product_id" text not null, "product_category_id" text not null, constraint "product_category_product_pkey" primary key ("product_id", "product_category_id"));');
    this.addSql('create table if not exists "product_variant_option" ("variant_id" text not null, "option_value_id" text not null, constraint "product_variant_option_pkey" primary key ("variant_id", "option_value_id"));');

    /* --- FOREIGN KEYS AND CONSTRAINTS --- */
    this.addSql('alter table if exists "product" add constraint "product_collection_id_foreign" foreign key ("collection_id") references "product_collection" ("id") on update cascade on delete set null;');
    this.addSql('alter table if exists "product" add constraint "product_type_id_foreign" foreign key ("type_id") references "product_type" ("id") on update cascade on delete set null;');

    this.addSql('alter table if exists "product_variant" add constraint "product_variant_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');

    this.addSql('alter table if exists "product_option" add constraint "product_option_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');

    this.addSql('alter table if exists "product_option_value" add constraint "product_option_value_option_id_foreign" foreign key ("option_id") references "product_option" ("id") on update cascade on delete cascade;');

    this.addSql('alter table if exists "product_variant_option" add constraint "product_variant_option_variant_id_foreign" foreign key ("variant_id") references "product_variant" ("id") on update cascade on delete cascade;');
    this.addSql('alter table if exists "product_variant_option" add constraint "product_variant_option_option_value_id_foreign" foreign key ("option_value_id") references "product_option_value" ("id") on update cascade on delete cascade;');

    this.addSql('alter table if exists "product_images" add constraint "product_images_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table if exists "product_images" add constraint "product_images_image_id_foreign" foreign key ("image_id") references "image" ("id") on update cascade on delete cascade;');

    this.addSql('alter table if exists "product_tags" add constraint "product_tags_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table if exists "product_tags" add constraint "product_tags_product_tag_id_foreign" foreign key ("product_tag_id") references "product_tag" ("id") on update cascade on delete cascade;');

    this.addSql('alter table if exists "product_category_product" add constraint "product_category_product_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table if exists "product_category_product" add constraint "product_category_product_product_category_id_foreign" foreign key ("product_category_id") references "product_category" ("id") on update cascade on delete cascade;');

    this.addSql('alter table if exists "product_category" add constraint "product_category_parent_category_id_foreign" foreign key ("parent_category_id") references "product_category" ("id") on update cascade on delete cascade;');
  }
}
