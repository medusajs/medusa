import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260518040201 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "channel_price" ("id" text not null, "sales_material_id" text not null, "shop_id" text null, "customer_class_id" text null, "price_type" text check ("price_type" in ('retail', 'wholesale', 'supply')) not null, "currency_code" text not null default 'CNY', "amount" real not null, "start_at" timestamptz null, "end_at" timestamptz null, "min_quantity" integer null, "max_quantity" integer null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "channel_price_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_channel_price_deleted_at" ON "channel_price" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_channel_price_sales_material" ON "channel_price" ("sales_material_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_channel_price_shop" ON "channel_price" ("shop_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "channel_price" cascade;`);
  }

}
