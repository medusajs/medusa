import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250120115059 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "cart" drop constraint if exists "cart_shipping_address_id_unique";'
    )
    this.addSql(
      'alter table if exists "cart" drop constraint if exists "cart_billing_address_id_unique";'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "cart" add constraint "cart_shipping_address_id_unique" unique ("shipping_address_id");'
    )
    this.addSql(
      'alter table if exists "cart" add constraint "cart_billing_address_id_unique" unique ("billing_address_id");'
    )
  }
}
