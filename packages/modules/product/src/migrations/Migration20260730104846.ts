import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260730104846 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_product_product_option_value_product_product_option_id_fk" ON "product_product_option_value" ("product_product_option_id");`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `drop index if exists "IDX_product_product_option_value_product_product_option_id_fk";`
    )
  }
}
