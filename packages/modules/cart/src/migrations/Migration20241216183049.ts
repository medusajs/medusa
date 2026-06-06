import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241216183049 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "cart_line_item_tax_line" alter column "rate" type real using ("rate"::real);'
    )

    this.addSql(
      'alter table if exists "cart_shipping_method_tax_line" alter column "rate" type real using ("rate"::real);'
    )
  }
}
