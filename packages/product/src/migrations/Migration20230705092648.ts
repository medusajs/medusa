import { Migration } from "@mikro-orm/migrations"

export class Migration20230705092648 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "image" ("id" text not null, "url" text not null, "metadata" jsonb null, "deleted_at" timestamptz null, constraint "image_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_product_image_deleted_at" on "image" ("deleted_at");'
    )

    this.addSql(
      'create table "product_images" ("product_id" text not null, "product_image_id" text not null, constraint "product_images_pkey" primary key ("product_id", "product_image_id"));'
    )

    this.addSql(
      'alter table "product_images" add constraint "product_images_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "product_images" add constraint "product_images_product_image_id_foreign" foreign key ("product_image_id") references "image" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'create index "IDX_product_collection_deleted_at" on "product_collection" ("deleted_at");'
    )

    this.addSql(
      'create index "IDX_product_tag_deleted_at" on "product_tag" ("deleted_at");'
    )

    this.addSql(
      'create index "IDX_product_type_deleted_at" on "product_type" ("deleted_at");'
    )

    this.addSql(
      'create index "IDX_product_deleted_at" on "product" ("deleted_at");'
    )

    this.addSql(
      'create index "IDX_product_option_deleted_at" on "product_option" ("deleted_at");'
    )

    this.addSql(
      'alter table "product_variant" alter column "inventory_quantity" type numeric using ("inventory_quantity"::numeric);'
    )
    this.addSql(
      'alter table "product_variant" alter column "inventory_quantity" set default 100;'
    )
    this.addSql(
      'alter table "product_variant" alter column "variant_rank" type numeric using ("variant_rank"::numeric);'
    )
    this.addSql(
      'alter table "product_variant" alter column "variant_rank" set default 0;'
    )
    this.addSql('drop index "IDX_product_variant_product_id_index";')
    this.addSql(
      'create index "IDX_product_variant_deleted_at" on "product_variant" ("deleted_at");'
    )
    this.addSql(
      'create index "IDX_product_variant_product_id" on "product_variant" ("product_id");'
    )
    this.addSql(
      'alter index "idx_product_variant_product_id_index" rename to "IDX_product_variant_product_id";'
    )

    this.addSql('drop index "IDX_product_option_value_product_option";')
    this.addSql(
      'create index "IDX_product_option_value_option_id" on "product_option_value" ("option_id");'
    )
    this.addSql(
      'create index "IDX_product_option_value_variant_id" on "product_option_value" ("variant_id");'
    )
    this.addSql(
      'create index "IDX_product_option_value_deleted_at" on "product_option_value" ("deleted_at");'
    )
    this.addSql(
      'alter index "idx_product_option_value_product_option" rename to "IDX_product_option_value_option_id";'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product_images" drop constraint "product_images_product_image_id_foreign";'
    )

    this.addSql('drop table if exists "image" cascade;')

    this.addSql('drop table if exists "product_images" cascade;')

    this.addSql('drop index "IDX_product_collection_deleted_at";')

    this.addSql('drop index "IDX_product_tag_deleted_at";')

    this.addSql('drop index "IDX_product_type_deleted_at";')

    this.addSql('drop index "IDX_product_deleted_at";')

    this.addSql('drop index "IDX_product_option_deleted_at";')

    this.addSql(
      'alter table "product_variant" alter column "inventory_quantity" drop default;'
    )
    this.addSql(
      'alter table "product_variant" alter column "inventory_quantity" type numeric using ("inventory_quantity"::numeric);'
    )
    this.addSql(
      'alter table "product_variant" alter column "variant_rank" drop default;'
    )
    this.addSql(
      'alter table "product_variant" alter column "variant_rank" type numeric using ("variant_rank"::numeric);'
    )
    this.addSql('drop index "IDX_product_variant_deleted_at";')
    this.addSql('drop index "IDX_product_variant_product_id";')
    this.addSql(
      'create index "IDX_product_variant_product_id_index" on "product_variant" ("product_id");'
    )
    this.addSql(
      'alter index "idx_product_variant_product_id" rename to "IDX_product_variant_product_id_index";'
    )

    this.addSql('drop index "IDX_product_option_value_option_id";')
    this.addSql('drop index "IDX_product_option_value_variant_id";')
    this.addSql('drop index "IDX_product_option_value_deleted_at";')
    this.addSql(
      'create index "IDX_product_option_value_product_option" on "product_option_value" ("option_id");'
    )
    this.addSql(
      'alter index "idx_product_option_value_option_id" rename to "IDX_product_option_value_product_option";'
    )
  }
}
