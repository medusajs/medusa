import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260518040200 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "platform_sku" ("id" text not null, "shop_id" text not null, "platform_type" text check ("platform_type" in ('taobao', 'douyin', 'jd', 'pdd', 'wechat', 'xiaohongshu', 'other')) not null, "platform_product_id" text not null, "platform_sku_id" text not null, "platform_sku_code" text null, "sales_material_id" text null, "variant_id" text null, "platform_title" text null, "platform_price" real null, "platform_properties" jsonb null, "sync_status" text check ("sync_status" in ('pending', 'success', 'failed')) not null default 'pending', "mapping_status" text check ("mapping_status" in ('unmapped', 'mapped')) not null default 'unmapped', "listing_status" text check ("listing_status" in ('listed', 'delisted')) not null default 'listed', "last_sync_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "platform_sku_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_platform_sku_deleted_at" ON "platform_sku" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_platform_sku_shop_platform" ON "platform_sku" ("shop_id", "platform_type", "platform_sku_id") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "platform_sync_task" ("id" text not null, "shop_id" text not null, "platform_type" text check ("platform_type" in ('taobao', 'douyin', 'jd', 'pdd', 'wechat', 'xiaohongshu', 'other')) not null, "action" text check ("action" in ('create', 'update', 'delist', 'delete')) not null, "payload" jsonb not null, "status" text check ("status" in ('pending', 'processing', 'success', 'failed')) not null default 'pending', "error_msg" text null, "retry_count" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "platform_sync_task_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_platform_sync_task_deleted_at" ON "platform_sync_task" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_platform_sync_task_status" ON "platform_sync_task" ("status") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "platform_sku" cascade;`);

    this.addSql(`drop table if exists "platform_sync_task" cascade;`);
  }

}
