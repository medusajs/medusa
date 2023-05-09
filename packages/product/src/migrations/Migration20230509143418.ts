import { Migration } from '@mikro-orm/migrations';

export class Migration20230509143418 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "product_collection" ("id" text not null, "title" text not null, "handle" text not null, "metadata" jsonb null, "deleted_at" timestamptz null, constraint "product_collection_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS IDX_product_collection_handle_unique ON product_collection (handle) WHERE deleted_at IS NULL;');

    this.addSql('create table "product_tag" ("id" text not null, "value" text not null, "metadata" jsonb null, "deleted_at" timestamptz null, constraint "product_tag_pkey" primary key ("id"));');

    this.addSql('create table "product_type" ("id" text not null, "value" text not null, "metadata" json null, "deleted_at" timestamptz null, constraint "product_type_pkey" primary key ("id"));');

    this.addSql('create table "product" ("id" text not null, "title" text not null, "handle" text not null, "subtitle" text null, "description" text null, "is_giftcard" boolean not null default false, "status" text check ("status" in (\'draft\', \'proposed\', \'published\', \'rejected\')) not null, "thumbnail" text null, "weight" text null, "length" text null, "height" text null, "width" text null, "origin_country" text null, "hs_code" text null, "mid_code" text null, "material" text null, "collection_id" text null, "type_id" text null, "discountable" boolean not null default true, "external_id" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "metadata" jsonb null, constraint "product_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS IDX_product_handle_unique ON product (handle) WHERE deleted_at IS NULL;');

    this.addSql('create table "product_tags" ("product_id" text not null, "product_tag_id" text not null, constraint "product_tags_pkey" primary key ("product_id", "product_tag_id"));');

    this.addSql('create table "product_variant" ("id" text not null, "title" text not null, "sku" text null, "barcode" text null, "ean" text null, "upc" text null, "inventory_quantity" numeric not null, "allow_backorder" boolean not null default false, "manage_inventory" boolean not null default true, "hs_code" text null, "origin_country" text null, "mid_code" text null, "material" text null, "weight" numeric null, "length" numeric null, "height" numeric null, "width" numeric null, "metadata" jsonb null, "variant_rank" numeric null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "product_variant_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS IDX_product_variant_sku_unique ON product_variant (sku) WHERE deleted_at IS NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS IDX_product_variant_barcode_unique ON product_variant (barcode) WHERE deleted_at IS NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS IDX_product_variant_ean_unique ON product_variant (ean) WHERE deleted_at IS NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS IDX_product_variant_upc_unique ON product_variant (upc) WHERE deleted_at IS NULL;');

    this.addSql('alter table "product" add constraint "product_collection_id_foreign" foreign key ("collection_id") references "product_collection" ("id") on update cascade on delete set null;');
    this.addSql('alter table "product" add constraint "product_type_id_foreign" foreign key ("type_id") references "product_type" ("id") on update cascade on delete set null;');

    this.addSql('alter table "product_tags" add constraint "product_tags_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "product_tags" add constraint "product_tags_product_tag_id_foreign" foreign key ("product_tag_id") references "product_tag" ("id") on update cascade on delete cascade;');
  }

}
