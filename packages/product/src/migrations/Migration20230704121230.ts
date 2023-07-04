import { Migration } from "@mikro-orm/migrations"

export class Migration20230704121230 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "product_variant" alter column "variant_rank" type numeric using ("variant_rank"::numeric);'
    )
    this.addSql(
      'alter table "product_variant" alter column "variant_rank" set default 0;'
    )

    this.addSql('drop index "IDX_product_option_value_product_option";')
    this.addSql(
      'create index "IDX_product_option_value_option_id" on "product_option_value" ("option_id");'
    )
    this.addSql(
      'alter index "idx_product_option_value_product_option" rename to "IDX_product_option_value_option_id";'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "product_variant" alter column "variant_rank" drop default;'
    )
    this.addSql(
      'alter table "product_variant" alter column "variant_rank" type numeric using ("variant_rank"::numeric);'
    )

    this.addSql('drop index "IDX_product_option_value_option_id";')
    this.addSql(
      'create index "IDX_product_option_value_product_option" on "product_option_value" ("option_id");'
    )
    this.addSql(
      'alter index "idx_product_option_value_option_id" rename to "IDX_product_option_value_product_option";'
    )
  }
}
