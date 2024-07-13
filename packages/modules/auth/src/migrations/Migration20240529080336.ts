import { Migration } from "@mikro-orm/migrations"

export class Migration20240529080336 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "provider_identity" ("id" text not null, "entity_id" text not null, "provider" text not null, "auth_identity_id" text not null, "user_metadata" jsonb null, "provider_metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "provider_identity_pkey" primary key ("id"));'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_provider_identity_auth_identity_id" ON "provider_identity" (auth_identity_id);'
    )
    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_provider_identity_provider_entity_id" ON "provider_identity" (entity_id, provider);'
    )

    this.addSql(
      'alter table if exists "provider_identity" add constraint "provider_identity_auth_identity_id_foreign" foreign key ("auth_identity_id") references "auth_identity" ("id") on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table if exists "auth_identity" add column if not exists "created_at" timestamptz not null default now(), add column "updated_at" timestamptz not null default now();'
    )

    this.addSql(
      'alter table if exists "auth_identity" drop constraint if exists "IDX_auth_identity_provider_entity_id";'
    )
    this.addSql(
      'alter table if exists "auth_identity" drop column if exists "entity_id";'
    )
    this.addSql(
      'alter table if exists "auth_identity" drop column if exists "provider";'
    )
    this.addSql(
      'alter table if exists "auth_identity" drop column if exists "user_metadata";'
    )
    this.addSql(
      'alter table if exists "auth_identity" drop column if exists "provider_metadata";'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "provider_identity" cascade;')

    this.addSql(
      'alter table if exists "auth_identity" add column if not exists "entity_id" text not null, add column "provider" text not null, add column "user_metadata" jsonb null, add column "provider_metadata" jsonb null;'
    )
    this.addSql(
      'alter table if exists "auth_identity" alter column "app_metadata" type jsonb using ("app_metadata"::jsonb);'
    )
    this.addSql(
      'alter table if exists "auth_identity" alter column "app_metadata" set not null;'
    )
    this.addSql(
      'alter table if exists "auth_identity" add constraint "IDX_auth_identity_provider_entity_id" unique ("provider", "entity_id");'
    )
  }
}
