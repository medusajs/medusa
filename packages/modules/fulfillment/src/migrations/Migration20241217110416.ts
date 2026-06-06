import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations"

export class Migration20241217110416 extends Migration {
  async up(): Promise<void> {
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

    this.addSql(
      'alter table if exists "fulfillment_provider" add column if not exists "created_at" timestamptz not null default now(), add column if not exists "updated_at" timestamptz not null default now(), add column if not exists "deleted_at" timestamptz null;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_provider_deleted_at" ON "fulfillment_provider" (deleted_at) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "shipping_option" drop constraint if exists "shipping_option_shipping_option_type_id_unique";'
    )
    this.addSql('drop index if exists "IDX_shipping_option_provider_id";')
    this.addSql(
      'drop index if exists "IDX_shipping_option_shipping_option_type_id";'
    )

    this.addSql(
      'alter table if exists "fulfillment" drop constraint if exists "fulfillment_delivery_address_id_unique";'
    )
    this.addSql('drop index if exists "IDX_fulfillment_provider_id";')
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_fulfillment_provider_deleted_at";')
    this.addSql(
      'alter table if exists "fulfillment_provider" drop column if exists "created_at";'
    )
    this.addSql(
      'alter table if exists "fulfillment_provider" drop column if exists "updated_at";'
    )
    this.addSql(
      'alter table if exists "fulfillment_provider" drop column if exists "deleted_at";'
    )

    this.addSql(
      'alter table if exists "shipping_option" add constraint "shipping_option_provider_id_foreign" foreign key ("provider_id") references "fulfillment_provider" ("id") on update cascade on delete set null;'
    )
    this.addSql(
      'alter table if exists "shipping_option" add constraint "shipping_option_shipping_option_type_id_foreign" foreign key ("shipping_option_type_id") references "shipping_option_type" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table if exists "shipping_option" add constraint "shipping_option_shipping_option_type_id_unique" unique ("shipping_option_type_id");'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_provider_id" ON "shipping_option" (provider_id) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_shipping_option_type_id" ON "shipping_option" (shipping_option_type_id) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'alter table if exists "fulfillment" add constraint "fulfillment_provider_id_foreign" foreign key ("provider_id") references "fulfillment_provider" ("id") on update cascade on delete set null;'
    )
    this.addSql(
      'alter table if exists "fulfillment" add constraint "fulfillment_delivery_address_id_foreign" foreign key ("delivery_address_id") references "fulfillment_address" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table if exists "fulfillment" add constraint "fulfillment_delivery_address_id_unique" unique ("delivery_address_id");'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_provider_id" ON "fulfillment" (provider_id) WHERE deleted_at IS NULL;'
    )
  }
}
