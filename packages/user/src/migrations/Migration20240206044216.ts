import { Migration } from "@mikro-orm/migrations"

export class Migration20240206044216 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "invite" ("id" text not null, "user_identifier" text not null, "accepted" boolean not null, "token" text not null, "expires_at" timestamptz not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "invite_pkey" primary key ("id"));'
    )
    this.addSql(
      'create index "IDX_invite_deleted_at" on "invite" ("deleted_at");'
    )
    this.addSql(
      'create unique index "invite_user_identifier_index" on "invite" ("user_identifier") where deleted_at is null;;'
    )

    this.addSql(
      'create table if not exists "user" ("id" text not null, "first_name" text null, "last_name" text null, "email" text not null, "avatar_url" text null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "user_pkey" primary key ("id"));'
    )
    this.addSql('create index "IDX_user_deleted_at" on "user" ("deleted_at");')
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "invite" cascade;')

    this.addSql('drop table if exists "user" cascade;')
  }
}
