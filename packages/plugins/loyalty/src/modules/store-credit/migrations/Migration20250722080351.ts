import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250722080351 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "store_credit_account_transaction" drop constraint if exists "store_credit_account_transaction_transaction_group_id_foreign";`);

    this.addSql(`drop table if exists "store_credit_transaction_group" cascade;`);

    this.addSql(`alter table if exists "store_credit_account" add column if not exists "code" text null;`);

    this.addSql(`drop index if exists "IDX_store_credit_account_transaction_transaction_group_id";`);
    this.addSql(`alter table if exists "store_credit_account_transaction" drop column if exists "transaction_group_id";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table if not exists "store_credit_transaction_group" ("id" text not null, "code" text not null, "account_id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "store_credit_transaction_group_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_store_credit_transaction_group_code_unique" ON "store_credit_transaction_group" (code) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_store_credit_transaction_group_account_id" ON "store_credit_transaction_group" (account_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_store_credit_transaction_group_deleted_at" ON "store_credit_transaction_group" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_account_id" ON "store_credit_transaction_group" (code, account_id) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "store_credit_transaction_group" add constraint "store_credit_transaction_group_account_id_foreign" foreign key ("account_id") references "store_credit_account" ("id") on update cascade;`);

    this.addSql(`alter table if exists "store_credit_account" drop column if exists "code";`);

    this.addSql(`alter table if exists "store_credit_account_transaction" add column if not exists "transaction_group_id" text null;`);
    this.addSql(`alter table if exists "store_credit_account_transaction" add constraint "store_credit_account_transaction_transaction_group_id_foreign" foreign key ("transaction_group_id") references "store_credit_transaction_group" ("id") on update cascade on delete set null;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_store_credit_account_transaction_transaction_group_id" ON "store_credit_account_transaction" (transaction_group_id) WHERE deleted_at IS NULL;`);
  }

}
