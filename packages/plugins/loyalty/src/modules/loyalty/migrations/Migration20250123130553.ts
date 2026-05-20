import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250123130553 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "loyalty_gift_card" ("id" text not null, "status" text check ("status" in (\'pending\', \'redeemed\')) not null default \'pending\', "value" numeric not null, "code" text not null, "currency_code" text not null, "expires_at" timestamptz null, "line_item_id" text not null, "customer_id" text not null, "note" text null, "metadata" jsonb null, "raw_value" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "loyalty_gift_card_pkey" primary key ("id"));'
    );

    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_loyalty_gift_card_code_unique" ON "loyalty_gift_card" (code) WHERE deleted_at IS NULL;'
    );

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_loyalty_gift_card_deleted_at" ON "loyalty_gift_card" (deleted_at) WHERE deleted_at IS NULL;'
    );

    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_line_item_id_customer_id" ON "loyalty_gift_card" (line_item_id, customer_id) WHERE deleted_at IS NULL;'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "loyalty_gift_card" cascade;');
  }
}
