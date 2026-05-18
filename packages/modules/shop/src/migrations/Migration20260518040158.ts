import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260518040158 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "shop" drop constraint if exists "shop_code_unique";`);
    this.addSql(`alter table if exists "shop" drop constraint if exists "shop_shop_code_unique";`);
    this.addSql(`create table if not exists "shop" ("id" text not null, "shop_code" text not null, "shop_name" text not null, "platform_type" text check ("platform_type" in ('taobao', 'douyin', 'jd', 'pdd', 'wechat', 'xiaohongshu', 'other')) not null, "platform_shop_id" text null, "org_id" text null, "status" text check ("status" in ('active', 'inactive')) not null default 'active', "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shop_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_shop_shop_code_unique" ON "shop" ("shop_code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_shop_deleted_at" ON "shop" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_shop_code_unique" ON "shop" ("shop_code") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_shop_platform_type" ON "shop" ("platform_type") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "shop" cascade;`);
  }

}
