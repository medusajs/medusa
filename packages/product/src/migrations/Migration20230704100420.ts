import { Migration } from "@mikro-orm/migrations"

export class Migration20230704100420 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product_variant" alter column "inventory_quantity" type numeric using ("inventory_quantity"::numeric);'
    )
    this.addSql(
      'alter table "product_variant" alter column "inventory_quantity" set default 100;'
    )
    this.addSql('drop index "IDX_product_variant_product_id_index";')
    this.addSql(
      'create index "IDX_product_variant_product_id" on "product_variant" ("product_id");'
    )
    this.addSql(
      'alter index "idx_product_variant_product_id_index" rename to "IDX_product_variant_product_id";'
    )

    this.addSql(
      'create index "IDX_product_option_value_variant_id" on "product_option_value" ("variant_id");'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product_variant" alter column "inventory_quantity" drop default;'
    )
    this.addSql(
      'alter table "product_variant" alter column "inventory_quantity" type numeric using ("inventory_quantity"::numeric);'
    )
    this.addSql('drop index "IDX_product_variant_product_id";')
    this.addSql(
      'create index "IDX_product_variant_product_id_index" on "product_variant" ("product_id");'
    )
    this.addSql(
      'alter index "idx_product_variant_product_id" rename to "IDX_product_variant_product_id_index";'
    )

    this.addSql('drop index "IDX_product_option_value_variant_id";')
  }
}
