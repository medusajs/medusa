import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250130220640 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "store_credit_account_transaction" ("id" text not null, "amount" numeric not null, "type" text check ("type" in (\'credit\', \'debit\')) not null, "reference" text not null, "reference_id" text not null, "note" text null, "account_id" text not null, "transaction_group_id" text null, "metadata" jsonb null, "raw_amount" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "store_credit_account_transaction_pkey" primary key ("id"));'
    );

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_store_credit_account_transaction_account_id" ON "store_credit_account_transaction" (account_id) WHERE deleted_at IS NULL;'
    );

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_store_credit_account_transaction_transaction_group_id" ON "store_credit_account_transaction" (transaction_group_id) WHERE deleted_at IS NULL;'
    );

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_store_credit_account_transaction_deleted_at" ON "store_credit_account_transaction" (deleted_at) WHERE deleted_at IS NULL;'
    );

    this.addSql(
      'alter table if exists "store_credit_account_transaction" add constraint "store_credit_account_transaction_account_id_foreign" foreign key ("account_id") references "store_credit_account" ("id") on update cascade;'
    );

    this.addSql(
      'alter table if exists "store_credit_account_transaction" add constraint "store_credit_account_transaction_transaction_group_id_foreign" foreign key ("transaction_group_id") references "store_credit_transaction_group" ("id") on update cascade on delete set null;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'drop table if exists "store_credit_account_transaction" cascade;'
    );
  }
}
