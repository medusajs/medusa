import { Migration } from "@mikro-orm/migrations"

export class Migration20230908084538 extends Migration {
  async up(): Promise<void> {
    this.addSql('drop constraint if exists "IDX_product_handle_unique"')
    this.addSql(
      'alter table "product" add constraint "IDX_product_handle_unique" unique ("handle") where deleted_at is null;'
    )

    this.addSql('drop constraint if exists "IDX_product_variant_sku_unique"')
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_sku_unique" unique ("sku") where deleted_at is null;'
    )

    this.addSql(
      'drop constraint if exists "IDX_product_variant_barcode_unique"'
    )
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_barcode_unique" unique ("barcode") where deleted_at is null;'
    )

    this.addSql('drop constraint if exists "IDX_product_variant_ean_unique"')
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_ean_unique" unique ("ean") where deleted_at is null;'
    )

    this.addSql('drop constraint if exists "IDX_product_variant_upc_unique"')
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_upc_unique" unique ("upc") where deleted_at is null;'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop constraint if exists "IDX_product_handle_unique"')
    this.addSql(
      'alter table "product" add constraint "IDX_product_handle_unique" unique ("handle");'
    )

    this.addSql('drop constraint if exists "IDX_product_variant_sku_unique"')
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_sku_unique" unique ("sku");'
    )

    this.addSql(
      'drop constraint if exists "IDX_product_variant_barcode_unique"'
    )
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_barcode_unique" unique ("barcode");'
    )

    this.addSql('drop constraint if exists "IDX_product_variant_ean_unique"')
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_ean_unique" unique ("ean");'
    )

    this.addSql('drop constraint if exists "IDX_product_variant_upc_unique"')
    this.addSql(
      'alter table "product_variant" add constraint "IDX_product_variant_upc_unique" unique ("upc");'
    )
  }
}
