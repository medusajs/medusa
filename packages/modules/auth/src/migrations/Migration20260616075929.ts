import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260616075929 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "auth_verification" ("id" text not null, "auth_identity_id" text not null, "entity_id" text not null, "entity_type" text not null, "code_provider" text not null, "verified_at" timestamptz null, "requested_at" timestamptz not null, "provider_metadata" jsonb null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "auth_verification_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auth_verification_auth_identity_id" ON "auth_verification" ("auth_identity_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auth_verification_deleted_at" ON "auth_verification" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_auth_verification_unique_auth_identity_entity_id_entity_type" ON "auth_verification" ("auth_identity_id", "entity_id", "entity_type") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "auth_verification" add constraint "auth_verification_auth_identity_id_foreign" foreign key ("auth_identity_id") references "auth_identity" ("id") on update cascade on delete cascade;`);
    this.addSql(`drop table if exists "auth_verification_token" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "auth_verification" cascade;`);
  }

}
