import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250120115002 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "shipping_option" add constraint "shipping_option_provider_id_foreign" foreign key ("provider_id") references "fulfillment_provider" ("id") on update cascade on delete set null;'
    )
    this.addSql(
      'alter table if exists "shipping_option" add constraint "shipping_option_shipping_option_type_id_foreign" foreign key ("shipping_option_type_id") references "shipping_option_type" ("id") on update cascade;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_provider_id" ON "shipping_option" (provider_id) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "fulfillment" add constraint "fulfillment_provider_id_foreign" foreign key ("provider_id") references "fulfillment_provider" ("id") on update cascade on delete set null;'
    )
    this.addSql(
      'alter table if exists "fulfillment" add constraint "fulfillment_delivery_address_id_foreign" foreign key ("delivery_address_id") references "fulfillment_address" ("id") on update cascade on delete set null;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "shipping_option" drop constraint if exists "shipping_option_provider_id_foreign";'
    )
    this.addSql(
      'alter table if exists "shipping_option" drop constraint if exists "shipping_option_shipping_option_type_id_foreign";'
    )

    this.addSql(
      'alter table if exists "fulfillment" drop constraint if exists "fulfillment_provider_id_foreign";'
    )
    this.addSql(
      'alter table if exists "fulfillment" drop constraint if exists "fulfillment_delivery_address_id_foreign";'
    )

    this.addSql('drop index if exists "IDX_shipping_option_provider_id";')
  }
}
