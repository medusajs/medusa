import { Migration } from "@mikro-orm/migrations"

export class Migration20240509083918_InitialSetupMigration extends Migration {
  async up(): Promise<void> {
    this.addSql("drop table if exists notification")
    this.addSql("drop table if exists notification_provider")

    this.addSql(
      'create table if not exists "notification_provider" ("id" text not null, "handle" text not null, "name" text not null, "is_enabled" boolean not null default true, "channels" text[] not null, constraint "notification_provider_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table if not exists "notification" ("id" text not null, "to" text not null, "channel" text not null, "template" text not null, "data" jsonb null, "trigger_type" text null, "resource_id" text null, "resource_type" text null, "receiver_id" text null, "original_notification_id" text null, "idempotency_key" text null, "external_id" text null, "provider_id" text null, "created_at" timestamptz not null default now(), constraint "notification_pkey" primary key ("id"));'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_notification_provider_id" ON "notification" (provider_id);'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_notification_idempotency_key" ON "notification" (idempotency_key);'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_notification_receiver_id" ON "notification" (receiver_id);'
    )

    this.addSql(
      'alter table if exists "notification" add constraint "notification_provider_id_foreign" foreign key ("provider_id") references "notification_provider" ("id") on update cascade on delete set null;'
    )
  }
}
