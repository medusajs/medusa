import { Migration } from "@zjedene-medusa/framework/mikro-orm/migrations";

export class Migration20250206105639 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop table if exists "payment_method_token" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table if not exists "payment_method_token" ("id" text not null, "provider_id" text not null, "data" jsonb null, "name" text not null, "type_detail" text null, "description_detail" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "payment_method_token_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_payment_method_token_deleted_at" ON "payment_method_token" (deleted_at) WHERE deleted_at IS NULL;`);
  }

}
