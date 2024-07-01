import { Migration } from "@mikro-orm/migrations"

export class Migration20240628075401 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table if exists "notification_provider" add column if not exists "created_at" timestamptz not null default now(), add column "updated_at" timestamptz not null default now(), add column "deleted_at" timestamptz null;'
    )
    this.addSql(
      'alter table if exists "notification_provider" alter column "channels" type text[] using ("channels"::text[]);'
    )
    this.addSql(
      'alter table if exists "notification_provider" alter column "channels" set default \'{}\';'
    )

    this.addSql(
      'alter table if exists "notification" add column if not exists "updated_at" timestamptz not null default now(), add column "deleted_at" timestamptz null;'
    )
    this.addSql('drop index if exists "IDX_notification_idempotency_key";')
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_notification_idempotency_key_unique" ON "notification" (idempotency_key) WHERE deleted_at IS NULL;'
    )
  }
}
