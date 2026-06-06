import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20250822130931 extends Migration {
  override async up(): Promise<void> {
    'alter table if exists "shipping_option" drop constraint if exists "shipping_option_shipping_option_type_id_foreign", add constraint "shipping_option_shipping_option_type_id_foreign" foreign key ("shipping_option_type_id") references "shipping_option_type" ("id") on update cascade;'
  }

  override async down(): Promise<void> {}
}
