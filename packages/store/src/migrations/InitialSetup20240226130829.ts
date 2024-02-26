import { Migration } from "@mikro-orm/migrations"

export class InitialSetup20240226130829 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "store" ("id" text not null, "name" text not null, "default_sales_channel_id" text null, "default_region_id" text null, "default_location_id" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), constraint "store_pkey" primary key ("id"));'
    )
  }
}
