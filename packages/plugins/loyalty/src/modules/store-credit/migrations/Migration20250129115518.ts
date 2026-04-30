import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250129115518 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "store_credit_account" ("id" text not null, "currency_code" text not null, "customer_id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "store_credit_account_pkey" primary key ("id"));'
    );

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_store_credit_account_deleted_at" ON "store_credit_account" (deleted_at) WHERE deleted_at IS NULL;'
    );

    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_customer_id_currency_code" ON "store_credit_account" (customer_id, currency_code) WHERE deleted_at IS NULL;'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "store_credit_account" cascade;');
  }
}
