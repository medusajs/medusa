import { Migration } from '@mikro-orm/migrations';

export class Migration20240215095815 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "fulfillment_address" ("id" text not null, "fulfillment_id" text null, "company" text null, "first_name" text null, "last_name" text null, "address_1" text null, "address_2" text null, "city" text null, "country_code" text null, "province" text null, "postal_code" text null, "phone" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_address_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_address_fulfillment_id" ON "fulfillment_address" (fulfillment_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_address_deleted_at" ON "fulfillment_address" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('create table if not exists "fulfillment_set" ("id" text not null, "name" text not null, "type" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_set_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_fulfillment_set_name_unique" ON "fulfillment_set" (name) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_set_deleted_at" ON "fulfillment_set" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('create table if not exists "service_provider" ("id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "service_provider_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_service_provider_deleted_at" ON "service_provider" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('create table if not exists "service_zone" ("id" text not null, "name" text not null, "metadata" jsonb null, "fulfillment_set_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "service_zone_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_service_zone_name_unique" ON "service_zone" (name) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_service_zone_fulfillment_set_id" ON "service_zone" (fulfillment_set_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_service_zone_deleted_at" ON "service_zone" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('create table if not exists "geo_zone" ("id" text not null, "type" text check ("type" in (\'country\', \'province\', \'city\', \'zip\')) not null default \'country\', "country_code" text not null, "province_code" text null, "city" text null, "service_zone_id" text not null, "postal_expression" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "geo_zone_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_geo_zone_country_code" ON "geo_zone" (country_code) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_geo_zone_province_code" ON "geo_zone" (province_code) WHERE deleted_at IS NULL AND province_code IS NOT NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_geo_zone_city" ON "geo_zone" (city) WHERE deleted_at IS NULL AND city IS NOT NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_geo_zone_service_zone_id" ON "geo_zone" (service_zone_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_geo_zone_deleted_at" ON "geo_zone" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('create table if not exists "shipping_option_type" ("id" text not null, "label" text not null, "description" text null, "code" text not null, "shipping_option_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_option_type_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_shipping_option_type_shipping_option_id" ON "shipping_option_type" (shipping_option_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_shipping_option_type_deleted_at" ON "shipping_option_type" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('create table if not exists "shipping_profile" ("id" text not null, "name" text not null, "type" text check ("type" in (\'default\', \'gift_card\', \'custom\')) not null default \'default\', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_profile_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_shipping_profile_name" ON "shipping_profile" (name) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_shipping_profile_deleted_at" ON "shipping_profile" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('create table if not exists "shipping_option" ("id" text not null, "name" text not null, "price_type" text check ("price_type" in (\'calculated\', \'flat\')) not null default \'calculated\', "service_zone_id" text not null, "shipping_profile_id" text null, "service_provider_id" text not null, "shipping_option_type_id" text null, "data" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_option_pkey" primary key ("id"));');
    this.addSql('alter table if exists "shipping_option" add constraint "shipping_option_shipping_option_type_id_unique" unique ("shipping_option_type_id");');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_shipping_option_service_zone_id" ON "shipping_option" (service_zone_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_shipping_option_shipping_profile_id" ON "shipping_option" (shipping_profile_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_shipping_option_service_provider_id" ON "shipping_option" (service_provider_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_shipping_option_shipping_option_type_id" ON "shipping_option" (shipping_option_type_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_shipping_option_deleted_at" ON "shipping_option" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('create table if not exists "shipping_option_rule" ("id" text not null, "attribute" text not null, "operator" text not null, "value" jsonb null, "shipping_option_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_option_rule_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_shipping_option_rule_deleted_at" ON "shipping_option_rule" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('create table if not exists "fulfillment" ("id" text not null, "location_id" text not null, "packed_at" timestamptz null, "shipped_at" timestamptz null, "delivered_at" timestamptz null, "canceled_at" timestamptz null, "data" jsonb null, "provider_id" text not null, "shipping_option_id" text null, "metadata" jsonb null, "delivery_address_id" text not null, "items_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_location_id" ON "fulfillment" (location_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_provider_id" ON "fulfillment" (provider_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_shipping_option_id" ON "fulfillment" (shipping_option_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_deleted_at" ON "fulfillment" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('create table if not exists "fulfillment_label" ("id" text not null, "tracking_number" text not null, "tracking_url" text not null, "label_url" text not null, "fulfillment_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_label_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_label_fulfillment_id" ON "fulfillment_label" (fulfillment_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_label_deleted_at" ON "fulfillment_label" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('create table if not exists "fulfillment_item" ("id" text not null, "title" text not null, "sku" text not null, "barcode" text not null, "quantity" numeric not null, "line_item_id" text null, "inventory_item_id" text null, "fulfillment_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_item_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_item_fulfillment_id" ON "fulfillment_item" (line_item_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_item_fulfillment_id" ON "fulfillment_item" (inventory_item_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_item_fulfillment_id" ON "fulfillment_item" (fulfillment_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_fulfillment_item_deleted_at" ON "fulfillment_item" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('alter table if exists "shipping_option" add constraint "shipping_option_service_zone_id_foreign" foreign key ("service_zone_id") references "service_zone" ("id") on update cascade;');
    this.addSql('alter table if exists "shipping_option" add constraint "shipping_option_shipping_profile_id_foreign" foreign key ("shipping_profile_id") references "shipping_profile" ("id") on update cascade on delete set null;');
    this.addSql('alter table if exists "shipping_option" add constraint "shipping_option_service_provider_id_foreign" foreign key ("service_provider_id") references "service_provider" ("id") on update cascade;');
    this.addSql('alter table if exists "shipping_option" add constraint "shipping_option_shipping_option_type_id_foreign" foreign key ("shipping_option_type_id") references "shipping_option_type" ("id") on update cascade;');

    this.addSql('alter table if exists "shipping_option_rule" add constraint "shipping_option_rule_shipping_option_id_foreign" foreign key ("shipping_option_id") references "shipping_option" ("id") on update cascade;');

    this.addSql('alter table if exists "fulfillment" add constraint "fulfillment_shipping_option_id_foreign" foreign key ("shipping_option_id") references "shipping_option" ("id") on update cascade on delete set null;');
    this.addSql('alter table if exists "fulfillment" add constraint "fulfillment_provider_id_foreign" foreign key ("provider_id") references "service_provider" ("id") on update cascade;');
    this.addSql('alter table if exists "fulfillment" add constraint "fulfillment_delivery_address_id_foreign" foreign key ("delivery_address_id") references "fulfillment_address" ("id") on update cascade;');
    this.addSql('alter table if exists "fulfillment" add constraint "fulfillment_items_id_foreign" foreign key ("items_id") references "fulfillment_item" ("id") on update cascade;');

    this.addSql('alter table if exists "fulfillment_label" add constraint "fulfillment_label_fulfillment_id_foreign" foreign key ("fulfillment_id") references "fulfillment" ("id") on update cascade;');

    this.addSql('alter table if exists "fulfillment_item" add constraint "fulfillment_item_fulfillment_id_foreign" foreign key ("fulfillment_id") references "fulfillment" ("id") on update cascade;');
  }

}
