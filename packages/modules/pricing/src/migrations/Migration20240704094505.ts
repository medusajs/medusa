import { Migration } from '@mikro-orm/migrations';

export class Migration20240704094505 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "price_preference" ("id" text not null, "attribute" text not null, "value" text null, "is_tax_inclusive" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "price_preference_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_price_preference_deleted_at" ON "price_preference" (deleted_at) WHERE deleted_at IS NOT NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_preference_attribute_value" ON "price_preference" (attribute, value) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "price_preference" cascade;');
  }

}
