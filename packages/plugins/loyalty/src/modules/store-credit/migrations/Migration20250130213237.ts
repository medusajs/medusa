import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250130213237 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "store_credit_transaction_group" ("id" text not null, "code" text not null, "account_id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "store_credit_transaction_group_pkey" primary key ("id"));'
    );

    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_store_credit_transaction_group_code_unique" ON "store_credit_transaction_group" (code) WHERE deleted_at IS NULL;'
    );

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_store_credit_transaction_group_account_id" ON "store_credit_transaction_group" (account_id) WHERE deleted_at IS NULL;'
    );

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_store_credit_transaction_group_deleted_at" ON "store_credit_transaction_group" (deleted_at) WHERE deleted_at IS NULL;'
    );

    this.addSql(
      'alter table if exists "store_credit_transaction_group" add constraint "store_credit_transaction_group_account_id_foreign" foreign key ("account_id") references "store_credit_account" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'drop table if exists "store_credit_transaction_group" cascade;'
    );
  }
}
