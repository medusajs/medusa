import { Migration } from "@mikro-orm/migrations"

export class Migration20240124154000 extends Migration {
  async up(): Promise<void> {
    // Customer table modifications
    this.addSql(
      'create table if not exists "customer" ("id" text not null, "company_name" text null, "first_name" text null, "last_name" text null, "email" text null, "phone" text null, "has_account" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "created_by" text null, constraint "customer_pkey" primary key ("id"));'
    )
    this.addSql('alter table "customer" alter column "email" drop not null;')
    this.addSql(
      'alter table "customer" add column if not exists "company_name" text null;'
    )
    this.addSql(
      'alter table "customer" add column if not exists "created_by" text null;'
    )
    this.addSql('drop index if exists "IDX_8abe81b9aac151ae60bf507ad1";')

    // Customer Address table
    this.addSql(
      'create table if not exists "customer_address" ("id" text not null, "customer_id" text not null, "address_name" text null, "is_default_shipping" boolean not null default false, "is_default_billing" boolean not null default false, "company" text null, "first_name" text null, "last_name" text null, "address_1" text null, "address_2" text null, "city" text null, "country_code" text null, "province" text null, "postal_code" text null, "phone" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "customer_address_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index if not exists "IDX_customer_address_customer_id" on "customer_address" ("customer_id");'
    )
    this.addSql(
      'create unique index "IDX_customer_address_unique_customer_billing" on "customer_address" ("customer_id") where "is_default_billing" = true;'
    )
    this.addSql(
      'create unique index "IDX_customer_address_unique_customer_shipping" on "customer_address" ("customer_id") where "is_default_shipping" = true;'
    )

    // Customer Group table modifications
    this.addSql(
      'create table if not exists "customer_group" ("id" text not null, "name" text null, "metadata" jsonb null, "created_by" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_group_pkey" primary key ("id"));'
    )
    this.addSql(
      'alter table "customer_group" add column if not exists "created_by" text null;'
    )
    this.addSql('drop index if exists "IDX_c4c3a5225a7a1f0af782c40abc";')
    this.addSql(
      'create unique index if not exists "IDX_customer_group_name" on "customer_group" ("name") where "deleted_at" is null;'
    )

    // Customer Group Customer table
    this.addSql(
      'create table if not exists "customer_group_customer" ("id" text not null, "customer_id" text not null, "customer_group_id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "created_by" text null, constraint "customer_group_customer_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index if not exists "IDX_customer_group_customer_group_id" on "customer_group_customer" ("customer_group_id");'
    )
    this.addSql(
      'create index if not exists "IDX_customer_group_customer_customer_id" on "customer_group_customer" ("customer_id");'
    )

    // Foreign key constraints
    this.addSql(
      'alter table "customer" drop constraint if exists "FK_8abe81b9aac151ae60bf507ad15";'
    )
    this.addSql(
      'alter table "customer_address" add constraint "customer_address_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table "customer_group_customer" add constraint "customer_group_customer_customer_group_id_foreign" foreign key ("customer_group_id") references "customer_group" ("id") on delete cascade;'
    )
    this.addSql(
      'alter table "customer_group_customer" add constraint "customer_group_customer_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on delete cascade;'
    )
  }
}
