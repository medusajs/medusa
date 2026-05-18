import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260518040000 extends Migration {
  override async up(): Promise<void> {
    // Product table new columns
    this.addSql(`alter table if exists "product" add column if not exists "spu_code" text null;`)
    this.addSql(`alter table if exists "product" add column if not exists "brand_id" text null;`)
    this.addSql(`alter table if exists "product" add column if not exists "brief" text null;`)
    this.addSql(`alter table if exists "product" add column if not exists "unit" text null;`)
    this.addSql(`alter table if exists "product" add column if not exists "product_type" text not null default 'normal';`)
    this.addSql(`alter table if exists "product" add column if not exists "sn_managed" boolean not null default false;`)
    this.addSql(`alter table if exists "product" add column if not exists "published_at" timestamptz null;`)
    this.addSql(`alter table if exists "product" add column if not exists "unpublished_at" timestamptz null;`)
    this.addSql(`alter table if exists "product" add column if not exists "sort_order" integer not null default 0;`)
    this.addSql(`alter table if exists "product" add column if not exists "visibility" text not null default 'visible';`)

    // Add check constraints for enum-like columns
    this.addSql(`alter table if exists "product" drop constraint if exists "product_product_type_check";`)
    this.addSql(`alter table if exists "product" add constraint "product_product_type_check" check ("product_type" in ('normal', 'bind', 'combo', 'gift'));`)

    this.addSql(`alter table if exists "product" drop constraint if exists "product_visibility_check";`)
    this.addSql(`alter table if exists "product" add constraint "product_visibility_check" check ("visibility" in ('visible', 'hidden'));`)

    // Product variant table new columns
    this.addSql(`alter table if exists "product_variant" add column if not exists "sku_code" text null;`)
    this.addSql(`alter table if exists "product_variant" add column if not exists "unit" text null;`)
    this.addSql(`alter table if exists "product_variant" add column if not exists "cost_price" real null;`)
    this.addSql(`alter table if exists "product_variant" add column if not exists "market_price" real null;`)
    this.addSql(`alter table if exists "product_variant" add column if not exists "alert_stock" integer null;`)
    this.addSql(`alter table if exists "product_variant" add column if not exists "purchase_limit" integer null;`)
    this.addSql(`alter table if exists "product_variant" add column if not exists "spec_info" text null;`)
  }

  override async down(): Promise<void> {
    // Product variant columns
    this.addSql(`alter table if exists "product_variant" drop column if exists "sku_code";`)
    this.addSql(`alter table if exists "product_variant" drop column if exists "unit";`)
    this.addSql(`alter table if exists "product_variant" drop column if exists "cost_price";`)
    this.addSql(`alter table if exists "product_variant" drop column if exists "market_price";`)
    this.addSql(`alter table if exists "product_variant" drop column if exists "alert_stock";`)
    this.addSql(`alter table if exists "product_variant" drop column if exists "purchase_limit";`)
    this.addSql(`alter table if exists "product_variant" drop column if exists "spec_info";`)

    // Product columns
    this.addSql(`alter table if exists "product" drop constraint if exists "product_product_type_check";`)
    this.addSql(`alter table if exists "product" drop constraint if exists "product_visibility_check";`)
    this.addSql(`alter table if exists "product" drop column if exists "spu_code";`)
    this.addSql(`alter table if exists "product" drop column if exists "brand_id";`)
    this.addSql(`alter table if exists "product" drop column if exists "brief";`)
    this.addSql(`alter table if exists "product" drop column if exists "unit";`)
    this.addSql(`alter table if exists "product" drop column if exists "product_type";`)
    this.addSql(`alter table if exists "product" drop column if exists "sn_managed";`)
    this.addSql(`alter table if exists "product" drop column if exists "published_at";`)
    this.addSql(`alter table if exists "product" drop column if exists "unpublished_at";`)
    this.addSql(`alter table if exists "product" drop column if exists "sort_order";`)
    this.addSql(`alter table if exists "product" drop column if exists "visibility";`)
  }
}
