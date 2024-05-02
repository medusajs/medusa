import { Migration } from '@mikro-orm/migrations';

export class Migration20240307161216 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "stock_location_address" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "address_1" text not null, "address_2" text null, "company" text null, "city" text null, "country_code" text not null, "phone" text null, "province" text null, "postal_code" text null, "metadata" jsonb null, constraint "stock_location_address_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_stock_location_address_deleted_at" ON "stock_location_address" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('create table if not exists "stock_location" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, "name" text not null, "address_id" text null, "metadata" jsonb null, constraint "stock_location_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_stock_location_deleted_at" ON "stock_location" (deleted_at) WHERE deleted_at IS NOT NULL;');

    this.addSql('alter table if exists "stock_location" add constraint "stock_location_address_id_foreign" foreign key ("address_id") references "stock_location_address" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "stock_location" drop constraint if exists "stock_location_address_id_foreign";');

    this.addSql('drop table if exists "stock_location_address" cascade;');

    this.addSql('drop table if exists "stock_location" cascade;');
  }

}
