import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20250127174331 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "loyalty_gift_card_invitation" ("id" text not null, "email" text not null, "code" text not null, "status" text check ("status" in (\'pending\', \'accepted\', \'rejected\')) not null default \'pending\', "expires_at" timestamptz null, "gift_card_id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "loyalty_gift_card_invitation_pkey" primary key ("id"));'
    );

    this.addSql(
      'alter table if exists "loyalty_gift_card_invitation" add constraint "loyalty_gift_card_invitation_gift_card_id_unique" unique ("gift_card_id");'
    );

    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_loyalty_gift_card_invitation_code_unique" ON "loyalty_gift_card_invitation" (code) WHERE deleted_at IS NULL;'
    );

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_loyalty_gift_card_invitation_gift_card_id" ON "loyalty_gift_card_invitation" (gift_card_id) WHERE deleted_at IS NULL;'
    );

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_loyalty_gift_card_invitation_deleted_at" ON "loyalty_gift_card_invitation" (deleted_at) WHERE deleted_at IS NULL;'
    );

    this.addSql(
      'alter table if exists "loyalty_gift_card_invitation" add constraint "loyalty_gift_card_invitation_gift_card_id_foreign" foreign key ("gift_card_id") references "loyalty_gift_card" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "loyalty_gift_card_invitation" cascade;');
  }
}
