import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260525090000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "auth_verification_token" ("id" text not null, "auth_identity_id" text not null, "provider_identity_id" text not null, "entity_id" text not null, "token_hash" text not null, "expires_at" timestamptz not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "auth_verification_token_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auth_verification_token_auth_identity_id" ON "auth_verification_token" ("auth_identity_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auth_verification_token_provider_identity_id" ON "auth_verification_token" ("provider_identity_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auth_verification_token_token_hash" ON "auth_verification_token" ("token_hash") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auth_verification_token_expires_at" ON "auth_verification_token" ("expires_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_auth_verification_token_deleted_at" ON "auth_verification_token" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "auth_verification_token" add constraint "auth_verification_token_auth_identity_id_foreign" foreign key ("auth_identity_id") references "auth_identity" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table if exists "auth_verification_token" add constraint "auth_verification_token_provider_identity_id_foreign" foreign key ("provider_identity_id") references "provider_identity" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "auth_verification_token" cascade;`);
  }

}
