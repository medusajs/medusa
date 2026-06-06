import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241125090957 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "product" drop constraint if exists "product_status_check";'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_product_category_parent_category_id" ON "product_category" (parent_category_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_product_category_path" ON "product_category" (mpath) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_category_handle_unique" ON "product_category" (handle) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_collection_handle_unique" ON "product_collection" (handle) WHERE deleted_at IS NULL;'
    )

    this.addSql('drop index if exists "IDX_product_image_deleted_at";')
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_image_deleted_at" ON "image" (deleted_at) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_product_image_url" ON "image" (url) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_tag_value_unique" ON "product_tag" (value) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_type_value_unique" ON "product_type" (value) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "product" alter column "status" type text using ("status"::text);'
    )
    this.addSql(
      "alter table if exists \"product\" add constraint \"product_status_check\" check (\"status\" in ('draft', 'proposed', 'published', 'rejected'));"
    )
    this.addSql(
      'alter table if exists "product" alter column "status" set default \'draft\';'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_product_type_id" ON "product" (type_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_product_collection_id" ON "product" (collection_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_handle_unique" ON "product" (handle) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "product_option" alter column "product_id" type text using ("product_id"::text);'
    )
    this.addSql(
      'alter table if exists "product_option" alter column "product_id" set not null;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_product_option_product_id" ON "product_option" (product_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_product_id_title_unique" ON "product_option" (product_id, title) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_product_option_value_option_id" ON "product_option_value" (option_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_option_value_option_id_unique" ON "product_option_value" (option_id, value) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "product_variant" alter column "weight" type integer using ("weight"::integer);'
    )
    this.addSql(
      'alter table if exists "product_variant" alter column "length" type integer using ("length"::integer);'
    )
    this.addSql(
      'alter table if exists "product_variant" alter column "height" type integer using ("height"::integer);'
    )
    this.addSql(
      'alter table if exists "product_variant" alter column "width" type integer using ("width"::integer);'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_product_variant_product_id" ON "product_variant" (product_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_variant_sku_unique" ON "product_variant" (sku) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_variant_barcode_unique" ON "product_variant" (barcode) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_variant_ean_unique" ON "product_variant" (ean) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_variant_upc_unique" ON "product_variant" (upc) WHERE deleted_at IS NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "product" drop constraint if exists "product_status_check";'
    )

    this.addSql(
      'drop index if exists "IDX_product_category_parent_category_id";'
    )
    this.addSql('drop index if exists "IDX_product_category_path";')
    this.addSql('drop index if exists "IDX_category_handle_unique";')

    this.addSql('drop index if exists "IDX_collection_handle_unique";')

    this.addSql('drop index if exists "IDX_image_deleted_at";')
    this.addSql('drop index if exists "IDX_product_image_url";')
    this.addSql(
      'create index if not exists "IDX_product_image_deleted_at" on "image" ("deleted_at");'
    )

    this.addSql('drop index if exists "IDX_tag_value_unique";')

    this.addSql('drop index if exists "IDX_type_value_unique";')

    this.addSql(
      'alter table if exists "product" alter column "status" drop default;'
    )
    this.addSql(
      'alter table if exists "product" alter column "status" type text using ("status"::text);'
    )
    this.addSql(
      "alter table if exists \"product\" add constraint \"product_status_check\" check (\"status\" in ('draft', 'proposed', 'published', 'rejected'));"
    )
    this.addSql('drop index if exists "IDX_product_type_id";')
    this.addSql('drop index if exists "IDX_product_collection_id";')
    this.addSql('drop index if exists "IDX_product_handle_unique";')

    this.addSql(
      'alter table if exists "product_option" alter column "product_id" type text using ("product_id"::text);'
    )
    this.addSql(
      'alter table if exists "product_option" alter column "product_id" drop not null;'
    )
    this.addSql('drop index if exists "IDX_product_option_product_id";')
    this.addSql('drop index if exists "IDX_option_product_id_title_unique";')

    this.addSql('drop index if exists "IDX_product_option_value_option_id";')
    this.addSql('drop index if exists "IDX_option_value_option_id_unique";')

    this.addSql(
      'alter table if exists "product_variant" alter column "weight" type numeric using ("weight"::numeric);'
    )
    this.addSql(
      'alter table if exists "product_variant" alter column "length" type numeric using ("length"::numeric);'
    )
    this.addSql(
      'alter table if exists "product_variant" alter column "height" type numeric using ("height"::numeric);'
    )
    this.addSql(
      'alter table if exists "product_variant" alter column "width" type numeric using ("width"::numeric);'
    )
    this.addSql('drop index if exists "IDX_product_variant_product_id";')
    this.addSql('drop index if exists "IDX_product_variant_sku_unique";')
    this.addSql('drop index if exists "IDX_product_variant_barcode_unique";')
    this.addSql('drop index if exists "IDX_product_variant_ean_unique";')
    this.addSql('drop index if exists "IDX_product_variant_upc_unique";')
  }
}
