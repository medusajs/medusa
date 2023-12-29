import { Migration } from '@mikro-orm/migrations';

export class Migration20231229121015 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "address" ("id" text not null, "customer_id" text null, "company" text null, "first_name" text null, "last_name" text null, "address_1" text null, "address_2" text null, "city" text null, "country_code" text null, "province" text null, "postal_code" text null, "phone" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "address_pkey" primary key ("id"));');

    this.addSql('create table "adjustment_line" ("id" text not null, "description" text null, "promotion_id" text null, "code" text not null, "amount" numeric not null, "provider_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "adjustment_line_pkey" primary key ("id"));');

    this.addSql('create table "cart" ("id" text not null, "region_id" text null, "customer_id" text null, "sales_channel_id" text null, "email" text not null, "currency_code" text not null, "shipping_address_id" text null, "billing_address_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cart_pkey" primary key ("id"));');

    this.addSql('create table "line_item" ("id" text not null, "cart_id" text not null, "title" text not null, "subtitle" text null, "thumbnail" text null, "quantity" text not null, "variant_id" text null, "product_id" text null, "product_title" text null, "product_description" text null, "product_subtitle" text null, "product_type" text null, "product_collection" text null, "product_handle" text null, "variant_sku" text null, "variant_barcode" text null, "variant_title" text null, "variant_option_values" jsonb null, "requires_shipping" boolean null, "is_discountable" boolean null, "is_tax_inclusive" boolean null, "compare_at_unit_price" text null, "unit_price" numeric not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "line_item_pkey" primary key ("id"));');
    this.addSql('create index "IDX_line_item_cart_id" on "line_item" ("cart_id");');

    this.addSql('create table "line_item_adjustment_line" ("line_item_id" text not null, "adjustment_line_id" text not null, "item_id" text not null, constraint "line_item_adjustment_line_pkey" primary key ("line_item_id", "adjustment_line_id"));');
    this.addSql('alter table "line_item_adjustment_line" add constraint "line_item_adjustment_line_line_item_id_adjustment_line_id_unique" unique ("line_item_id", "adjustment_line_id");');

    this.addSql('create table "shipping_method" ("id" text not null, "cart_id" text not null, "title" text not null, "description" jsonb null, "unit_price" text not null, "tax_inclusive" boolean not null default false, "shipping_option_id" text null, "data" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shipping_method_pkey" primary key ("id"));');
    this.addSql('create index "IDX_shipping_method_cart_id" on "shipping_method" ("cart_id");');

    this.addSql('create table "shipping_method_adjustment_line" ("shipping_method_id" text not null, "adjustment_line_id" text not null, constraint "shipping_method_adjustment_line_pkey" primary key ("shipping_method_id", "adjustment_line_id"));');
    this.addSql('alter table "shipping_method_adjustment_line" add constraint "shipping_method_adjustment_line_shipping_method_id_bd0fc_unique" unique ("shipping_method_id", "adjustment_line_id");');

    this.addSql('create table "tax_line" ("id" text not null, "description" text null, "tax_rate_id" text null, "code" text not null, "rate" number not null, "provider_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "tax_line_pkey" primary key ("id"));');

    this.addSql('create table "shipping_method_tax_line" ("shipping_method_id" text not null, "tax_line_id" text not null, constraint "shipping_method_tax_line_pkey" primary key ("shipping_method_id", "tax_line_id"));');
    this.addSql('alter table "shipping_method_tax_line" add constraint "shipping_method_tax_line_shipping_method_id_tax_line_id_unique" unique ("shipping_method_id", "tax_line_id");');

    this.addSql('create table "line_item_tax_line" ("line_item_id" text not null, "tax_line_id" text not null, constraint "line_item_tax_line_pkey" primary key ("line_item_id", "tax_line_id"));');
    this.addSql('alter table "line_item_tax_line" add constraint "line_item_tax_line_line_item_id_tax_line_id_unique" unique ("line_item_id", "tax_line_id");');

    this.addSql('alter table "cart" add constraint "cart_shipping_address_id_foreign" foreign key ("shipping_address_id") references "address" ("id") on update cascade on delete set null;');
    this.addSql('alter table "cart" add constraint "cart_billing_address_id_foreign" foreign key ("billing_address_id") references "address" ("id") on update cascade on delete set null;');

    this.addSql('alter table "line_item" add constraint "line_item_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "line_item_adjustment_line" add constraint "line_item_adjustment_line_item_id_foreign" foreign key ("item_id") references "line_item" ("id") on update cascade;');
    this.addSql('alter table "line_item_adjustment_line" add constraint "line_item_adjustment_line_adjustment_line_id_foreign" foreign key ("adjustment_line_id") references "adjustment_line" ("id") on update cascade;');

    this.addSql('alter table "shipping_method" add constraint "shipping_method_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "shipping_method_adjustment_line" add constraint "shipping_method_adjustment_line_shipping_method_id_foreign" foreign key ("shipping_method_id") references "shipping_method" ("id") on update cascade;');
    this.addSql('alter table "shipping_method_adjustment_line" add constraint "shipping_method_adjustment_line_adjustment_line_id_foreign" foreign key ("adjustment_line_id") references "adjustment_line" ("id") on update cascade;');

    this.addSql('alter table "shipping_method_tax_line" add constraint "shipping_method_tax_line_shipping_method_id_foreign" foreign key ("shipping_method_id") references "shipping_method" ("id") on update cascade;');
    this.addSql('alter table "shipping_method_tax_line" add constraint "shipping_method_tax_line_tax_line_id_foreign" foreign key ("tax_line_id") references "tax_line" ("id") on update cascade;');

    this.addSql('alter table "line_item_tax_line" add constraint "line_item_tax_line_line_item_id_foreign" foreign key ("line_item_id") references "line_item" ("id") on update cascade;');
    this.addSql('alter table "line_item_tax_line" add constraint "line_item_tax_line_tax_line_id_foreign" foreign key ("tax_line_id") references "tax_line" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "cart" drop constraint "cart_shipping_address_id_foreign";');

    this.addSql('alter table "cart" drop constraint "cart_billing_address_id_foreign";');

    this.addSql('alter table "line_item_adjustment_line" drop constraint "line_item_adjustment_line_adjustment_line_id_foreign";');

    this.addSql('alter table "shipping_method_adjustment_line" drop constraint "shipping_method_adjustment_line_adjustment_line_id_foreign";');

    this.addSql('alter table "line_item" drop constraint "line_item_cart_id_foreign";');

    this.addSql('alter table "shipping_method" drop constraint "shipping_method_cart_id_foreign";');

    this.addSql('alter table "line_item_adjustment_line" drop constraint "line_item_adjustment_line_item_id_foreign";');

    this.addSql('alter table "line_item_tax_line" drop constraint "line_item_tax_line_line_item_id_foreign";');

    this.addSql('alter table "shipping_method_adjustment_line" drop constraint "shipping_method_adjustment_line_shipping_method_id_foreign";');

    this.addSql('alter table "shipping_method_tax_line" drop constraint "shipping_method_tax_line_shipping_method_id_foreign";');

    this.addSql('alter table "shipping_method_tax_line" drop constraint "shipping_method_tax_line_tax_line_id_foreign";');

    this.addSql('alter table "line_item_tax_line" drop constraint "line_item_tax_line_tax_line_id_foreign";');

    this.addSql('drop table if exists "address" cascade;');

    this.addSql('drop table if exists "adjustment_line" cascade;');

    this.addSql('drop table if exists "cart" cascade;');

    this.addSql('drop table if exists "line_item" cascade;');

    this.addSql('drop table if exists "line_item_adjustment_line" cascade;');

    this.addSql('drop table if exists "shipping_method" cascade;');

    this.addSql('drop table if exists "shipping_method_adjustment_line" cascade;');

    this.addSql('drop table if exists "tax_line" cascade;');

    this.addSql('drop table if exists "shipping_method_tax_line" cascade;');

    this.addSql('drop table if exists "line_item_tax_line" cascade;');
  }

}
