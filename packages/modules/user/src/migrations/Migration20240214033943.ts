import { generatePostgresAlterColummnIfExistStatement } from "@medusajs/utils"
import { Migration } from "@mikro-orm/migrations"

export class Migration20240214033943 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "invite" ("id" text not null, "email" text not null, "accepted" boolean not null default false, "token" text not null, "expires_at" timestamptz not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "invite_pkey" primary key ("id"));'
    )
    this.addSql(
      'alter table "invite" add column if not exists "email" text not null;'
    )

    this.addSql(
      generatePostgresAlterColummnIfExistStatement(
        "invite",
        ["user_email"],
        "DROP NOT NULL"
      )
    )

    this.addSql(
      'CREATE UNIQUE INDEX IF NOT EXISTS "IDX_invite_email" ON "invite" (email) WHERE deleted_at IS NULL;'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_invite_token" ON "invite" (token) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_invite_deleted_at" ON "invite" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )

    this.addSql(
      'create table if not exists "user" ("id" text not null, "first_name" text null, "last_name" text null, "email" text not null, "avatar_url" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "user_pkey" primary key ("id"));'
    )

    this.addSql(
      'alter table "user" add column if not exists "avatar_url" text null;'
    )

    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_user_email" ON "user" (email) WHERE deleted_at IS NULL;'
    )
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_user_deleted_at" ON "user" (deleted_at) WHERE deleted_at IS NOT NULL;'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "invite" cascade;')

    this.addSql('drop table if exists "user" cascade;')
  }
}
