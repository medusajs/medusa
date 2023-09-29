import { Migration } from "@mikro-orm/migrations"

export class Migration20230908084538 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product" drop constraint if exists "IDX_product_handle_unique"'
    )
    this.addSql(
      'CREATE UNIQUE INDEX "IDX_product_handle_unique" ON product ("handle") where deleted_at is null;'
    )

    this.addSql(
      'alter table "product_variant" drop constraint if exists "IDX_product_variant_sku_unique"'
    )
    this.addSql(
      'CREATE UNIQUE INDEX "IDX_product_variant_sku_unique" ON "product_variant" ("sku") where deleted_at is null;'
    )

    this.addSql(
      'alter table "product_variant" drop constraint if exists "IDX_product_variant_barcode_unique"'
    )
    this.addSql(
      'CREATE UNIQUE INDEX "IDX_product_variant_barcode_unique" ON "product_variant" ("barcode") where deleted_at is null;'
    )

    this.addSql(
      'alter table "product_variant" drop constraint if exists "IDX_product_variant_ean_unique"'
    )
    this.addSql(
      'CREATE UNIQUE INDEX "IDX_product_variant_ean_unique" ON "product_variant" ("ean") where deleted_at is null;'
    )

    this.addSql(
      'alter table "product_variant" drop constraint if exists "IDX_product_variant_upc_unique"'
    )
    this.addSql(
      'CREATE UNIQUE INDEX "IDX_product_variant_upc_unique" ON "product_variant" ("upc") where deleted_at is null;'
    )
  }

  async down(): Promise<void> {
    this.addSql('DROP INDEX IF EXISTS "IDX_product_handle_unique"')
    this.addSql(
      'alter table "product" add constraint "IDX_product_handle_unique" unique ("handle");'
    )

    this.addSql('DROP INDEX IF EXISTS "IDX_product_variant_sku_unique"')
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_sku_unique" unique ("sku");'
    )

    this.addSql('DROP INDEX IF EXISTS "IDX_product_variant_barcode_unique"')
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_barcode_unique" unique ("barcode");'
    )

    this.addSql('DROP INDEX IF EXISTS "IDX_product_variant_ean_unique"')
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_ean_unique" unique ("ean");'
    )

    this.addSql('DROP INDEX IF EXISTS "IDX_product_variant_upc_unique"')
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_upc_unique" unique ("upc");'
    )
  }
}
