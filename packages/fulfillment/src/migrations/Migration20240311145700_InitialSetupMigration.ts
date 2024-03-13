import { Migration } from "@mikro-orm/migrations"

export class Migration20240311145700_InitialSetupMigration extends Migration {
  async up(): Promise<void> {
    const shippingOptionTable = await this.execute(
      `SELECT * FROM information_schema.tables where table_name = 'shipping_option' and table_schema = 'public';`
    )

    if (!shippingOptionTable.length) {
      await migrateUpModuleMigration.call(this)
    } else {
      await migrateUpBackwardCompatibility.call(this)
    }
  }
}

/**
 * This migration is for the initial setup of the fulfillment module in the case of
 * an already existing database. It will check if the `shipping_option` table exists and in that case
 * assume that all other associated tables exists and will migrate them all.
 *
 * This migration does not take into account the data migration part which
 * should be handled separately. Also, after the data migration
 * the tables should be cleaned up from the old columns.
 **/
async function migrateUpBackwardCompatibility(
  this: Migration20240311145700_InitialSetupMigration
) {
  this.addSql(
    'create table if not exists "fulfillment_address" ("id" text not null, "company" text null, "first_name" text null, "last_name" text null, "address_1" text null, "address_2" text null, "city" text null, "country_code" text null, "province" text null, "postal_code" text null, "phone" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_address_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_address_deleted_at" ON "fulfillment_address" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(`
    alter table fulfillment_provider
    alter column id type text using id::text;

    alter table fulfillment_provider
        add is_enabled boolean default true not null;
  `)

  this.addSql(
    'create table if not exists "fulfillment_set" ("id" text not null, "name" text not null, "type" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_set_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_fulfillment_set_name_unique" ON "fulfillment_set" (name) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_set_deleted_at" ON "fulfillment_set" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "service_zone" ("id" text not null, "name" text not null, "metadata" jsonb null, "fulfillment_set_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "service_zone_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_service_zone_name_unique" ON "service_zone" (name) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_service_zone_fulfillment_set_id" ON "service_zone" (fulfillment_set_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_service_zone_deleted_at" ON "service_zone" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "geo_zone" ("id" text not null, "type" text check ("type" in (\'country\', \'province\', \'city\', \'zip\')) not null default \'country\', "country_code" text not null, "province_code" text null, "city" text null, "service_zone_id" text not null, "postal_expression" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "geo_zone_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_country_code" ON "geo_zone" (country_code) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_province_code" ON "geo_zone" (province_code) WHERE deleted_at IS NULL AND province_code IS NOT NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_city" ON "geo_zone" (city) WHERE deleted_at IS NULL AND city IS NOT NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_service_zone_id" ON "geo_zone" (service_zone_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_deleted_at" ON "geo_zone" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "shipping_option_type" ("id" text not null, "label" text not null, "description" text null, "code" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_option_type_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_type_deleted_at" ON "shipping_option_type" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(`
      alter table shipping_profile
      alter column id type text using id::text;

      alter table shipping_profile
      alter column name type text using name::text;

      alter table shipping_profile
      alter column type type text using type::text;

      create unique index if not exists "IDX_shipping_profile_name_unique"
          on shipping_profile (name)
          where (deleted_at IS NULL);

      create index if not exists "IDX_shipping_profile_deleted_at"
          on shipping_profile (deleted_at)
          where (deleted_at IS NOT NULL);
  `)

  this.addSql(`    
    alter table shipping_option
    alter column id type text using id::text;

    alter table shipping_option
        alter column name type text using name::text;
    
    alter table shipping_option
        add service_zone_id text not null;
    
    alter table shipping_option
        RENAME profile_id TO shipping_profile_id;

    alter table shipping_option
        alter column region_id drop not null;
    
    alter table shipping_option
        alter column price_type type text using price_type::text;
    
    alter table shipping_option
        alter column price_type set default 'calculated'::text;
    
    alter table shipping_option
        alter column data drop not null;
    
    alter table shipping_option
        add shipping_option_type_id text not null;
    
    drop index if exists "IDX_5c58105f1752fca0f4ce69f466";
    
    drop index if exists "IDX_c951439af4c98bf2bd7fb8726c";
    
    drop index if exists "IDX_a0e206bfaed3cb63c186091734";
    
    create index if not exists "IDX_shipping_option_service_zone_id"
        on shipping_option (service_zone_id)
        where (deleted_at IS NULL);
    
    create index if not exists "IDX_shipping_option_shipping_profile_id"
        on shipping_option (shipping_profile_id)
        where (deleted_at IS NULL);
    
    create index if not exists "IDX_shipping_option_provider_id"
        on shipping_option (provider_id)
        where (deleted_at IS NULL);
    
    create index if not exists "IDX_shipping_option_shipping_option_type_id"
        on shipping_option (shipping_option_type_id)
        where (deleted_at IS NULL);
    
    create index if not exists "IDX_shipping_option_deleted_at"
        on shipping_option (deleted_at)
        where (deleted_at IS NOT NULL);
    
    alter table shipping_option
        add constraint shipping_option_shipping_option_type_id_unique
            unique (shipping_option_type_id);
    
    alter table shipping_option
        drop constraint "FK_5c58105f1752fca0f4ce69f4663";
    
    alter table shipping_option
        drop constraint "FK_c951439af4c98bf2bd7fb8726cd";
    
    alter table shipping_option
        drop constraint "FK_a0e206bfaed3cb63c1860917347";
    
    alter table shipping_option
        add constraint shipping_option_service_zone_id_foreign
            foreign key (service_zone_id) references service_zone
                on update cascade on delete cascade;
    
    alter table shipping_option
        add constraint shipping_option_shipping_profile_id_foreign
            foreign key (shipping_profile_id) references shipping_profile
                on update cascade on delete set null;
    
    alter table shipping_option
        add constraint shipping_option_provider_id_foreign
            foreign key (provider_id) references fulfillment_provider
                on update cascade on delete set null;
    
    alter table shipping_option
        add constraint shipping_option_shipping_option_type_id_foreign
            foreign key (shipping_option_type_id) references shipping_option_type
                on update cascade on delete cascade;
    
    alter table shipping_option
        drop constraint "CHK_7a367f5901ae0a5b0df75aee38";
    
    alter table shipping_option
        add constraint shipping_option_price_type_check
            check (price_type = ANY (ARRAY ['calculated'::text, 'flat'::text]));
  `)

  this.addSql(
    'create table if not exists "shipping_option_rule" ("id" text not null, "attribute" text not null, "operator" text check ("operator" in (\'in\', \'eq\', \'ne\', \'gt\', \'gte\', \'lt\', \'lte\', \'nin\')) not null, "value" jsonb null, "shipping_option_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_option_rule_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_rule_shipping_option_id" ON "shipping_option_rule" (shipping_option_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_rule_deleted_at" ON "shipping_option_rule" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(`
      alter table fulfillment
      alter
      column id type text using id::text;
      
      alter table fulfillment
          add packed_at timestamp with time zone;

      alter table fulfillment
          alter column data drop not null;

      alter table fulfillment
          add delivered_at timestamp with time zone;

      alter table fulfillment
          add shipping_option_id text;

      alter table fulfillment
          add delivery_address_id text;

      alter table fulfillment
      alter
      column provider_id type text using provider_id::text;

      alter table fulfillment
          add deleted_at timestamp with time zone;

      alter table fulfillment
      alter
      column location_id type text using location_id::text;

      alter table fulfillment
          alter column location_id set not null;

      drop index if exists "IDX_d73e55964e0ff2db8f03807d52";

      drop index if exists "IDX_a52e234f729db789cf473297a5";

      drop index if exists "IDX_f129acc85e346a10eed12b86fc";

      drop index if exists "IDX_beb35a6de60a6c4f91d5ae57e4";

      create index if not exists  "IDX_fulfillment_location_id"
          on fulfillment (location_id) where (deleted_at IS NULL);

      create index if not exists"IDX_fulfillment_provider_id"
          on fulfillment (provider_id) where (deleted_at IS NULL);

      create index if not exists"IDX_fulfillment_shipping_option_id"
          on fulfillment (shipping_option_id) where (deleted_at IS NULL);

      create index if not exists"IDX_fulfillment_deleted_at"
          on fulfillment (deleted_at) where (deleted_at IS NOT NULL);

      alter table fulfillment
          add constraint fulfillment_delivery_address_id_unique
              unique (delivery_address_id);

      alter table fulfillment
      drop
      constraint "FK_a52e234f729db789cf473297a5c"; /* swap id */

      alter table fulfillment
      drop
      constraint "FK_f129acc85e346a10eed12b86fca"; /* order id */

      alter table fulfillment
      drop
      constraint "FK_beb35a6de60a6c4f91d5ae57e44"; /* provider id */

      alter table fulfillment
      drop
      constraint "FK_d73e55964e0ff2db8f03807d52e"; /* claim id */

      alter table fulfillment
          add constraint fulfillment_provider_id_foreign
              foreign key (provider_id) references fulfillment_provider
                  on update cascade on delete set null;

      alter table fulfillment
          add constraint fulfillment_shipping_option_id_foreign
              foreign key (shipping_option_id) references shipping_option
                  on update cascade on delete set null;

      alter table fulfillment
          add constraint fulfillment_delivery_address_id_foreign
              foreign key (delivery_address_id) references fulfillment_address
                  on update cascade on delete cascade;
  `)

  this.addSql(
    'create table if not exists "fulfillment_label" ("id" text not null, "tracking_number" text not null, "tracking_url" text not null, "label_url" text not null, "fulfillment_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_label_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_label_fulfillment_id" ON "fulfillment_label" (fulfillment_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_label_deleted_at" ON "fulfillment_label" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(`
    alter table fulfillment_item
        add id text not null;
    
    alter table fulfillment_item
        add title text not null;
    
    alter table fulfillment_item
        add sku text not null;
    
    alter table fulfillment_item
        add barcode text not null;
    
    alter table fulfillment_item
        alter column quantity type numeric using quantity::numeric;
    
    alter table fulfillment_item
        add raw_quantity jsonb not null;
    
    alter table fulfillment_item
        add line_item_id text;
    
    alter table fulfillment_item
        add inventory_item_id text;
    
    alter table fulfillment_item
        alter column fulfillment_id type text using fulfillment_id::text;
    
    alter table fulfillment_item
        add created_at timestamp with time zone default now() not null;
    
    alter table fulfillment_item
        add updated_at timestamp with time zone default now() not null;
    
    alter table fulfillment_item
        add deleted_at timestamp with time zone;
    
    create index if not exists "IDX_fulfillment_item_line_item_id"
        on fulfillment_item (line_item_id)
        where (deleted_at IS NULL);
    
    create index if not exists "IDX_fulfillment_item_inventory_item_id"
        on fulfillment_item (inventory_item_id)
        where (deleted_at IS NULL);
    
    create index if not exists "IDX_fulfillment_item_fulfillment_id"
        on fulfillment_item (fulfillment_id)
        where (deleted_at IS NULL);
    
    create index if not exists "IDX_fulfillment_item_deleted_at"
        on fulfillment_item (deleted_at)
        where (deleted_at IS NOT NULL);
    
    alter table fulfillment_item
        drop constraint "FK_a033f83cc6bd7701a5687ab4b38"; /* fulfillment id */
    
    alter table fulfillment_item
        drop constraint "FK_e13ff60e74206b747a1896212d1"; /* item id */

    alter table fulfillment_item
        drop constraint "PK_bc3e8a388de75db146a249922e0"; /* item id + fulfillment id PK */

    alter table fulfillment_item
        alter column item_id drop not null;
    
    alter table fulfillment_item
        add constraint fulfillment_item_fulfillment_id_foreign
            foreign key (fulfillment_id) references fulfillment
                on update cascade on delete cascade;

    alter table "fulfillment_item" add primary key ("id");
  `)

  this.addSql(
    'alter table if exists "service_zone" add constraint "service_zone_fulfillment_set_id_foreign" foreign key ("fulfillment_set_id") references "fulfillment_set" ("id") on update cascade on delete cascade;'
  )

  this.addSql(
    'alter table if exists "geo_zone" add constraint "geo_zone_service_zone_id_foreign" foreign key ("service_zone_id") references "service_zone" ("id") on update cascade on delete cascade;'
  )

  this.addSql(
    'alter table if exists "shipping_option_rule" add constraint "shipping_option_rule_shipping_option_id_foreign" foreign key ("shipping_option_id") references "shipping_option" ("id") on update cascade on delete cascade;'
  )

  this.addSql(
    'alter table if exists "fulfillment_label" add constraint "fulfillment_label_fulfillment_id_foreign" foreign key ("fulfillment_id") references "fulfillment" ("id") on update cascade on delete cascade;'
  )
}

/**
 * This migration is for be initial setup of the fulfillment module in the case of
 * a new database. It will create all the necessary tables and indexes.
 */
async function migrateUpModuleMigration(
  this: Migration20240311145700_InitialSetupMigration
) {
  this.addSql(
    'create table if not exists "fulfillment_address" ("id" text not null, "company" text null, "first_name" text null, "last_name" text null, "address_1" text null, "address_2" text null, "city" text null, "country_code" text null, "province" text null, "postal_code" text null, "phone" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_address_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_address_deleted_at" ON "fulfillment_address" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "fulfillment_provider" ("id" text not null, "is_enabled" boolean not null default true, constraint "fulfillment_provider_pkey" primary key ("id"));'
  )

  this.addSql(
    'create table if not exists "fulfillment_set" ("id" text not null, "name" text not null, "type" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_set_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_fulfillment_set_name_unique" ON "fulfillment_set" (name) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_set_deleted_at" ON "fulfillment_set" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "service_zone" ("id" text not null, "name" text not null, "metadata" jsonb null, "fulfillment_set_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "service_zone_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_service_zone_name_unique" ON "service_zone" (name) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_service_zone_fulfillment_set_id" ON "service_zone" (fulfillment_set_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_service_zone_deleted_at" ON "service_zone" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "geo_zone" ("id" text not null, "type" text check ("type" in (\'country\', \'province\', \'city\', \'zip\')) not null default \'country\', "country_code" text not null, "province_code" text null, "city" text null, "service_zone_id" text not null, "postal_expression" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "geo_zone_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_country_code" ON "geo_zone" (country_code) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_province_code" ON "geo_zone" (province_code) WHERE deleted_at IS NULL AND province_code IS NOT NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_city" ON "geo_zone" (city) WHERE deleted_at IS NULL AND city IS NOT NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_service_zone_id" ON "geo_zone" (service_zone_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_geo_zone_deleted_at" ON "geo_zone" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "shipping_option_type" ("id" text not null, "label" text not null, "description" text null, "code" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_option_type_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_type_deleted_at" ON "shipping_option_type" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "shipping_profile" ("id" text not null, "name" text not null, "type" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_profile_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_shipping_profile_name_unique" ON "shipping_profile" (name) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_shipping_profile_deleted_at" ON "shipping_profile" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "shipping_option" ("id" text not null, "name" text not null, "price_type" text check ("price_type" in (\'calculated\', \'flat\')) not null default \'flat\', "service_zone_id" text not null, "shipping_profile_id" text null, "provider_id" text null, "data" jsonb null, "metadata" jsonb null, "shipping_option_type_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_option_pkey" primary key ("id"));'
  )
  this.addSql(
    'alter table if exists "shipping_option" add constraint "shipping_option_shipping_option_type_id_unique" unique ("shipping_option_type_id");'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_service_zone_id" ON "shipping_option" (service_zone_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_shipping_profile_id" ON "shipping_option" (shipping_profile_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_provider_id" ON "shipping_option" (provider_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_shipping_option_type_id" ON "shipping_option" (shipping_option_type_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_deleted_at" ON "shipping_option" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "shipping_option_rule" ("id" text not null, "attribute" text not null, "operator" text check ("operator" in (\'in\', \'eq\', \'ne\', \'gt\', \'gte\', \'lt\', \'lte\', \'nin\')) not null, "value" jsonb null, "shipping_option_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_option_rule_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_rule_shipping_option_id" ON "shipping_option_rule" (shipping_option_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_shipping_option_rule_deleted_at" ON "shipping_option_rule" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "fulfillment" ("id" text not null, "location_id" text not null, "packed_at" timestamptz null, "shipped_at" timestamptz null, "delivered_at" timestamptz null, "canceled_at" timestamptz null, "data" jsonb null, "provider_id" text null, "shipping_option_id" text null, "metadata" jsonb null, "delivery_address_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_pkey" primary key ("id"));'
  )
  this.addSql(
    'alter table if exists "fulfillment" add constraint "fulfillment_delivery_address_id_unique" unique ("delivery_address_id");'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_location_id" ON "fulfillment" (location_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_provider_id" ON "fulfillment" (provider_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_shipping_option_id" ON "fulfillment" (shipping_option_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_deleted_at" ON "fulfillment" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "fulfillment_label" ("id" text not null, "tracking_number" text not null, "tracking_url" text not null, "label_url" text not null, "fulfillment_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_label_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_label_fulfillment_id" ON "fulfillment_label" (fulfillment_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_label_deleted_at" ON "fulfillment_label" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'create table if not exists "fulfillment_item" ("id" text not null, "title" text not null, "sku" text not null, "barcode" text not null, "quantity" numeric not null, "raw_quantity" jsonb not null, "line_item_id" text null, "inventory_item_id" text null, "fulfillment_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "fulfillment_item_pkey" primary key ("id"));'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_item_line_item_id" ON "fulfillment_item" (line_item_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_item_inventory_item_id" ON "fulfillment_item" (inventory_item_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_item_fulfillment_id" ON "fulfillment_item" (fulfillment_id) WHERE deleted_at IS NULL;'
  )
  this.addSql(
    'CREATE INDEX IF NOT EXISTS "IDX_fulfillment_item_deleted_at" ON "fulfillment_item" (deleted_at) WHERE deleted_at IS NOT NULL;'
  )

  this.addSql(
    'alter table if exists "service_zone" add constraint "service_zone_fulfillment_set_id_foreign" foreign key ("fulfillment_set_id") references "fulfillment_set" ("id") on update cascade on delete cascade;'
  )

  this.addSql(
    'alter table if exists "geo_zone" add constraint "geo_zone_service_zone_id_foreign" foreign key ("service_zone_id") references "service_zone" ("id") on update cascade on delete cascade;'
  )

  this.addSql(
    'alter table if exists "shipping_option" add constraint "shipping_option_service_zone_id_foreign" foreign key ("service_zone_id") references "service_zone" ("id") on update cascade on delete cascade;'
  )
  this.addSql(
    'alter table if exists "shipping_option" add constraint "shipping_option_shipping_profile_id_foreign" foreign key ("shipping_profile_id") references "shipping_profile" ("id") on update cascade on delete set null;'
  )
  this.addSql(
    'alter table if exists "shipping_option" add constraint "shipping_option_provider_id_foreign" foreign key ("provider_id") references "fulfillment_provider" ("id") on update cascade on delete set null;'
  )
  this.addSql(
    'alter table if exists "shipping_option" add constraint "shipping_option_shipping_option_type_id_foreign" foreign key ("shipping_option_type_id") references "shipping_option_type" ("id") on update cascade on delete cascade;'
  )

  this.addSql(
    'alter table if exists "shipping_option_rule" add constraint "shipping_option_rule_shipping_option_id_foreign" foreign key ("shipping_option_id") references "shipping_option" ("id") on update cascade on delete cascade;'
  )

  this.addSql(
    'alter table if exists "fulfillment" add constraint "fulfillment_provider_id_foreign" foreign key ("provider_id") references "fulfillment_provider" ("id") on update cascade on delete set null;'
  )
  this.addSql(
    'alter table if exists "fulfillment" add constraint "fulfillment_shipping_option_id_foreign" foreign key ("shipping_option_id") references "shipping_option" ("id") on update cascade on delete set null;'
  )
  this.addSql(
    'alter table if exists "fulfillment" add constraint "fulfillment_delivery_address_id_foreign" foreign key ("delivery_address_id") references "fulfillment_address" ("id") on update cascade on delete cascade;'
  )

  this.addSql(
    'alter table if exists "fulfillment_label" add constraint "fulfillment_label_fulfillment_id_foreign" foreign key ("fulfillment_id") references "fulfillment" ("id") on update cascade on delete cascade;'
  )

  this.addSql(
    'alter table if exists "fulfillment_item" add constraint "fulfillment_item_fulfillment_id_foreign" foreign key ("fulfillment_id") references "fulfillment" ("id") on update cascade on delete cascade;'
  )
}
