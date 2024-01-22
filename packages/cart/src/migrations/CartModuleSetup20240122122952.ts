import { Migration } from "@mikro-orm/migrations"

export class CartModuleSetup20240122122952 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "cart_address" ("id" text not null, "customer_id" text null, "company" text null, "first_name" text null, "last_name" text null, "address_1" text null, "address_2" text null, "city" text null, "country_code" text null, "province" text null, "postal_code" text null, "phone" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "cart_address_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "cart" ("id" text not null, "region_id" text null, "customer_id" text null, "sales_channel_id" text null, "email" text null, "currency_code" text not null, "shipping_address_id" text null, "billing_address_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "cart_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_cart_customer_id" on "cart" ("customer_id");'
    )
    this.addSql(
      'create index "IDX_cart_shipping_address_id" on "cart" ("shipping_address_id");'
    )
    this.addSql(
      'create index "IDX_cart_billing_address_id" on "cart" ("billing_address_id");'
    )

    this.addSql(
      'create table "cart_line_item" ("id" text not null, "cart_id" text not null, "title" text not null, "subtitle" text null, "thumbnail" text null, "quantity" integer not null, "variant_id" text null, "product_id" text null, "product_title" text null, "product_description" text null, "product_subtitle" text null, "product_type" text null, "product_collection" text null, "product_handle" text null, "variant_sku" text null, "variant_barcode" text null, "variant_title" text null, "variant_option_values" jsonb null, "requires_shipping" boolean not null default true, "is_discountable" boolean not null default true, "is_tax_inclusive" boolean not null default false, "compare_at_unit_price" numeric null, "unit_price" numeric not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "cart_line_item_pkey" primary key ("id"), constraint cart_line_item_unit_price_check check (unit_price >= 0));'
    )
    this.addSql(
      'create index "IDX_line_item_cart_id" on "cart_line_item" ("cart_id");'
    )
    this.addSql(
      'create index "IDX_line_item_variant_id" on "cart_line_item" ("variant_id");'
    )

    this.addSql(
      'create table "cart_line_item_adjustment" ("id" text not null, "description" text null, "promotion_id" text null, "code" text null, "amount" numeric not null, "provider_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "item_id" text null, constraint "cart_line_item_adjustment_pkey" primary key ("id"), constraint cart_line_item_adjustment_check check (amount >= 0));'
    )
    this.addSql(
      'create index "IDX_adjustment_item_id" on "cart_line_item_adjustment" ("item_id");'
    )

    this.addSql(
      'create table "cart_line_item_tax_line" ("id" text not null, "description" text null, "tax_rate_id" text null, "code" text not null, "rate" numeric not null, "provider_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "item_id" text null, constraint "cart_line_item_tax_line_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_tax_line_item_id" on "cart_line_item_tax_line" ("item_id");'
    )

    this.addSql(
      'create table "cart_shipping_method" ("id" text not null, "cart_id" text not null, "name" text not null, "description" jsonb null, "amount" numeric not null, "is_tax_inclusive" boolean not null default false, "shipping_option_id" text null, "data" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "cart_shipping_method_pkey" primary key ("id"), constraint cart_shipping_method_check check (amount >= 0));'
    )
    this.addSql(
      'create index "IDX_shipping_method_cart_id" on "cart_shipping_method" ("cart_id");'
    )

    this.addSql(
      'create table "cart_shipping_method_adjustment" ("id" text not null, "description" text null, "promotion_id" text null, "code" text null, "amount" numeric not null, "provider_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "shipping_method_id" text null, constraint "cart_shipping_method_adjustment_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_adjustment_shipping_method_id" on "cart_shipping_method_adjustment" ("shipping_method_id");'
    )

    this.addSql(
      'create table "cart_shipping_method_tax_line" ("id" text not null, "description" text null, "tax_rate_id" text null, "code" text not null, "rate" numeric not null, "provider_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "shipping_method_id" text null, constraint "cart_shipping_method_tax_line_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_tax_line_shipping_method_id" on "cart_shipping_method_tax_line" ("shipping_method_id");'
    )

    this.addSql(
      'alter table "cart" add constraint "cart_shipping_address_id_foreign" foreign key ("shipping_address_id") references "cart_address" ("id") on update cascade on delete set null;'
    )
    this.addSql(
      'alter table "cart" add constraint "cart_billing_address_id_foreign" foreign key ("billing_address_id") references "cart_address" ("id") on update cascade on delete set null;'
    )

    this.addSql(
      'alter table "cart_line_item" add constraint "cart_line_item_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "cart_line_item_adjustment" add constraint "cart_line_item_adjustment_item_id_foreign" foreign key ("item_id") references "cart_line_item" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "cart_line_item_tax_line" add constraint "cart_line_item_tax_line_item_id_foreign" foreign key ("item_id") references "cart_line_item" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "cart_shipping_method" add constraint "cart_shipping_method_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "cart_shipping_method_adjustment" add constraint "cart_shipping_method_adjustment_shipping_method_id_foreign" foreign key ("shipping_method_id") references "cart_shipping_method" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table "cart_shipping_method_tax_line" add constraint "cart_shipping_method_tax_line_shipping_method_id_foreign" foreign key ("shipping_method_id") references "cart_shipping_method" ("id") on update cascade on delete cascade;'
    )
  }
}
